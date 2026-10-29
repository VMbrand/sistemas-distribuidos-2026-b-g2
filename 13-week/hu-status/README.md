<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       13-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 13

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Victor Manuel Brand Cepeda
- GITHUB_USER: VMbrand
- TEAM: Amaranta Shop — Group 2
- SPRINT_GOAL: Map Amaranta trust boundaries, prioritize the security backlog, and make public-edge security checks executable in CI.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-W13-001 | Model the Amaranta attack surface and STRIDE threats | done | [Threat-model commit](https://github.com/VMbrand/sistemas-distribuidos-2026-b-g2/commit/4c24f1b) |
| HU-W13-002 | Prioritize security stories with testable criteria | done | [Backlog and gate commit](https://github.com/VMbrand/sistemas-distribuidos-2026-b-g2/commit/b29b324) |
| HU-W13-003 | Run a reproducible public-edge security regression gate | done | Gateway suite passed locally through the workshop runner; CI workflow is in the same commit. |

## 2. My individual contribution
- Mapped the browser, Gateway, services and database trust boundaries for the actual Amaranta v1 path.
- Performed a STRIDE analysis and identified service-to-service identity and order resource ownership as the highest unresolved P0 risks.
- Turned the findings into six prioritized stories with owners, dependencies and testable acceptance criteria.
- Added a fork-level security workflow that rejects tracked environment files or key material and runs the official Gateway security suite at revision ebbe265.
- Ran the complete Gateway suite locally: public and encoded internal routes remain unavailable, protected routes reject missing credentials, CORS and headers are constrained, correlation input is sanitized, rate limiting returns 429, and one failed downstream service does not take down unrelated routes.

## 3. Blockers and risks
- The Security service still requires the executable B3 identity contract: issuer, public-key distribution, token lifecycle and service-to-service credential decision.
- Catalog internal stock routes are hidden from the Gateway but currently rely on network reachability; mTLS or short-lived service tokens remain P0 work.
- Sales resource-owner authorization requires explicit API ownership rules and regression tests before a production release.
- The Week 13 Moodle rubric was not available from the captured notification; this delivery follows the official Week 13 objectives: threat model, STRIDE backlog and CI security gates.

## 4. Plan for next week
- Implement the approved B3 identity contract and service-to-service credential validation.
- Add Sales order ownership authorization tests and log-redaction regression coverage.
- Promote the fork-level security checks to the owning repositories after review.

## 5. Compliance self-check
- [x] Conventional Commits - type(scope): summary
- [x] Per-environment HU branch created: hu-vmbrand-w13-dev
- [x] Testable acceptance criteria
- [x] Tests executed: official Gateway smoke and routing suite
- [x] DDD / hexagonal boundaries respected: workshop artifacts do not alter domain behavior
- [x] No secrets; config via environment variables

## 6. Evidence links
- [Week 13 workshop index](https://github.com/VMbrand/sistemas-distribuidos-2026-b-g2/tree/hu-vmbrand-w13-dev/13-week/workshop)
- [Threat model](https://github.com/VMbrand/sistemas-distribuidos-2026-b-g2/blob/hu-vmbrand-w13-dev/13-week/workshop/01-threat-model.md)
- [Security backlog](https://github.com/VMbrand/sistemas-distribuidos-2026-b-g2/blob/hu-vmbrand-w13-dev/13-week/workshop/02-security-backlog.md)
- [Security gates](https://github.com/VMbrand/sistemas-distribuidos-2026-b-g2/blob/hu-vmbrand-w13-dev/13-week/workshop/03-security-gates.md)
- [Amaranta Gateway security implementation](https://github.com/code-corhuila/amaranta-shop-api-gateway/tree/ebbe265)
- [Amaranta cross-repository evidence](https://github.com/code-corhuila/amaranta-shop-docs/pull/23)
