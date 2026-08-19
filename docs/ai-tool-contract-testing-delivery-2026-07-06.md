# AI Tool Contract Testing — Delivery Report

**Date:** 2026-07-06  
**Repository:** `vietdoo/vietdoo-folio`  
**Selected article:** `ai-tool-contract-testing`  
**Languages:** English and Vietnamese  
**Publication date:** 2026-07-06

## Editorial decision

The folio inventory already covers model routing, provider failover, idempotent actions, decision traces, observability, durable execution, prompt injection, MCP boundaries, evals, provenance, and agent identity. The selected topic adds a distinct production layer: **proving that an agent can safely use a capability across tool implementations, MCP servers, model providers, and adapter versions**.

The article separates shape, semantic, policy, side-effect, and operational contracts. It also covers consumer-driven contracts, capability matrices, negative paths, property-based and metamorphic tests, shadow execution, release gates, and privacy-aware test artifacts.

## Ten opportunities considered

1. Contract testing for AI tools and MCP capabilities.
2. Cross-provider output drift detection.
3. AI agent admission control and overload shedding.
4. Capability tokens for least-privilege agent actions.
5. Versioned agent releases with canary and rollback.
6. Incident response runbooks for tool-using agents.
7. Evidence graphs for agentic search claims.
8. Semantic caching freshness contracts.
9. Abstention and escalation states for uncertain agents.
10. AI data contracts for real-time pipelines.

## Research sources

- [Pact Documentation](https://docs.pact.io/) — consumer-driven contract testing.
- [Model Context Protocol Tools Specification](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) — input/output schemas, validation, access control, rate limiting, and human-in-the-loop guidance.
- [JSON Schema Getting Started](https://json-schema.org/learn/getting-started-step-by-step) — machine-readable shape constraints.

## Assets

- `public/blog/ai-tool-contract-testing/hero.png` — hero/thumbnail.
- `public/blog/ai-tool-contract-testing/contract-matrix.png` — five-layer contract matrix.
- `public/blog/ai-tool-contract-testing/contract-test-pipeline.png` — consumer/provider verification pipeline.
- `public/blog/ai-tool-contract-testing/compatibility-failure-map.png` — negative-path compatibility map.

All four images use the same warm ivory whiteboard-app style, graphite marker outlines, imperfect hand-drawn strokes, restrained pastel accents, concise technical labels, and clear causal flow.

## Verification

- Astro check: 0 errors; existing project hints remain unchanged.
- Unit tests: 19 passed.
- Astro/Vercel build: passed.
- New article route generated: `/blog/ai-tool-contract-testing/`.
- EN/VI front matter uses the same `translationKey` and publication date.
- `git diff --check`: passed.
