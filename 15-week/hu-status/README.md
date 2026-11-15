<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       15-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 15

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Victor Manuel Brand Cepeda
- GITHUB_USER: VMbrand
- TEAM: Amaranta Shop — Group 2
- SPRINT_GOAL: Promote the Gateway edge-security correction through develop and QA, and align the C3 operational evidence with the tracked Compose runtime.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-W15-001 | Prevent client forgery of `X-Forwarded-For` at the Gateway edge | done | [Gateway PR #14](https://github.com/code-corhuila/amaranta-shop-api-gateway/pull/14) — merged to `develop` |
| HU-W15-002 | Reapply the Gateway security correction to QA without merging permanent branches | done | [Gateway PR #15](https://github.com/code-corhuila/amaranta-shop-api-gateway/pull/15) — merged to `qa` |
| HU-W15-003 | Align the C3 guide and verifier with the tracked Amaranta Compose topology | doing | [Amaranta PR #24](https://github.com/BrandowC/amaranta/pull/24) — review required before promotion |

## 2. My individual contribution
- Created the isolated Gateway fix and promoted it with `cherry-pick -x` through `develop` and `qa`.
- Verified that the client-supplied `X-Forwarded-For` value is not trusted by the Gateway regression suite.
- Corrected the C3 guide and verifier to use the versioned NestJS Catalog service, its PostgreSQL dependency, and the root Compose file.
- Recorded the actual limitations of the current increment instead of representing the unimplemented Workflow, Worker, Outbox, metrics, load, or chaos work as complete.

## 3. Blockers and risks
- Amaranta PR #24 requires review before it can enter `develop`; its later QA and main promotions cannot be created yet.
- The Gateway release PR #12 conflicts with a newer `main`; the current `main` already contains the forwarded-address behavior through a separate commit, but release evidence must be reconciled by the team.
- Workflow, Worker, and Security are not implemented MVP3 services in the available repositories; this prevents a full Saga/Outbox claim.

## 4. Plan for next week
- Obtain the required review of PR #24, promote it per environment, and freeze the final C3 release SHA only after reproducible validation.
- Run and record the real Compose failure-path demonstration; do not claim load, chaos, alerting, or zero-downtime evidence until it has been executed.

## 5. Compliance self-check
- [x] Conventional Commits - `fix(gateway)` and `docs(c3)` evidence linked above
- [x] Per-environment promotion - fix branch to `develop`, then `qa-promote/*` to `qa`
- [x] Testable acceptance criteria - client cannot forge the forwarded address
- [x] Tests updated - Gateway routing regression covers forwarded-address behavior
- [x] DDD / hexagonal boundaries respected - Gateway change remains at the edge adapter
- [x] No secrets - all configuration remains environment-driven

## 6. Evidence links
- [Gateway PR #14: develop promotion](https://github.com/code-corhuila/amaranta-shop-api-gateway/pull/14)
- [Gateway PR #15: QA promotion](https://github.com/code-corhuila/amaranta-shop-api-gateway/pull/15)
- [Gateway PR #12: main release path, pending reconciliation](https://github.com/code-corhuila/amaranta-shop-api-gateway/pull/12)
- [Amaranta PR #24: C3 operational evidence](https://github.com/BrandowC/amaranta/pull/24)
