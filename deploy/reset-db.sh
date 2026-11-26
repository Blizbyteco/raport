#!/usr/bin/env bash
#
# Reset database produksi:
#   - hapus SEMUA tabel (migrate:fresh)
#   - jalankan ulang migrasi
#   - buat satu akun admin (tanpa data demo)
#
# Mode otomatis: memakai Docker compose bila tersedia untuk repo ini
# (stack harus berjalan), jika tidak memakai `php artisan` langsung dari api/.
#
# PERINGATAN: operasi ini menghapus seluruh data. Backup dulu!

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="${DEPLOY_REPO_DIR:-$(cd "$SCRIPT_DIR/.." && pwd)}"

MODE="${DB_RESET_MODE:-auto}"
ASSUME_YES="${CONFIRM_DB_RESET:-0}"
CREATE_ADMIN=1
ADMIN_USERNAME="${DB_RESET_ADMIN_USERNAME:-admin}"
ADMIN_NAME="${DB_RESET_ADMIN_NAME:-Administrator}"
ADMIN_NIP="${DB_RESET_ADMIN_NIP:-900000000000000000}"
ADMIN_PASSWORD="${DB_RESET_ADMIN_PASSWORD:-}"

DOCKER=""
COMPOSE=""
RESOLVED_MODE=""

usage() {
  cat <<'EOF'
Reset database produksi (hapus semua tabel + migrasi ulang + akun admin).

Pemakaian:
  bash deploy/reset-db.sh [opsi]

Opsi:
  --docker              Paksa mode Docker (docker compose exec api)
  --local               Paksa mode lokal (php artisan di api/)
  --yes, -y             Lewati konfirmasi interaktif (atau CONFIRM_DB_RESET=1)
  --no-admin            Jangan buat akun admin
  --admin-username=...  Username admin (default: admin)
  --admin-name=...      Nama lengkap admin (default: Administrator)
  --admin-nip=...       NIP admin (default: 900000000000000000)
  --admin-password=...  Password admin; kosong = dibuat acak lalu ditampilkan
  -h, --help            Tampilkan bantuan

Variabel lingkungan:
  DEPLOY_REPO_DIR, CONFIRM_DB_RESET, DB_RESET_MODE,
  DB_RESET_ADMIN_USERNAME, DB_RESET_ADMIN_NAME, DB_RESET_ADMIN_NIP,
  DB_RESET_ADMIN_PASSWORD

Contoh:
  bash deploy/reset-db.sh
  DB_RESET_ADMIN_PASSWORD='RahasiaKuat123' bash deploy/reset-db.sh --yes
  bash deploy/reset-db.sh --no-admin --yes
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --docker)
      MODE="docker"
      ;;
    --local)
      MODE="local"
      ;;
    --yes | -y)
      ASSUME_YES="1"
      ;;
    --no-admin)
      CREATE_ADMIN=0
      ;;
    --admin-username=*)
      ADMIN_USERNAME="${1#*=}"
      ;;
    --admin-name=*)
      ADMIN_NAME="${1#*=}"
      ;;
    --admin-nip=*)
      ADMIN_NIP="${1#*=}"
      ;;
    --admin-password=*)
      ADMIN_PASSWORD="${1#*=}"
      ;;
    -h | --help)
      usage
      exit 0
      ;;
    *)
      echo "Opsi tidak dikenal: $1" >&2
      echo >&2
      usage >&2
      exit 1
      ;;
  esac

  shift
done

find_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    return 1
  fi

  if docker info >/dev/null 2>&1; then
    DOCKER="docker"
  elif sudo -n docker info >/dev/null 2>&1; then
    DOCKER="sudo -n docker"
  else
    return 1
  fi

  if $DOCKER compose version >/dev/null 2>&1; then
    COMPOSE="$DOCKER compose"
  elif command -v docker-compose >/dev/null 2>&1; then
    COMPOSE="docker-compose"
  else
    return 1
  fi

  return 0
}

api_service_running() {
  (cd "$REPO_DIR" && $COMPOSE ps api 2>/dev/null | grep -q "Up")
}

resolve_mode() {
  case "$MODE" in
    docker)
      RESOLVED_MODE="docker"
      return 0
      ;;
    local)
      RESOLVED_MODE="local"
      return 0
      ;;
  esac

  if find_docker && (cd "$REPO_DIR" && [[ -f docker-compose.yml ]]); then
    RESOLVED_MODE="docker"
    return 0
  fi

  if command -v php >/dev/null 2>&1 && [[ -f "$REPO_DIR/api/artisan" ]]; then
    RESOLVED_MODE="local"
    return 0
  fi

  RESOLVED_MODE="none"
}

resolve_mode

if [[ "$RESOLVED_MODE" == "none" ]]; then
  echo "ERROR: tidak menemukan Docker compose maupun PHP + api/artisan." >&2
  echo "       Jalankan dari server (repo dir: $REPO_DIR) atau pakai --docker / --local." >&2
  exit 1
fi

if [[ "$RESOLVED_MODE" == "docker" ]]; then
  if [[ -z "$COMPOSE" ]] && ! find_docker; then
    echo "ERROR: mode Docker dipilih tetapi Docker / compose tidak tersedia." >&2
    exit 1
  fi

  if ! api_service_running; then
    echo "ERROR: container 'api' tidak berjalan. Jalankan 'docker compose up -d' dulu," >&2
    echo "       atau paksa mode lokal dengan --local (DB mengikuti api/.env)." >&2
    exit 1
  fi

  DB_INFO="$(cd "$REPO_DIR" && $COMPOSE exec -T api sh -lc 'printf "%s %s/%s" "${DB_CONNECTION:-?}" "${DB_HOST:-?}" "${DB_DATABASE:-?}"' 2>/dev/null || echo "?")"
  TARGET="Docker compose service 'api' ($REPO_DIR)"
else
  if [[ ! -f "$REPO_DIR/api/vendor/autoload.php" ]]; then
    echo "ERROR: dependency PHP belum terpasang ($REPO_DIR/api/vendor tidak ada)." >&2
    exit 1
  fi

  DB_INFO="$(grep -hE '^DB_(CONNECTION|HOST|DATABASE)=' "$REPO_DIR/api/.env" 2>/dev/null | tr '\n' ' ' || true)"
  [[ -n "$DB_INFO" ]] || DB_INFO="(lihat api/.env)"
  TARGET="php artisan di $REPO_DIR/api"
fi

echo "PERINGATAN: SEMUA tabel dan data akan DIHAPUS PERMANEN."
echo "  Target   : $TARGET"
echo "  Database : $DB_INFO"
if [[ "$CREATE_ADMIN" == "1" ]]; then
  echo "  Admin    : $ADMIN_USERNAME ($ADMIN_NAME)"
else
  echo "  Admin    : tidak dibuat (--no-admin)"
fi
echo

if [[ "$ASSUME_YES" != "1" ]]; then
  if [[ ! -t 0 ]]; then
    echo "ERROR: tidak ada TTY untuk konfirmasi. Gunakan --yes untuk mode non-interaktif." >&2
    exit 1
  fi

  read -r -p 'Ketik "RESET" untuk melanjutkan: ' answer

  if [[ "$answer" != "RESET" ]]; then
    echo "Dibatalkan."
    exit 1
  fi
fi

if [[ "$RESOLVED_MODE" == "docker" ]]; then
  env_args=()

  if [[ "$CREATE_ADMIN" == "1" ]]; then
    env_args+=(
      -e "DB_RESET_ADMIN_USERNAME=$ADMIN_USERNAME"
      -e "DB_RESET_ADMIN_NAME=$ADMIN_NAME"
      -e "DB_RESET_ADMIN_NIP=$ADMIN_NIP"
    )

    if [[ -n "$ADMIN_PASSWORD" ]]; then
      env_args+=(-e "DB_RESET_ADMIN_PASSWORD=$ADMIN_PASSWORD")
    fi
  fi

  (
    cd "$REPO_DIR"

    if [[ "$CREATE_ADMIN" == "1" ]]; then
      $COMPOSE exec -T "${env_args[@]}" api php artisan db:reset --force
    else
      $COMPOSE exec -T api php artisan db:reset --force --no-admin
    fi
  )
else
  (
    cd "$REPO_DIR/api"

    if [[ "$CREATE_ADMIN" == "1" ]]; then
      DB_RESET_ADMIN_USERNAME="$ADMIN_USERNAME" \
        DB_RESET_ADMIN_NAME="$ADMIN_NAME" \
        DB_RESET_ADMIN_NIP="$ADMIN_NIP" \
        DB_RESET_ADMIN_PASSWORD="$ADMIN_PASSWORD" \
        php artisan db:reset --force
    else
      php artisan db:reset --force --no-admin
    fi
  )
fi

echo
if [[ "$CREATE_ADMIN" == "1" ]]; then
  echo "Selesai. Semua sesi lama tidak valid; login ulang dengan akun admin di atas."
else
  echo "Selesai. Semua sesi lama tidak valid dan belum ada akun admin di database."
fi
