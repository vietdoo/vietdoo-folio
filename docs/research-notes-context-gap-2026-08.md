# Research notes: context-control gap

## Folio production baseline

Visited https://vietdoo.vndo.vn/blog/ on 2026-08-26. The live index shows 57 translation groups / 60 visible posts including the newest August 2026 release playbook and provider rotation post. The AI engineering center of gravity is agent reliability, evals, observability, MCP/tool security, RAG, memory, routing/failover, cost, identity, approvals, sandboxing, streaming, and deployment. The index also confirms these related posts are already live: context engineering for long-running agents (2026-04-11), prompt-injection tool boundaries (2026-04-27), observability without data leaks (2026-05-06), multimodal RAG (2026-07-11), and AI agent deletion guarantees (2026-07-15).

## External source

Anthropic, “Effective context engineering for AI agents,” published Sep 29, 2025: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents. The page defines context as the tokens included during LLM sampling and frames context engineering as the iterative curation of system instructions, tools, MCP, external data, and message history. It emphasizes that context is finite, that larger context can reduce focus, and that the smallest possible set of high-signal tokens should be selected for the desired outcome. This supports a distinct article boundary: a context firewall is not primarily about optimizing context utility; it is an admission/governance layer that decides what data is allowed to enter the model, for what purpose, with what transformations and lineage evidence.

## Additional sources

NIST AI Risk Management Framework overview: https://www.nist.gov/itl/ai-risk-management-framework. NIST describes AI RMF as a voluntary framework for incorporating trustworthiness considerations into the design, development, use, and evaluation of AI products and systems, with a companion playbook and resource center.

Abdelnabi et al., “Firewalls to Secure Dynamic LLM Agentic Networks,” arXiv version 7 (Jun 23, 2026): https://arxiv.org/html/2502.01822v7. The abstract presents a dual-firewall architecture: a language-conversion firewall projects incoming agent messages onto a validated structured protocol, while a data-abstraction firewall projects outgoing information to the granularity required by the task. The paper reports evaluation across 864 attacks in three domains and frames projection, rather than binary disclose-or-redact filtering, as a way to reduce unnecessary information transfer. This is useful as research context, but the blog should clearly separate the paper’s experimental claims from production engineering recommendations.

## Novelty check

A broad web search for “context firewall AI agent” returned a small, mixed set of recent articles and products rather than a saturated how-to pattern. The results include a Feb 2026 essay explicitly using “context firewall,” an Apr 2026 runtime-context security article, a Jun 2026 arXiv paper on dual firewalls, and product pages using “AI firewall” for broader monitoring. This suggests the phrase is timely but still open to a practical, narrower definition. The post should avoid claiming invention; it should define a production “context firewall” as a design pattern for pre-inference admission and evidence, distinct from a network firewall, generic AI firewall, prompt-injection defense, or context-window optimization.

## Visual style notes

Viewed existing `prompt-injection-tool-boundaries/hero.png` and `context-engineering/hero.svg`. The recurring style is a 16:9 editorial system illustration on warm cream paper, faint grid, rounded hand-drawn technical forms, dark navy/teal ink, mint, mustard, terracotta and occasional lilac accents, with generous whitespace and high contrast. Existing visuals use an explanatory left-to-right flow and simple labels/symbols. New assets should match the material and palette without reproducing the same composition.

## Local route verification

The local route `http://127.0.0.1:4321/blog/context-firewall-pre-inference-data-governance` rendered the English title, author metadata, publication date April 12, 2026, and all article content. After scrolling to the end, DOM inspection confirmed the four `/blog/context-firewall/` assets load successfully at 2560×1440: `hero.png`, `admission-pipeline.png`, `context-envelope.png`, and `deny-audit-loop.png`. The localized page includes the same four asset references for Vietnamese content.

## Production verification

After push, the production route `https://vietdoo.vndo.vn/blog/context-firewall-pre-inference-data-governance` returned rendered page content with canonical URL, title “The Context Firewall: Governing What Enters the Model,” OG image `https://vietdoo.vndo.vn/blog/context-firewall/hero.png`, publication date April 12, 2026, and both EN and VI article sections in the extracted response. GitHub Actions run `33023290897` completed successfully: lint/type check, unit tests, and build all passed. One later browser console check opened an about:blank state and returned no DOM; this did not invalidate the successful production page extraction immediately before it, but the final report should rely on the direct rendered response and CI result rather than that transient console state.
