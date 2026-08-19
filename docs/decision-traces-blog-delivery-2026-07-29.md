# Decision traces blog delivery report

## Audit and selection

The folio inventory contains 37 English/Vietnamese article pairs plus three legacy single-language posts. Existing AI coverage is strongest around agent reliability, provider/model routing, durable execution, idempotency, observability, evals, context engineering, MCP security, provenance, RAG, event-driven systems, multi-tenancy, and AI supply-chain policy.

The audit produced ten candidate topics: decision traces and event-sourced action paths; contract testing for AI tools; cross-provider output drift; evidence graphs for agentic search; admission control and priority shedding; versioned agent releases; agent incident response; AI data contracts for real-time pipelines; capability tokens; and first-class abstention/escalation states.

The selected topic is **Decision Traces for AI Agents: Event-Sourcing the Action Path Without Logging Chain-of-Thought**. It is intentionally narrower than the existing observability, provenance, durable execution, and idempotency posts. The article focuses on the immutable decision ledger between telemetry and business events: policy version, evidence references, action intent, approval, outcome, causation, ordering, privacy boundary, and replay semantics.

## Publication

The selected random date in July 2026 is **2026-07-29**. Both language variants use the same translation key and image set.

| Variant | File | Word count |
|---|---|---:|
| English | `src/data/blog/decision-traces-ai-agent-event-sourcing-en.md` | 2,648 |
| Vietnamese | `src/data/blog/decision-traces-ai-agent-event-sourcing-vi.md` | 2,912 |

## Research basis

The article references OpenTelemetry GenAI semantic-convention attributes for correlating agent, conversation, provider/model, input/output, and evaluation data; Streamkap’s decision-trace discussion for the data-event/context/action/outcome chain; ARMO’s minimum viable audit-trail discussion for application-layer agent-action events, source redaction, decision outcomes, and hash anchoring; and NIST’s AI Risk Management Framework for the broader trustworthy-AI risk-management context.

The article is careful not to recommend storing private chain-of-thought as a required audit artifact. It proposes a decision envelope containing observable policy and evidence references, action intent, version identifiers, approval state, outcome, privacy profile, and content hashes where appropriate.

## Visual assets

The article includes a cohesive hand-drawn whiteboard-app set generated from one hero reference:

| Asset | Role |
|---|---|
| `/blog/decision-traces/hero.png` | Thumbnail/hero: request → evidence → policy → decision ledger → tool → outcome |
| `/blog/decision-traces/decision-ledger.png` | Append-only event stream with trace, causation, sequence, timestamp, hash chain, and projection |
| `/blog/decision-traces/replay-vs-reexecute.png` | Safe replay versus risky re-execution and duplicate side effects |
| `/blog/decision-traces/privacy-boundary.png` | Source redaction, governed encrypted vault, hashes, and the decision ledger boundary |

The visual rule follows the previous provider-rotation post: warm ivory paper, graphite-black marker outlines, imperfect hand-drawn strokes, muted teal/blue/coral/mustard/lavender/sage accents, concise English labels, technical arrows and state cards, generous negative space, and no glossy corporate infographic treatment.

## Verification

The repository passed Astro check with zero errors, while retaining only pre-existing hints. The unit suite passed with **19 tests**. The Astro/Vercel production build completed successfully and prerendered `/blog/decision-traces-ai-agent-event-sourcing/`. `git diff --check` passed, all four image files exist, and the article references resolve to the new asset paths.

## Delivery status

The article files, four visual assets, and this report are ready for one isolated blog commit. The final commit hash and GitHub Actions run URL will be appended to the delivery message after push.
