# Security backlog for Amaranta v1

The stories below come from the Week 13 STRIDE model. Priority uses likelihood and
impact: P0 must be resolved before a production release, P1 belongs in the next
security increment, and P2 is measured and revisited after QA topology exists.

| ID | Priority | Security story | Testable acceptance criteria | Owner and dependency |
|---|---|---|---|---|
| HU-W13-SEC-001 | P0 | As the platform owner, I need every protected Catalog and Sales action to validate the issuer, signature, expiry and role of a bearer token so a forged or expired token cannot authorize a request. | Invalid, expired, none and HS256 tokens return 401; a valid non-ADMIN caller receives 403 on every Catalog administration operation; a valid ADMIN caller succeeds. | Security, Catalog API, Sales API; needs executable B3 issuer and key-distribution contract. |
| HU-W13-SEC-002 | P0 | As the platform owner, I need the Sales to Catalog stock protocol to authenticate the calling service so a compromised neighbor cannot reserve or release stock. | Catalog internal stock routes reject a missing or invalid short-lived service credential; only the Sales service identity can reserve and release; a public Gateway request remains 404 for encoded and plain internal paths. | Security, Sales API, Catalog API, Gateway; needs service-token or mTLS decision. |
| HU-W13-SEC-003 | P0 | As a customer, I need order reads to be authorized against the order owner so changing an identifier cannot disclose another customer's order. | A caller receives only its own orders; another valid caller gets 403 or 404 without order details; an ADMIN rule is explicit and tested. | Sales API; needs resource-owner contract. |
| HU-W13-SEC-004 | P1 | As an operator, I need request logs to redact tokens, credentials and bodies so diagnostics do not disclose secrets. | Regression tests place unique leak markers in Authorization, Cookie and request body values; no marker appears in service or Gateway logs. | Gateway, Catalog API, Sales API. |
| HU-W13-SEC-005 | P1 | As a reviewer, I need security checks in pull-request CI so unsafe routes and versioned environment files cannot merge unnoticed. | CI fails when a real environment file or key is tracked; the Gateway suite proves internal routes are 404, protected paths reject missing credentials, CORS rejects an untrusted origin and rate limiting returns 429. | Repository owners; this workshop adds the fork-level gate. |
| HU-W13-SEC-006 | P2 | As the platform owner, I need public rate-limit thresholds to be evidence-based so traffic spikes do not exhaust services or block normal users. | A QA load measurement records the accepted rate, 429 ratio and downstream latency; the chosen limit and burst have an owner and review date. | Gateway and operations; waits for QA topology. |

## Prioritization decision

The highest risk is not the public Gateway allowlist. Its internal-route, credential,
header, CORS and rate-limit behavior is already executable in the Gateway suite. The
highest unresolved risks are service-to-service identity and Sales resource ownership.
They are P0 because a network-only trust boundary or identifier-only lookup can expose
or modify another domain's data.

## Definition of done for this security increment

This workshop is complete when the model, backlog and CI gate are committed in the
individual Week 13 branch and the local Gateway security suite passes. The P0 stories
remain open product work until their owning services implement and test the B3
identity contract.
