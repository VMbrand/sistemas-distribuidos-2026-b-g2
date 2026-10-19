# CP7 — Burn-rate alert policy

The availability SLO permits an error ratio of 0.5%. The fast rule pages at `14.4 × 0.5% = 7.2%` errors over one hour and must remain true for five minutes. At that rate, one hour consumes 2% of the 30-day error budget. The slow rule opens a ticket at `6 × 0.5% = 3%` errors over six hours and must remain true for thirty minutes; six hours at that rate consumes 5% of the budget.

Both rules use only the bounded `route` and `outcome` labels. They treat `rejected` as an expected Catalog API response because `Product` invariant failures, including negative requested stock, are valid business decisions.

## Alerts deliberately not created

1. **CPU threshold:** CPU alone does not establish customer impact. The Gateway can show high CPU while the catalog stock route is still available and fast; the SLO alerts use request outcomes instead.
2. **Catalog 400 response count:** a `400` for `INV-PRODUCT-002` proves that the `Product` aggregate defended the stock invariant. Alerting on it would page the team for correct validation behavior.

The alert policy covers availability only. A latency burn rule is a follow-up because the existing Gateway `proxy_read_timeout` is 10 seconds and a three-second response can breach NFR-001 without producing a 5xx result.
