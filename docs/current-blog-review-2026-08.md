# Current Blog Review — August 2026

## Scope and baseline

The folio uses Astro content collections under `src/data/blog`. The current checkout is clean against `origin/main` except for a temporary local inventory file, which is not part of the source of truth. The inventory contains **96 Markdown files**: mostly bilingual EN/VI pairs, plus legacy unpaired posts. The editorial center of gravity is production AI engineering: agent reliability, evaluation, observability, security boundaries, MCP, RAG, orchestration, cost, and deployment.

## Existing selected topic status

The recommended topic `idempotent-ai-actions` is **already implemented in the current repository and on the production site**. It has:

- `src/data/blog/idempotent-ai-actions-en.md`
- `src/data/blog/idempotent-ai-actions-vi.md`
- `public/blog/idempotent-ai-actions/hero.png`
- `public/blog/idempotent-ai-actions/dedup-record.png`
- `public/blog/idempotent-ai-actions/retry-state-machine.png`
- `public/blog/idempotent-ai-actions/outbox-reconciliation.png`

Both language files are long-form and share the publication date `2026-01-13`, which is within the requested January–July 2026 window. Both set `draft: false`, use the same `translationKey`, and reference the same hero image.

## Content and quality review

The article has a human-like opening incident, a clear thesis, a production-oriented scope, conceptual distinctions, TypeScript and SQL examples, a retry state machine, a deduplication contract, outbox/reconciliation/compensation guidance, a failure-mode test matrix, telemetry guidance, rollout sequencing, related reading, and four visual assets including a hero/thumbnail. The Vietnamese version is a full translation rather than a short summary, and its headings, code blocks, tables, image placement, and references align with the English version.

The core claims checked against current public sources are supported by RFC 9110 for HTTP idempotent method semantics, AWS Builders' Library for caller-provided request identifiers and retry/reconciliation behavior, Stripe's idempotency documentation for result replay and parameter mismatch handling, and Microservices.io for the transactional outbox pattern and duplicate relay delivery caveat.

## Production verification

The live blog index at `https://vietdoo.vndo.vn/blog/` lists **Idempotent AI Actions: Making Tool Calls Safe to Retry** under Engineering with the date **January 13, 2026**. The live route `https://vietdoo.vndo.vn/blog/idempotent-ai-actions` renders the English article and hero image successfully. The public route is therefore deployed and reachable.

## Important discrepancy

The earlier document `docs/blog-audit-and-topic-opportunities-2026-08.md` says there are 72 Markdown files and describes the idempotent topic as a future opportunity. That document predates the current repository state. The current inventory and production site supersede those stale counts and status statements.

## References

[1]: https://www.rfc-editor.org/rfc/rfc9110.html "RFC 9110 — HTTP Semantics"
[2]: https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/ "AWS Builders' Library — Making retries safe with idempotent APIs"
[3]: https://docs.stripe.com/api/idempotent_requests "Stripe API — Idempotent requests"
[4]: https://microservices.io/patterns/data/transactional-outbox.html "Microservices.io — Transactional outbox pattern"

## Visual review

The hero is a 16:9 editorial illustration with cream paper texture, restrained charcoal/terracotta/lilac/olive palette, clear left-side title hierarchy, and a retry-safe flow ending in one effect. It is suitable both as the article hero and as the blog thumbnail. The deduplication diagram uses the same paper texture, rounded hand-drawn forms, muted accent colors, and technical labels; it is visually coherent with the hero and materially explains the article rather than serving as decoration.

The repository contains four total image assets for the post, satisfying the requested thumbnail/hero plus three in-article visuals. No new image generation is needed without creating a duplicate visual set or replacing an already coherent production asset.

## Final local validation

The local production-style page returned HTTP 200 and rendered the article title, metadata card, hero, and opening copy on both desktop (1440×1000) and mobile (390×844). The desktop before/after comparison changed 0 pixels; the mobile comparison changed 0 pixels in the final clean-server run. Manual inspection confirmed the title and hero remain readable and proportioned on both viewports.

The UI review metadata still records non-blocking development-environment diagnostics: an Astro dev-toolbar request was aborted and one Vite optimized-dependency request returned 504 during dev-server startup. There were no page errors, the route status was 200, and the production build/CI checks passed; these diagnostics are not production route failures.
