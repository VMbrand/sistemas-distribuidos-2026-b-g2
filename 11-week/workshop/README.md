<!-- CONFIG-START -->
- FULL_NAME: Victor Manuel Brand Cepeda
- GITHUB_USER: VMbrand
- TEAM: Amaranta Shop — Group 2
- DOCS_REPO: https://github.com/code-corhuila/amaranta-shop-docs
- REFLECTION_DOC: PENDING — add the Google Docs URL before the CP0 push
- JOURNEY: Admin product stock update through API Gateway
<!-- CONFIG-END -->

# Week 11 — Observability Workshop

This individual workshop applies observability to the Amaranta Shop API Gateway. The technical contribution is trace-context propagation, structured request logging and Prometheus-compatible gateway metrics. It does not change Catalog API business behavior.

## Delivery 1 scope

The journey starts in the Catalog Portal and crosses the API Gateway, Catalog API and the `Product` aggregate while an administrator updates product stock through `PATCH /api/v1/admin/products/{id}/stock`.

## Evidence sources

- `amaranta-shop-api-gateway`: NGINX routes, `X-Correlation-Id`, rate limiting and catalog routing.
- `amaranta-shop-catalog-api`: `Product` stock invariant and the admin stock endpoint.
- `amaranta-shop-docs`: NFR-001, NFR-005 and the API Gateway contract.
