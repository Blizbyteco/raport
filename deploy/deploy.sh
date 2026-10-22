#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${DEPLOY_REPO_DIR:-/home/ubuntu/raport}"
BRANCH="${DEPLOY_BRANCH:-main}"
REPO_URL="${DEPLOY_REPO_URL:-}"
SKIP_GIT="${DEPLOY_SKIP_GIT:-0}"

# Lock + log files must live somewhere the deploy user can write
# (the old defaults /run + /var/log require root and broke the deploy).
if [ -n "${DEPLOY_STATE_DIR:-}" ]; then
  STATE_DIR="$DEPLOY_STATE_DIR"
elif [ -n "${HOME:-}" ] && mkdir -p "$HOME/.cache" 2>/dev/null; then
  STATE_DIR="$HOME/.cache"
else
  STATE_DIR="/tmp"
fi

LOCK="${DEPLOY_LOCK:-$STATE_DIR/raport-deploy.lock}"
LOG="${DEPLOY_LOG:-$STATE_DIR/raport-deploy.log}"

mkdir -p "$(dirname "$LOCK")" "$(dirname "$LOG")"

if command -v flock >/dev/null 2>&1; then
  exec 9>"$LOCK"
  if ! flock -n 9; then
    echo "deploy already in progress, skipping"
    exit 0
  fi
else
  echo "WARNING: flock is not available, continuing without a deploy lock" >&2
fi

deploy() {
  if [ ! -d "$REPO_DIR/.git" ]; then
    if [ -z "$REPO_URL" ]; then
      echo "ERROR: $REPO_DIR is not a git repository and DEPLOY_REPO_URL is not set" >&2
      exit 1
    fi
    echo "cloning $REPO_URL into $REPO_DIR"
    git clone --branch "$BRANCH" "$REPO_URL" "$REPO_DIR"
  fi

  cd "$REPO_DIR"

  if [ "$SKIP_GIT" != "1" ]; then
    git fetch --prune origin "$BRANCH"
    git checkout -B "$BRANCH" "origin/$BRANCH"
    git reset --hard "origin/$BRANCH"
  fi

  if docker info >/dev/null 2>&1; then
    docker_cmd="docker"
  elif sudo -n docker info >/dev/null 2>&1; then
    docker_cmd="sudo -n docker"
  else
    echo "ERROR: cannot reach the Docker daemon as $(id -un)." >&2
    echo "       Add the user to the docker group: sudo usermod -aG docker $(id -un)" >&2
    exit 1
  fi

  if $docker_cmd compose version >/dev/null 2>&1; then
    compose="$docker_cmd compose"
  elif command -v docker-compose >/dev/null 2>&1; then
    compose="docker-compose"
  else
    echo "ERROR: docker compose is not available on this server" >&2
    exit 1
  fi

  $compose up --build -d
  $docker_cmd image prune -f
}

{
  echo "=== Deploy $(date -u +%FT%TZ) ==="
  echo "repo=$REPO_DIR branch=$BRANCH user=$(id -un)"
  deploy
  echo "=== Done $(date -u +%FT%TZ) ==="
} 2>&1 | tee -a "$LOG"
