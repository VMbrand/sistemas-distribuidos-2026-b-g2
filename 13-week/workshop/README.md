# Week 13 security workshop

This individual technical contribution applies the week 13 security material to the
Amaranta Shop distributed system. It does not claim that the system is production
secure. It maps the real trust boundaries, turns the highest risks into testable
backlog items, and makes the existing Gateway security suite executable from this
fork.

## Contents

1. 01-threat-model.md maps the data flow, trust boundaries and STRIDE findings.
2. 02-security-backlog.md prioritizes the findings and gives each one a testable
   acceptance criterion.
3. 03-security-gates.md explains the checks run by the CI workflow.
4. scripts/verify-gateway-security.sh runs the official Gateway security suite
   against a checked-out Gateway repository.

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
