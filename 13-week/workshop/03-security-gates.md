# Security gates

## Gate 1: no versioned real environment files or key material

The workflow rejects a tracked file that ends in .env, a PEM file, or a keys
directory. Example environment files remain allowed because they contain names and
placeholders only. This protects the individual fork as well as the workshop files.

## Gate 2: public-edge security regression

The workflow checks out the verified Gateway revision ebbe265 and runs its owned
scripts/test.sh command in Docker. The suite proves:

1. Plain and encoded internal paths are not routed publicly.
2. Protected paths without a credential receive the common 401 envelope.
3. Correlation identifiers are generated, preserved when valid and not reflected when
   malformed.
4. Responses contain anti-sniffing and anti-framing headers.
5. CORS allows only the configured origin and preflight includes Idempotency-Key.
6. A fast request loop reaches the rate limit and receives a 429 envelope with
   Retry-After.

This gate is intentionally limited to the public edge. It does not claim to validate
the missing service identity or resource-owner authorization; those remain P0 stories
in 02-security-backlog.md.

## Local command

    GATEWAY_DIR=/path/to/amaranta-shop-api-gateway sh 13-week/workshop/scripts/verify-gateway-security.sh

The command is safe for a developer machine because the Gateway suite creates and
removes its own Docker test composition. It neither reads a real environment file nor
deploys to QA or production.
