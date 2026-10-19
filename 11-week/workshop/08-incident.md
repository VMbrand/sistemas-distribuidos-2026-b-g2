# CP9 — Incident drill and blameless postmortem

## Drill: slow Catalog API dependency

The drill assumes Catalog API answers in 3 seconds for 25% of stock-update requests during 40 minutes. The API Gateway `proxy_read_timeout` is 10 seconds, so these requests return `200` rather than timing out. This is a latency incident, not an availability outage.

### One slow trace

- `catalog-portal.update-stock` — 3,012 ms
  - `api-gateway.route-catalog-admin` — 3,008 ms
    - `catalog-api.patch-product-stock` — 3,001 ms
      - `catalog-db.conditional-stock-update` — 2,987 ms

```json
{"timestamp":"2026-10-19T16:10:00.000Z","level":"INFO","service":"catalog-portal","version":"0.3.0-dev","environment":"local","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"1111111111111111","correlation_id":"cat-stock-drill-01","event":"catalog.stock.requested","message":"Administrator requested product stock update","duration_ms":2,"product_id":"66b3c789a3124e9f12345678","catalog_operation":"set_stock","requested_stock":12,"actor_role":"ADMIN","http_status":0}
{"timestamp":"2026-10-19T16:10:00.004Z","level":"INFO","service":"api-gateway","version":"0.3.0-dev","environment":"local","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"2222222222222222","correlation_id":"cat-stock-drill-01","event":"gateway.catalog.forwarded","message":"Catalog stock request forwarded","duration_ms":4,"product_id":"66b3c789a3124e9f12345678","catalog_operation":"set_stock","requested_stock":12,"actor_role":"ADMIN","http_status":0}
{"timestamp":"2026-10-19T16:10:03.005Z","level":"WARN","service":"catalog-api","version":"0.3.0-dev","environment":"local","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"4444444444444444","correlation_id":"cat-stock-drill-01","event":"catalog.product.stock.completed","message":"Catalog database operation exceeded latency objective","duration_ms":3001,"product_id":"66b3c789a3124e9f12345678","catalog_operation":"set_stock","requested_stock":12,"actor_role":"ADMIN","http_status":200}
{"timestamp":"2026-10-19T16:10:03.012Z","level":"INFO","service":"api-gateway","version":"0.3.0-dev","environment":"local","trace_id":"4bf92f3577b34da6a3ce929d0e0e4736","span_id":"2222222222222222","correlation_id":"cat-stock-drill-01","event":"gateway.catalog.completed","message":"Catalog API response returned to portal","duration_ms":3008,"product_id":"66b3c789a3124e9f12345678","catalog_operation":"set_stock","requested_stock":12,"actor_role":"ADMIN","http_status":200}
```

With 40 sampled requests, 10 are slow. Availability remains 100%, but latency compliance is 75%, below the 95% latency SLO; the drill consumes 10 of the 30 permitted slow requests (33.3% of the monthly latency budget). Neither CP7 availability alert fires because no request is `timeout` or `server_error`. The on-call engineer manually starts the CP8 runbook from the latency dashboard and first checks the downstream trace before considering rollback.

## Blameless postmortem

| Time | Event |
|---|---|
| 16:00 | Drill begins; one quarter of Catalog API calls are delayed. |
| 16:10 | Dashboard shows Gateway P95 above 3 seconds; no availability page fires. |
| 16:20 | On-call correlates Gateway and Catalog API logs by `trace_id`. |
| 16:40 | Drill ends; 10 of 40 requests exceeded the latency target. |
| 16:55 | Team records the alerting gap and follow-up work. |

The impact is ten slow stock updates and 33.3% of the monthly latency budget; no `Product` stock invariant was bypassed and no availability budget was spent. The simulated root cause is a delayed downstream Catalog API dependency. Contributing factors were the 10-second Gateway read timeout and the absence of a latency burn-rate alert. No individual caused the incident.

### Action items

1. **As a Gateway owner, I want a latency-burn alert for `catalog_admin_stock` so that a three-second Catalog API response is detected before the availability budget is affected.** Acceptance: the alert evaluates the histogram from CP4 and pages when P95 exceeds 300 ms for the agreed window.
2. **As a Catalog API owner, I want a load test for `PATCH /api/v1/admin/products/{id}/stock` so that Product validation and MongoDB latency are measured under the NFR-001 target.** Acceptance: the test reports P95, P99 and request outcomes at the documented load.
3. **As an operator, I want matching `trace_id` values in Gateway and Catalog API logs so that one slow stock update can be diagnosed without inspecting personal data.** Acceptance: an automated test verifies the same trace ID on the outbound Gateway call and the Catalog API request log.
