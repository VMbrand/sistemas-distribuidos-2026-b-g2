<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       11-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 11

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Victor Manuel Brand Cepeda
- GITHUB_USER: VMbrand
- TEAM: Amaranta Shop — Group 2
- SPRINT_GOAL: Define and validate observability for the API Gateway catalog stock-update journey.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-W11-001 | Observe catalog stock update through API Gateway | done | [Workshop delivery 1 history](https://github.com/VMbrand/sistemas-distribuidos-2026-b-g2/commits/hu-vmbrand-w11-dev) |

## 2. My individual contribution
- Defined a W3C trace map from Catalog Portal through API Gateway and Catalog API to the Product aggregate.
- Implemented and tested a small NGINX/njs-compatible gateway trace-context and metrics spike in `11-week/workshop/03-instrumentation`.
- Defined structured logs and golden-signal metrics for the admin product-stock route.

## 3. Blockers and risks
- The official Gateway currently uses correlation IDs and JSON access logs but does not expose Prometheus metrics.
- The reflection document is linked from `11-week/workshop/README.md`.

## 4. Plan for next week
- Review the njs integration in the official Gateway repository and continue CP6 with SLOs and error budgets.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [x] Per-environment HU branch used for this individual fork
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit)
- [x] Gateway responsibility remains routing and infrastructure only
- [x] No secrets; config via environment variables

## 6. Evidence links
- [CP0 setup](https://github.com/VMbrand/sistemas-distribuidos-2026-b-g2/commit/60a0950e9b658f76d4a0d7d9ec8e35d569dba7ad)
- [CP1 journey](https://github.com/VMbrand/sistemas-distribuidos-2026-b-g2/commit/d75d703ec5130d653156bafed31e268c137dac7d)
- [CP2 log contract](https://github.com/VMbrand/sistemas-distribuidos-2026-b-g2/commit/c43b9dc698e095d0f2ba8ffa0c13a28db035bf40)
- [CP3 instrumentation](https://github.com/VMbrand/sistemas-distribuidos-2026-b-g2/commit/a202ebe917b6806aba6008959bbf9d39f945ecb4)
- [CP4 metrics](https://github.com/VMbrand/sistemas-distribuidos-2026-b-g2/commit/c664ccacf53b979dac1f1a4ac54f639734cfc2fb)
