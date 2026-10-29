# Week 13 security workshop

<!-- CONFIG-START -->
- FULL_NAME: Victor Manuel Brand Cepeda
- GITHUB_USER: VMbrand
- TEAM: Amaranta Shop - Group 2
- DOCS_REPO: https://github.com/code-corhuila/amaranta-shop-docs
- BOUNDARY: Gateway and Sales APIs -> Catalog API inbound interface
- CLAIM_ISSUE: https://github.com/code-corhuila/amaranta-shop-docs/issues/29
- STORIES: https://github.com/code-corhuila/amaranta-shop-docs/issues/31, https://github.com/code-corhuila/amaranta-shop-docs/issues/32, https://github.com/code-corhuila/amaranta-shop-docs/issues/33
- REFLECTION_DOC:
- LIBRARY_BOOK:
- LIBRARY_RECORD_TIME:
<!-- CONFIG-END -->

This individual technical contribution applies the week 13 security material to the
Amaranta Shop distributed system. It does not claim that the system is production
secure. It maps the real trust boundaries, turns the highest risks into testable
backlog items, and makes the existing Gateway security suite executable from this
fork.

## Contents

1. 01-attack-surface.md maps the real data flow, trust boundaries, assets, and entry points.
2. 01-threat-model.md is the earlier technical analysis that informed the team-docs PR.
3. 02-security-backlog.md prioritizes the findings and gives each one a testable
   acceptance criterion.
4. 03-security-gates.md explains the checks run by the CI workflow.
5. scripts/verify-gateway-security.sh runs the official Gateway security suite
   against a checked-out Gateway repository.

The author must complete the reflection and the physical-library fields above
from genuine personal evidence. They are intentionally not inferred from online
material or replaced with a generic citation.

## Local verification

Set GATEWAY_DIR to a checkout of amaranta-shop-api-gateway, then run:

    GATEWAY_DIR=/path/to/amaranta-shop-api-gateway sh 13-week/workshop/scripts/verify-gateway-security.sh

The command delegates to the Gateway-owned test suite. It verifies internal routes
remain unpublished, protected routes reject a missing credential, headers and CORS
are constrained, correlation identifiers are sanitized, and rate limiting returns
the shared error contract.

## Scope and evidence

The Gateway revision used for this workshop is ebbe265 on develop. The cross-repository
evidence and remaining identity-boundary work are tracked in Amaranta Docs PR #23:
https://github.com/code-corhuila/amaranta-shop-docs/pull/23
