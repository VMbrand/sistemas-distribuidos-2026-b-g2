# CP6 — SLOs and error budget

## Scope and traffic assumption

These targets apply to a future deployed environment, not to Amaranta's current local-only Compose setup. The journey is the administrator stock update: Catalog Portal → API Gateway → Catalog API → `Product` aggregate → catalog database. For budget arithmetic, this workshop assumes 20 valid stock updates per day, or 600 requests in 30 days. The number is conservative for one physical store and must be replaced with measured production traffic after deployment.

| SLO | SLI and PromQL | Target and window | Budget |
|---|---|---|---|
| Gateway availability | `1 - (sum(rate(gateway_http_requests_total{route="catalog_admin_stock",outcome=~"timeout|server_error"}[30d])) / sum(rate(gateway_http_requests_total{route="catalog_admin_stock",outcome=~"success|rejected|timeout|server_error"}[30d])))` | 99.5% over 30 days | 0.5% = 3 failed requests; 216 minutes of continuous outage at the evenly distributed 20/day assumption |
| Gateway latency | `histogram_quantile(0.95, sum by (le) (rate(gateway_http_request_duration_seconds_bucket{route="catalog_admin_stock"}[30d])))` | P95 ≤ 0.3 s over 30 days | 5% = 30 requests over 0.3 s; 2,160 minutes of the 30-day observation window may be outside the latency objective |
| Catalog decision completion | `sum(rate(catalog_http_requests_total{route="admin_product_stock",outcome=~"success|rejected"}[30d])) / sum(rate(catalog_http_requests_total{route="admin_product_stock",outcome=~"success|rejected|server_error"}[30d]))` | 99.5% over 30 days | 0.5% = 3 requests without a valid `Product` decision; 216 equivalent outage minutes |

`rejected` is good for the availability and decision SLIs when Catalog API returns a valid business response, such as `INV-PRODUCT-002`. A rejected negative stock value is not a platform failure.

## Error-budget policy

| Budget consumed | Delivery policy | Required response |
|---|---|---|
| 50% | Freeze non-essential API Gateway routing and observability changes for this route. | Review the last deployment and validate Catalog API latency and Mongo pool metrics. |
| 75% | Pause feature releases that touch Catalog Portal, Gateway or Catalog API. | Open an incident, assign an Incident Commander and prioritize reliability work. |
| 100% | Only corrective, rollback or security changes may ship. | Keep the incident open until the SLI recovers; document remediation before resuming feature delivery. |

The 300 ms latency target follows Amaranta NFR-001 for critical endpoints. The Gateway's present `proxy_connect_timeout` is 2 seconds and its `proxy_read_timeout` is 10 seconds; a request can therefore violate the latency SLO long before it becomes an availability failure.
