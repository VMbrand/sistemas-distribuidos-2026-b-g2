# Threat model: Amaranta Shop v1

## Scope

The model covers the demonstrated v1 customer path: browser, Front shell and portal
remotes, API Gateway, Catalog API, Sales API, MongoDB and PostgreSQL. It also
records the internal stock path from Sales to Catalog because it crosses a service
trust boundary.

## Data flow and trust boundaries

    Untrusted browser
          |
          | HTTPS and Bearer token when required
          v
    Front shell and portal remotes
          |
          | Public API only
          v
      API Gateway
       |       |
       v       v
    Catalog    Sales
      API       API
       |         |
       v         v
    MongoDB  PostgreSQL

Sales also calls Catalog through the internal stock reserve and release protocol.

| Boundary | Trust change | Existing control | Current status |
|---|---|---|---|
| Browser to Gateway | Untrusted internet to public edge | Route allowlist, CORS allowlist, rate limit, security headers and correlation validation | Verified by Gateway smoke tests |
| Gateway to Catalog or Sales | Edge to application service | Gateway rejects a missing credential for protected paths; each service validates RS256 JWT and authorizes the action | Catalog tests prove ADMIN authorization; end-to-end identity issuance remains B3 |
| Sales to Catalog internal routes | One service to another | Gateway never exposes internal routes | Public exposure is tested; per-call service identity is a P0 gap |
| API to database | Application identity to durable data | catalog_app and sales_app are restricted to their own data boundary | Runtime and migration composition checks passed |

## STRIDE findings

| ID | Threat | Boundary | Risk | Existing mitigation | Required next action |
|---|---|---|---|---|---|
| SEC-01 | Spoofed or expired bearer token reaches a protected resource | Gateway to API | High | Catalog service accepts RS256 only, requires subject and expiry, and tests forged, expired, none and HS256 tokens | Connect the configured issuer and public-key distribution through the B3 identity contract |
| SEC-02 | A caller without ADMIN changes catalog data | Browser to Gateway to Catalog | High | Gateway requires a credential; Catalog checks ADMIN in every admin router and tests 401 and 403 behavior | Keep the authorization test as a mandatory CI gate |
| SEC-03 | A compromised neighbor calls Catalog internal stock routes | Sales to Catalog | High | Internal paths are not public through Gateway, including encoded path bypass attempts | Add short-lived service identity or mTLS and validate it in Catalog before B3 promotion |
| SEC-04 | A user reads another customer's order by altering an identifier | Browser to Gateway to Sales | High | Order path is credential-protected at the Gateway | Add resource-ownership authorization tests in Sales API before a production release |
| SEC-05 | Token, password or personal data enters logs | All request boundaries | High | Gateway and Catalog log contracts omit token and body values; correlation IDs remain searchable | Add a log-redaction regression gate for every API |
| SEC-06 | Excess public traffic exhausts downstream services | Browser to Gateway | Medium | Gateway rate limit returns 429 with Retry-After and the common envelope | Verify threshold suitability with measured traffic after QA topology exists |
| SEC-07 | Database user changes another domain's data | API to database | Medium | Separate database engines and least-privilege domain users | Preserve privilege checks in migration CI and restore rehearsals |

## Security conclusion

The public edge and Catalog authorization have executable protections. The principal
unresolved zero-trust risk is the unauthenticated internal stock protocol: hiding it
behind the network is not sufficient for a production trust model. It is deliberately
recorded as a P0 backlog item rather than represented as solved.
