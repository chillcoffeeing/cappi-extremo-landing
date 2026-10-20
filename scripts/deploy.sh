#!/usr/bin/env bash
# Despliegue y actualización de la landing (Astro estático) en cPanel por SSH.
# Guía: scripts/README.md · Procedimiento manual equivalente: ../docs/despliegue-cpanel.md Paso 1
#
#   bash scripts/deploy.sh               build + subir + publicar
#   bash scripts/deploy.sh --dry-run     build + paquete, sin conectar al servidor
#   bash scripts/deploy.sh --skip-build  publica el dist/ que ya existe
#   bash scripts/deploy.sh --rollback    restaura el último respaldo del servidor
#   bash scripts/deploy.sh --backup      respaldo completo de lo publicado, ahora (publicar lo hace solo)
#   --yes                                no pide confirmación
#
# Destino: ~/cappixtremo.com (addon domain), NUNCA public_html/ (es otro proyecto).
# Publica encima SIN borrar (como el "unzip -o" manual): _astro/ con hashes
# viejos sigue sirviendo a quien tenga la página en caché. Las páginas que ya
# no existen en el build se listan como huérfanas para borrarlas a mano.
# Nunca toca .htaccess, .well-known ni cgi-bin. Sirve igual para el primer despliegue.
#
# Lee el .env de la raíz del monorepo (../.env; otro: DEPLOY_ENV_FILE=ruta):
#   IP_SSH_FOR_DEPLOY, USER_SSH_FOR_DEPLOY, PORT_SSH_FOR_DEPLOY   obligatorias
#   KEY_SSH_FOR_DEPLOY, PHRASE_SSH_FOR_DEPLOY                     clave y su frase
#   LANDING_PATH_FOR_DEPLOY  carpeta en el home (cappixtremo.com)
#   LANDING_URL_FOR_DEPLOY   https://www.cappixtremo.com
# DOMAIN_ROOT_FOR_DEPLOY / DOMAIN_FOR_DEPLOY NO se usan aquí (son de otro proyecto).
set -euo pipefail

SELF="$(cd "$(dirname "$0")" && pwd)/$(basename "$0")"
cd "$(dirname "$0")/.."

DRY=0; SKIP_BUILD=0; ROLLBACK=0; YES=0; BACKUP_ONLY=0
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY=1 ;;
    --skip-build) SKIP_BUILD=1 ;;
    --rollback) ROLLBACK=1 ;;
    --backup) BACKUP_ONLY=1 ;;
    --yes) YES=1 ;;
    -h|--help) sed -n '2,/^set -euo/{/^set -euo/d;p}' "$SELF"; exit 0 ;;
    *) echo "Opción desconocida: $arg" >&2; exit 2 ;;
  esac
done
[ "$ROLLBACK" = 1 ] && [ $((DRY + SKIP_BUILD + BACKUP_ONLY)) -gt 0 ] && { echo "--rollback no se combina con otras opciones." >&2; exit 2; }

# --- .env ----------------------------------------------------------------------------------------
ENV_FILE="${DEPLOY_ENV_FILE:-../.env}"
[ -f "$ENV_FILE" ] || { echo "No encuentro $ENV_FILE (el .env de la raíz del monorepo)." >&2; exit 1; }
env_get() { { grep -E "^$1=" "$ENV_FILE" || true; } | tail -1 | cut -d= -f2- | tr -d '\r' | sed -E 's/^"(.*)"$/\1/'; }

HOST="$(env_get IP_SSH_FOR_DEPLOY)"
SSH_USER="$(env_get USER_SSH_FOR_DEPLOY)"
PORT="$(env_get PORT_SSH_FOR_DEPLOY)"
PHRASE="$(env_get PHRASE_SSH_FOR_DEPLOY)"
KEY="$(env_get KEY_SSH_FOR_DEPLOY)"; KEY_SET="$KEY"
KEY="${KEY:-$HOME/.ssh/id_ed25519}"; KEY="${KEY/#\~/$HOME}"
command -v cygpath >/dev/null 2>&1 && KEY="$(cygpath -u "$KEY")"
DEPLOY_PATH="$(env_get LANDING_PATH_FOR_DEPLOY)"; DEPLOY_PATH="${DEPLOY_PATH:-cappixtremo.com}"; DEPLOY_PATH="${DEPLOY_PATH#/}"; DEPLOY_PATH="${DEPLOY_PATH%/}"
SITE_URL="$(env_get LANDING_URL_FOR_DEPLOY)"; SITE_URL="${SITE_URL:-https://www.cappixtremo.com}"

for v in HOST SSH_USER PORT; do [ -n "${!v}" ] || { echo "Falta $v en $ENV_FILE." >&2; exit 1; }; done
[ -n "$KEY_SET" ] && [ ! -f "$KEY" ] && { echo "KEY_SSH_FOR_DEPLOY apunta a un archivo que no existe: $KEY" >&2; exit 1; }
case "$DEPLOY_PATH" in
  ""|public_html*|*bysensei*|*..*|api.*|app.*|administrador.*) echo "LANDING_PATH_FOR_DEPLOY='$DEPLOY_PATH' no parece la carpeta de la landing; me niego." >&2; exit 1 ;;
esac

STAMP="$(date +%Y%m%d-%H%M%S)"
TARBALL="$(mktemp -t cappi-landing.XXXXXX)"
WORK=deploy/landing   # relativo al home del servidor

# --- SSH -----------------------------------------------------------------------------------------
ASKPASS=""
cleanup() { [ -n "$ASKPASS" ] && rm -f "$ASKPASS"; rm -f "$TARBALL"; }
trap cleanup EXIT
if [ -n "$PHRASE" ]; then
  ASKPASS="$(mktemp)"
  printf '#!/bin/sh\nprintf "%%s\\n" "$DEPLOY_SSH_PHRASE"\n' > "$ASKPASS"
  chmod 700 "$ASKPASS"
  export DEPLOY_SSH_PHRASE="$PHRASE" SSH_ASKPASS="$ASKPASS" SSH_ASKPASS_REQUIRE=force DISPLAY="${DISPLAY:-:0}"
fi
SSH_OPTS=(-p "$PORT" -o ConnectTimeout=20 -o ServerAliveInterval=15)
[ -f "$KEY" ] && SSH_OPTS+=(-i "$KEY" -o IdentitiesOnly=yes)
remote() { ssh "${SSH_OPTS[@]}" "$SSH_USER@$HOST" "$@"; }

confirm() {
  [ "$YES" = 1 ] && return 0
  [ -t 0 ] || { echo "Sin terminal interactiva: usa --yes para confirmar." >&2; exit 1; }
  local ans; read -r -p "    Escribe $1 para continuar: " ans
  [ "$ans" = "$1" ] || { echo "Cancelado."; exit 1; }
}

# --- Respaldo (también lo hace cada publicación, antes de copiar nada) -----------------------------
if [ "$BACKUP_ONLY" = 1 ]; then
  remote "DEPLOY_PATH='$DEPLOY_PATH' WORK='$WORK' STAMP='$STAMP' bash -s" <<'REMOTE'
set -euo pipefail
mkdir -p ~/"$WORK"/backups
[ -d ~/"$DEPLOY_PATH" ] || { echo "No existe ~/$DEPLOY_PATH"; exit 1; }
tar czf ~/"$WORK"/backups/"$STAMP".tgz -C ~/"$DEPLOY_PATH" --exclude=./.well-known --exclude=./cgi-bin .
echo "Respaldo: ~/$WORK/backups/$STAMP.tgz ($(du -h ~/"$WORK"/backups/"$STAMP".tgz | cut -f1))"
REMOTE
  exit 0
fi

# --- Rollback ------------------------------------------------------------------------------------
if [ "$ROLLBACK" = 1 ]; then
  echo "==> Restaurar el último respaldo en ~/$DEPLOY_PATH"
  confirm REVERTIR
  remote "DEPLOY_PATH='$DEPLOY_PATH' WORK='$WORK' bash -s" <<'REMOTE'
set -euo pipefail
LAST="$(ls -1t ~/"$WORK"/backups/*.tgz 2>/dev/null | head -1 || true)"
[ -n "$LAST" ] || { echo "No hay respaldos en ~/$WORK/backups"; exit 1; }
echo "Respaldo: $LAST"
tar xzf "$LAST" -C ~/"$DEPLOY_PATH"
echo "Restaurado (encima de lo publicado)."
REMOTE
  exit 0
fi

# --- Build ---------------------------------------------------------------------------------------
if [ "$SKIP_BUILD" = 0 ]; then
  [ -n "$(git status --porcelain --untracked-files=no)" ] && echo "==> [WARN] hay cambios sin commit en landing/: se publican igual (no hay punto de retorno en git)"
  echo "==> Build estático (pnpm build)"
  pnpm build
fi
[ -f dist/index.html ] || { echo "dist/index.html no existe: corre el build." >&2; exit 1; }
[ -d dist/server ] && { echo "dist/server existe: el build no es estático; revisa astro.config.mjs." >&2; exit 1; }

echo "==> Empaquetando dist/"
tar czf "$TARBALL" -C dist .
echo "    $(du -h "$TARBALL" | cut -f1) · $(find dist -type f | wc -l | tr -d ' ') archivos"
if [ "$DRY" = 1 ]; then echo "==> --dry-run: no se conecta al servidor."; exit 0; fi

echo "==> Publicar en ~/$DEPLOY_PATH ($SITE_URL)"
confirm PUBLICAR

# --- Subida verificada ---------------------------------------------------------------------------
INCOMING="$WORK/incoming/$STAMP.tgz"
LOCAL_SUM="$(sha256sum "$TARBALL" | cut -d' ' -f1)"
remote "rm -rf ~/$WORK/incoming ~/$WORK/staging && mkdir -p ~/$WORK/incoming"
echo "==> Subiendo paquete"
remote "cat > ~/$INCOMING.part" < "$TARBALL"
REMOTE_SUM="$(remote "sha256sum ~/$INCOMING.part | cut -d' ' -f1")"
if [ "$LOCAL_SUM" != "$REMOTE_SUM" ]; then
  remote "rm -f ~/$INCOMING.part" || true
  echo "El paquete llegó dañado (sha256 distinto). No se publicó nada." >&2; exit 1
fi
remote "mv ~/$INCOMING.part ~/$INCOMING"
echo "    sha256 verificado"

# --- Publicación ---------------------------------------------------------------------------------
remote "DEPLOY_PATH='$DEPLOY_PATH' INCOMING='$INCOMING' STAMP='$STAMP' WORK='$WORK' bash -s" <<'REMOTE'
set -euo pipefail
TARGET=~/"$DEPLOY_PATH"
SRC=~/"$WORK"/staging
mkdir -p "$TARGET" ~/"$WORK"/backups "$SRC"
tar xzf ~/"$INCOMING" -C "$SRC" && rm -f ~/"$INCOMING"
[ -f "$SRC/index.html" ] || { echo "El paquete no trae index.html; no se publica."; rm -rf "$SRC"; exit 1; }

# Respaldo COMPLETO de lo publicado (_astro/ y .htaccess incluidos). Sin respaldo no se publica.
tar czf ~/"$WORK"/backups/"$STAMP".tgz -C "$TARGET" --exclude=./.well-known --exclude=./cgi-bin .   || { echo "No se pudo respaldar $TARGET: no se publica."; rm -rf "$SRC"; exit 1; }
echo "    respaldo: ~/$WORK/backups/$STAMP.tgz ($(du -h ~/"$WORK"/backups/"$STAMP".tgz | cut -f1))"

# Primero _astro/ y los recursos, al final los .html.
[ -d "$SRC/_astro" ] && mkdir -p "$TARGET/_astro" && cp -a "$SRC/_astro/." "$TARGET/_astro/"
( cd "$SRC" && find . -type f ! -path './_astro/*' ! -name '*.html' ! -name .htaccess -print0 | xargs -0 -r cp --parents -a -t "$TARGET" )
( cd "$SRC" && find . -type f -name '*.html' -print0 | xargs -0 -r cp --parents -a -t "$TARGET" )

# Páginas publicadas que ya no están en el build (no se borran solas).
ORPHANS="$(cd "$TARGET" && find . -type f -name '*.html' ! -path './.well-known/*' | while read -r f; do [ -f "$SRC/$f" ] || echo "$f"; done)"

find "$TARGET" -path "$TARGET/.well-known" -prune -o -path "$TARGET/cgi-bin" -prune -o -type d -exec chmod 755 {} +
find "$TARGET" -path "$TARGET/.well-known" -prune -o -path "$TARGET/cgi-bin" -prune -o -type f -exec chmod 644 {} +
rm -rf "$SRC" ~/"$WORK"/incoming
ls -1t ~/"$WORK"/backups/*.tgz 2>/dev/null | tail -n +6 | xargs -r rm -f
echo "Publicado en $TARGET"
[ -n "$ORPHANS" ] && { echo "    [WARN] páginas en el servidor que ya no están en el build (bórralas a mano si sobran):"; echo "$ORPHANS" | sed 's/^/             /'; }
true
REMOTE

# --- Comprobación --------------------------------------------------------------------------------
if command -v curl >/dev/null 2>&1; then
  echo "==> Comprobando $SITE_URL"
  curl -s -o /dev/null -w "    /                   %{http_code}\n" "$SITE_URL/" || true
  curl -s -o /dev/null -w "    /plan-vacacional/   %{http_code}\n" "$SITE_URL/plan-vacacional/" || true
  curl -s -o /dev/null -w "    /sitemap-index.xml  %{http_code}\n" "$SITE_URL/sitemap-index.xml" || true
fi
echo "Listo. Si algo falla: bash scripts/deploy.sh --rollback"
