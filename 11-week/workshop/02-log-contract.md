# CP2 — Structured log contract

Every line is one JSON object written to stdout. A trace query joins the API Gateway, Catalog API and catalog database activity for one `Product` stock update.

| Field | Type | Required | Example | Purpose |
|---|---|---:|---|---|
| `timestamp` | string | yes | `2026-10-19T14:42:11.482Z` | UTC event order |
| `level` | string | yes | `INFO` | operational severity |
| `service` | string | yes | `api-gateway` | emitting component |
| `version` | string | yes | `0.3.0-dev` | deployed revision |
| `environment` | string | yes | `local` | execution context |
| `trace_id` | string | yes | `4bf92f3577b34da6a3ce929d0e0e4736` | joins distributed spans |
| `span_id` | string | yes | `00f067aa0ba902b7` | identifies one operation |
| `correlation_id` | string | yes | `cat-stock-1042` | supports current Amaranta envelopes |
| `event` | string | yes | `gateway.catalog.forwarded` | stable machine event |
| `message` | string | yes | `Catalog stock request forwarded` | concise diagnosis |
| `duration_ms` | number | yes | `84` | latency analysis |
| `product_id` | string | yes | `66b3c789a3124e9f12345678` | Catalog `Product` affected |
| `catalog_operation` | string | yes | `set_stock` | bounded operation name |
| `requested_stock` | integer | optional | `12` | value validated by Catalog API |
| `actor_role` | string | yes | `ADMIN` | authorization context without identity |
| `http_status` | integer | yes | `200` | request result |

## Never log

- `Authorization` headers, JWTs, passwords or token claims: omit the fields completely.
- Administrator email, name or IP address: use no direct identifier; retain only `actor_role`.
- Complete request bodies: record the bounded fields above, never arbitrary payloads.
- MongoDB connection strings or credentials: omit them completely.

## Log level policy

| Level | Gateway example |
|---|---|
| `ERROR` | Catalog API timeout after the configured upstream timeout |
| `WARN` | Catalog API rejected a requested stock value under `INV-PRODUCT-002` |
| `INFO` | Authenticated admin stock update completed |
| `DEBUG` | Validated route classification in a local environment only |

## Example trace: rejected stock update after an upstream retry

```json
{"timestamp":"2026-10-19T14:42:11.482Z","level":"INFO","service":"catalog-portal","version":"0.3.0-dev","environment":"local","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"1111111111111111","correlation_id":"cat-stock-1042","event":"catalog.stock.requested","message":"Administrator requested product stock update","duration_ms":2,"product_id":"66b3c789a3124e9f12345678","catalog_operation":"set_stock","requested_stock":12,"actor_role":"ADMIN","http_status":0}
{"timestamp":"2026-10-19T14:42:11.495Z","level":"INFO","service":"api-gateway","version":"0.3.0-dev","environment":"local","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"2222222222222222","correlation_id":"cat-stock-1042","event":"gateway.catalog.forwarded","message":"Catalog stock request forwarded","duration_ms":13,"product_id":"66b3c789a3124e9f12345678","catalog_operation":"set_stock","requested_stock":12,"actor_role":"ADMIN","http_status":0}
{"timestamp":"2026-10-19T14:42:14.496Z","level":"ERROR","service":"api-gateway","version":"0.3.0-dev","environment":"local","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"2222222222222222","correlation_id":"cat-stock-1042","event":"gateway.catalog.timeout","message":"Catalog API did not answer before timeout","duration_ms":3001,"product_id":"66b3c789a3124e9f12345678","catalog_operation":"set_stock","requested_stock":12,"actor_role":"ADMIN","http_status":504}
{"timestamp":"2026-10-19T14:42:15.006Z","level":"INFO","service":"api-gateway","version":"0.3.0-dev","environment":"local","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"3333333333333333","correlation_id":"cat-stock-1042","event":"gateway.catalog.retry.forwarded","message":"Catalog stock request forwarded after retry","duration_ms":4,"product_id":"66b3c789a3124e9f12345678","catalog_operation":"set_stock","requested_stock":-1,"actor_role":"ADMIN","http_status":0}
{"timestamp":"2026-10-19T14:42:15.041Z","level":"INFO","service":"catalog-api","version":"0.3.0-dev","environment":"local","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"4444444444444444","correlation_id":"cat-stock-1042","event":"catalog.product.stock.validation_started","message":"Product stock validation started","duration_ms":1,"product_id":"66b3c789a3124e9f12345678","catalog_operation":"set_stock","requested_stock":-1,"actor_role":"ADMIN","http_status":0}
{"timestamp":"2026-10-19T14:42:15.043Z","level":"WARN","service":"catalog-api","version":"0.3.0-dev","environment":"local","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"4444444444444444","correlation_id":"cat-stock-1042","event":"catalog.product.stock.rejected","message":"Requested stock violates INV-PRODUCT-002","duration_ms":3,"product_id":"66b3c789a3124e9f12345678","catalog_operation":"set_stock","requested_stock":-1,"actor_role":"ADMIN","http_status":400}
{"timestamp":"2026-10-19T14:42:15.050Z","level":"INFO","service":"api-gateway","version":"0.3.0-dev","environment":"local","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"3333333333333333","correlation_id":"cat-stock-1042","event":"gateway.catalog.completed","message":"Catalog API rejection returned to portal","duration_ms":44,"product_id":"66b3c789a3124e9f12345678","catalog_operation":"set_stock","requested_stock":-1,"actor_role":"ADMIN","http_status":400}
```
