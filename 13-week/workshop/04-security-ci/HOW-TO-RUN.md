# Run the Gateway negative authorization regression

This evidence covers issue `#31` (the protected-route credential boundary) and
the Catalog internal-route protection described in the Browser-to-Gateway STRIDE
analysis.

## Prerequisites

- Docker Desktop is running.
- A local checkout of `amaranta-shop-api-gateway` is available at the verified
  revision `ebbe265` or its compatible `develop` branch.

## Command

```sh
GATEWAY_DIR=/absolute/path/to/amaranta-shop-api-gateway \
  sh 13-week/workshop/04-security-ci/test-catalog-internal-route.sh
```

On Windows with Git Bash installed, use PowerShell to set the directory and let
Git Bash run the portable shell script:

```powershell
$env:GATEWAY_DIR = 'C:\path\to\amaranta-shop-api-gateway'
& 'C:\Program Files\Git\bin\bash.exe' 13-week/workshop/04-security-ci/test-catalog-internal-route.sh
```

## Expected negative checks

The delegated, Gateway-owned suite must show these cases as successful:

- `POST /internal/products/reserve-stock` returns `404`.
- Traversal and encoded variants from `/api/v1/products/` cannot reach the
  internal Catalog route.
- A protected public route without `Authorization` returns `401` with the
  shared error envelope.
- A burst of proxied public traffic eventually returns `429`.

The output `OK: the gateway passes every check` is the successful result. The
same suite is used by the proposal in `security.yml`.

## Recorded local result

The Gateway-owned suite completed successfully against revision `ebbe265`:

```text
== the image builds and the configuration is valid
nginx: configuration file /etc/nginx/nginx.conf test is successful
...
OK: the gateway passes every check
```
