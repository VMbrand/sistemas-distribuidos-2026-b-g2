# CP4 — Golden signals and metric catalog

The stock-update journey crosses the Catalog Portal, API Gateway and Catalog API. The gateway measures the public route and Catalog API measures `Product` validation and persistence. The catalog database remains an internal dependency; it is diagnosed through Catalog API latency rather than by exposing a public database metric.

## API Gateway

| Signal | Metric | Type | Labels | Dashboard query |
|---|---|---|---|---|
| Latency | `gateway_http_request_duration_seconds` | histogram | `route`, `outcome` | `histogram_quantile(0.95, sum by (le) (rate(gateway_http_request_duration_seconds_bucket{route="catalog_admin_stock"}[5m])))` |
| Traffic | `gateway_http_requests_total` | counter | `route`, `outcome` | `sum(rate(gateway_http_requests_total{route="catalog_admin_stock"}[5m]))` |
| Errors | `gateway_http_requests_total` | counter | `route`, `outcome` | `sum(rate(gateway_http_requests_total{route="catalog_admin_stock",outcome=~"timeout|server_error"}[5m]))` |
| Saturation | `gateway_http_requests_in_flight` | gauge | `route` | `max(gateway_http_requests_in_flight{route="catalog_admin_stock"})` |

## Catalog API

| Signal | Metric | Type | Labels | Dashboard query |
|---|---|---|---|---|
| Latency | `catalog_http_request_duration_seconds` | histogram | `route`, `outcome` | `histogram_quantile(0.95, sum by (le) (rate(catalog_http_request_duration_seconds_bucket{route="admin_product_stock"}[5m])))` |
| Traffic | `catalog_http_requests_total` | counter | `route`, `outcome` | `sum(rate(catalog_http_requests_total{route="admin_product_stock"}[5m]))` |
| Errors | `catalog_http_requests_total` | counter | `route`, `outcome` | `sum(rate(catalog_http_requests_total{route="admin_product_stock",outcome=~"rejected|server_error"}[5m]))` |
| Saturation | `catalog_mongo_pool_checked_out_connections` | gauge | none | `max(catalog_mongo_pool_checked_out_connections)` |

## Labels and cardinality

`route` uses bounded route names such as `catalog_admin_stock`, never raw URLs or product IDs. `outcome` is a fixed set: `success`, `rejected`, `unauthorized`, `timeout`, `server_error`. Product ID, administrator email, `trace_id`, `span_id`, `correlation_id` and raw request path are forbidden metric labels because they create unbounded cardinality or disclose data.

## Histogram buckets

The chosen gateway and Catalog API buckets are `0.05, 0.1, 0.3, 0.6, 1, 3` seconds. Amaranta NFR-001 sets P95 below 300 ms and P99 below 600 ms for critical endpoints. The 1 s and 3 s buckets separate degraded requests and the three-second downstream timeout from normal operation.
