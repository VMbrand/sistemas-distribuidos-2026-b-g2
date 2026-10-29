#!/usr/bin/env sh
set -eu

: "${GATEWAY_DIR:?Set GATEWAY_DIR to amaranta-shop-api-gateway}"

# The owning Gateway suite creates its isolated Docker network and verifies that
# every public-path, traversal, and encoded-path attempt to reach the Catalog
# stock endpoints returns 404. It also checks the protected public routes still
# fail with 401 when the Authorization header is absent.
cd "$GATEWAY_DIR"
sh scripts/test.sh
