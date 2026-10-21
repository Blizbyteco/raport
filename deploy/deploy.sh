#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${DEPLOY_REPO_DIR:-/home/ubuntu/raport}"
BRANCH="${DEPLOY_BRANCH:-main}"
LOCK="${DEPLOY_LOCK:-/run/raport-deploy.lock}"
LOG="${DEPLOY_LOG:-/var/log/raport-deploy.log}"

exec 9>"$LOCK"
if ! flock -n 9; then
  echo "deploy already in progress, skipping" >&2
  exit 0
fi

cd "$REPO_DIR"
{
  echo "=== Deploy $(date -u +%FT%TZ) ==="
  git fetch --prune origin "$BRANCH"
  git reset --hard "origin/$BRANCH"
  docker compose up --build -d
  docker image prune -f
  echo "=== Done $(date -u +%FT%TZ) ==="
} >>"$LOG" 2>&1
