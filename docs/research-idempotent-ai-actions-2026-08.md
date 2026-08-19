# Research notes: Idempotent AI actions

## Sources reviewed

1. [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html). Defines HTTP method semantics and the notion that idempotent methods may be repeated automatically after a communication failure.
2. [AWS Builders' Library — Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/). Explains caller-provided request identifiers, semantic equivalence, atomic server-side recording, late-arriving requests, and reconciliation after unknown outcomes.
3. [Stripe API — Idempotent requests](https://docs.stripe.com/api/idempotent_requests). Documents saving the first status/body for a key, returning the same result on reuse, rejecting parameter mismatches, avoiding sensitive data in keys, and key pruning.
4. [Microservices.io — Transactional outbox pattern](https://microservices.io/patterns/data/transactional-outbox.html). Explains writing business state and an outbox message in one database transaction, then relaying it separately; relay delivery can repeat, so consumers must remain idempotent.

## Editorial conclusions

The article should distinguish a repeated delivery attempt from a new business intention. An opaque application-owned action ID and idempotency key should be created at intent acceptance, not per transport retry. The server should atomically reserve the key, compare a canonical request fingerprint, store the resulting response, and treat timeout or disconnect as an unknown outcome that requires reconciliation before replaying a non-idempotent tool. An outbox improves durability between local state and delivery, but it does not create exactly-once external execution by itself. Compensation is not the same as rollback and must itself be safe to retry.

## Existing repository audit

The repository currently has 72 Markdown files in `src/data/blog`: 34 bilingual translation groups plus 4 legacy/unpaired files. Its editorial center is production AI engineering: agents, reliability, evaluation, observability, security boundaries, MCP, RAG, caching, orchestration, and deployment. The existing audit identifies ten non-duplicate opportunities; the strongest is **Idempotent AI Actions: Making Tool Calls Safe to Retry** because it covers business side-effect safety (API contracts, deduplication, reconciliation, and compensating actions), not durable workflow checkpoints.

## Publication choice

A reproducible random draw from valid calendar dates in January–July 2026 selected **2026-01-13**. This is an editorial date for the new post and not a claim about historical publication.

## Visual review

The hero uses a 16:9 editorial diagram with a warm paper background, muted lavender/green/terracotta accents, large serif/sans-serif English title treatment, and a clear retry-safe/one-effect narrative. The deduplication visual keeps the same palette and paper texture, uses simple schematic icons and readable English labels, and explains the article's key concept without looking like a generic stock illustration. Both assets are 2560×1440 PNGs and are suitable for hero/inline use, although their file sizes are large enough to be noted as a performance consideration.

The retry-state-machine image makes the central distinction explicit: a timeout leads to `unknown`, then reconciliation branches to commit or retry. The outbox image shows agent intent, atomic DB+outbox write, relay, external API, observation, reconciliation, and commit/compensation. Together with the hero and dedup record, the post has four coherent 16:9 visuals, all in the same warm editorial schematic style.
