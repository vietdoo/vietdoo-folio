# Research findings for next blog selection — 2026-08-27

## Current repo baseline
- HEAD: `4da041c` on `main`, clean after clone.
- The repo contains 112 Markdown blog files under `src/data/blog`, mostly 55+ EN/VI pairs plus three legacy unpaired posts.
- Editorial center: production AI engineering, agent reliability, evaluation, observability, MCP/tool security, RAG/memory, routing/failover, cost, identity, approvals, sandboxing, streaming, deployment, and release operations.
- Existing recent topics include context engineering, context firewall, prompt-injection boundaries, semantic caching, temporal RAG, output provenance, model/provider routing, durable execution, deletion guarantees, decision traces, telemetry, release experiments, and enterprise Git release.
- Existing repo docs already selected and implemented `context-firewall-pre-inference-data-governance`; do not propose or recreate it.

## Source check 1: OpenFGA Authorization for Agents
URL: https://openfga.dev/docs/modeling/agents
Page last updated: 2026-08-24.
Key facts: OpenFGA presents first-party authorization (what an agent can do inside the app), third-party authorization (what it can do in external systems), and task-based authorization with narrowly scoped grants, optional expiration, turn limits, and agent binding. This confirms that authorization is an active AI-agent topic, but the folio already covers agent identity/delegation, MCP least privilege, human approval, and related security boundaries. Any new authorization article must be specifically about policy versioning/testing or delegation-chain proof to avoid duplication.

## Source check 2: RFC 9111 HTTP Caching
URL: https://www.rfc-editor.org/rfc/rfc9111.html
Key facts: HTTP distinguishes fresh responses from responses requiring validation; freshness is based on freshness lifetime versus current age; validation can use validators such as ETag or Last-Modified; serving stale responses is conditional. This provides a standards-grounded vocabulary for an original AI-agent pattern around tool-result freshness, action-time revalidation, stale observations, and explicit fail-closed behavior. That is distinct from the existing semantic-caching article (LLM response reuse) and temporal-RAG article (historical retrieval semantics).

## Working editorial direction
Candidate with strongest fit appears to be **Tool Result Freshness: Preventing Agents from Acting on Expired Observations** / **Freshness của Tool Result: Ngăn Agent hành động trên Observation hết hạn**. The unique boundary is the tool observation as an expiring fact and the revalidation contract immediately before an external action; it is not semantic caching, temporal RAG, browser state verification, idempotency, or generic approval UX.

## Source check 3: RFC 9110 HTTP Semantics
URL: https://www.rfc-editor.org/rfc/rfc9110.html
Key facts: the RFC defines preconditions including If-Match, If-None-Match, If-Modified-Since and If-Unmodified-Since, plus evaluation of preconditions. This supports treating a tool observation's version/validator as a precondition for a later agent action, rather than trusting the model's earlier snapshot.

## Source access note
AWS blog and AWS S3 conditional-write documentation were returned by search but blocked by the browser policy in this environment. They will not be used as verified citations unless an accessible primary source is found. The article can remain grounded in RFC 9111/RFC 9110 and other accessible sources.

## Visual style check
Reviewed `public/blog/provider-rotation/hero.png` and `public/blog/provider-rotation/stateful-failover.png`. The established visual language is a hand-drawn technical whiteboard on warm cream paper, charcoal ink outlines, restrained teal/blue/orange/terracotta accents, human/robot narrative cues, readable English labels, rounded cards, dashed control paths, and explanatory diagrams that carry real system meaning. Hero assets are typically 16:9 at roughly 2560×1440; in-article diagrams can be landscape 4:3. New assets should match this style, use concise English labels for legibility, and avoid decorative sci-fi gloss.

## UI review check
- Production build generated `/blog/tool-result-freshness-agent-observations/index.html` successfully.
- Desktop after screenshot: 1440×1000, title, author/date/read-time card, hero and opening body render correctly.
- Vietnamese mobile after screenshot: 390×844, long title wraps without clipping, language toggle is visible, metadata card and hero remain readable, opening copy flows correctly.
- The route did not exist before authoring, so the repo's required `before` snapshot was captured after the new route was first available; the `before` and `after` images are therefore a same-route rendering validation rather than a true historical diff. This limitation should be stated in final delivery instead of claiming a meaningful pre/post visual delta.

## Production verification after push
- GitHub Actions CI/CD run `33037844121` for commit `8637f70` completed with `success` at 2026-08-27T04:00:08Z.
- Unit Tests and Lint & Type Check jobs passed; Build Project completed as part of the successful pipeline. The workflow emitted existing non-blocking hints about deprecated Node.js 20 action runtime and unused imports/variables.
- Production EN URL: https://vietdoo.vndo.vn/blog/tool-result-freshness-agent-observations — rendered title, April 20, 2026 date, hero and article opening.
- Production VI URL: https://vietdoo.vndo.vn/blog/tool-result-freshness-agent-observations?lang=vi — rendered Vietnamese title, April 20, 2026 date, shared hero and article opening.
