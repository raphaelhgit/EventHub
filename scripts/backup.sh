#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/eventhub"
DB_PATH="$APP_DIR/back/data/eventhub.db"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/eventhub}"
KEEP_DAYS="${KEEP_DAYS:-14}"

mkdir -p "$BACKUP_DIR"

if [[ ! -f "$DB_PATH" ]]; then
  echo "Erreur: base introuvable ($DB_PATH)" >&2
  exit 1
fi

STAMP="$(date +%Y-%m-%d_%H-%M-%S)"
DEST="$BACKUP_DIR/eventhub-${STAMP}.db"

if command -v sqlite3 >/dev/null 2>&1; then
  sqlite3 "$DB_PATH" ".backup '$DEST'"
else
  cp "$DB_PATH" "$DEST"
fi

find "$BACKUP_DIR" -name 'eventhub-*.db' -type f -mtime +"$KEEP_DAYS" -delete

echo "Backup créé: $DEST"
