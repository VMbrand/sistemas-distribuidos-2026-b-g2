#!/usr/bin/env sh
# Runs the security regression suite owned by the official API Gateway repository.
set -eu

: "${GATEWAY_DIR:?set GATEWAY_DIR to an amaranta-shop-api-gateway checkout}"
[ -d "$GATEWAY_DIR" ] || {
  echo "GATEWAY_DIR is not a directory: $GATEWAY_DIR" >&2
  exit 1
}
[ -f "$GATEWAY_DIR/scripts/test.sh" ] || {
  echo "GATEWAY_DIR does not contain scripts/test.sh" >&2
  exit 1
}

cd "$GATEWAY_DIR"
sh scripts/test.sh
