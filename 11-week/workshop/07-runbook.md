# CP8 — Runbook: Gateway catalog availability fast burn

## Symptoms and confirmation

The `GatewayCatalogAvailabilityFastBurn` page means the `catalog_admin_stock` route exceeded 7.2% `timeout` or `server_error` outcomes for one hour and stayed above that threshold for five minutes. Confirm it with:

```promql
sum(rate(gateway_http_requests_total{route="catalog_admin_stock",outcome=~"timeout|server_error"}[1h]))
/
sum(rate(gateway_http_requests_total{route="catalog_admin_stock",outcome=~"success|rejected|timeout|server_error"}[1h]))
```

Find one affected request by `trace_id` in the API Gateway and Catalog API JSON logs. Compare its `gateway.catalog.forwarded`, timeout or completion event with the Catalog API `catalog.product.stock.*` events. Never search tokens, request bodies or administrator email addresses.

## First mitigations, lowest risk first

1. **Rollback the latest Gateway configuration or Catalog API release** only if the alert begins after a known deployment; use the last known-good revision and verify the route-specific error ratio for fifteen minutes.
2. **Temporarily reject new admin stock-update requests at the Gateway** with a clear `503` response if retries are increasing load on Catalog API. Keep public product browsing routes available.
3. **Scale or restart Catalog API only in an environment where that operation is documented and approved.** The current local Compose environment has no production autoscaling control; do not improvise a production-scale action from the workshop.

## Escalation and recovery

The on-call engineer collects the trace and runs the checks. The Incident Commander decides rollback or traffic restriction. The Catalog API owner investigates `Product` validation, MongoDB connectivity and pool saturation. The Gateway owner checks route, resolver and timeout configuration.

Recovery requires all of the following for fifteen minutes: the availability ratio is below the fast-burn threshold, P95 gateway latency is below 300 ms, Catalog API returns valid `success` or `rejected` outcomes, and new traces contain matching Gateway and Catalog API trace IDs. Record the incident and any configuration change before closing it.
