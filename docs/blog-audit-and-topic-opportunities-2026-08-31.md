# Blog audit and topic opportunities — 2026-08-31

## Current baseline
- Repository: `vietdoo/vietdoo-folio`, branch `main`, clean clone at audit start.
- Blog content is under `src/data/blog`; current inventory is 96 Markdown files, primarily 48 bilingual EN/VI pairs.
- Public blog: https://vietdoo.vndo.vn/blog/
- Editorial center: production AI engineering, agent reliability, evaluation, observability, security boundaries, MCP, RAG, orchestration, cost, and deployment.
- Existing recent posts include multi-model failover, voice-agent interruption, decision traces, OpenTelemetry semantics, math verification, sandboxing generated code, shadow/counterfactual release experiments, multi-tenancy, deletion guarantees, durable execution, multimodal RAG, model routing, temporal RAG, tool contract testing, synthetic users, AI identity/delegation, human action gates, compensation transactions, FinOps, SLOs, A2A, provenance, evals, on-prem serving, and agent time semantics.

## Live verification
- Blog index currently shows the latest posts through Aug 26, 2026 and the same production-oriented editorial pattern.
- `ai-agent-finops-token-cost-allocation` is already live (June 4, 2026).
- `when-agents-disagree-arbitration-protocols` is already live (March 19, 2026).
- `ai-agent-time-semantics` is already live (March 12, 2026).
- Earlier docs that describe idempotent actions or some opportunities as future are stale; current repository and live pages supersede them.

## External signals
1. LangChain, *State of Agent Engineering* (June 12, 2026): survey of 1,300+ professionals; 57.3% report agents in production, quality is the top barrier (32%), observability adoption is ~89% versus evals at 52%, and multi-model usage is normal. URL: https://www.langchain.com/state-of-agent-engineering
2. O'Reilly, *Signals for 2026* (Jan 9, 2026): highlights context engineering, agent protocols, multimodal/physical AI, AI-native architecture, GPU infrastructure, and agentic SRE. URL: https://www.oreilly.com/radar/signals-for-2026/
3. International AI Safety Report 2026 (Feb 3, 2026): current systems still have reliability failures; autonomous agents heighten intervention difficulty; pre-deployment tests do not reliably predict real-world risk; layered safeguards and monitoring remain necessary. URL: https://internationalaisafetyreport.org/publication/international-ai-safety-report-2026

## Non-duplication conclusion
The strongest remaining gap is not another generic agent reliability, eval, RAG, security, cost, or observability article. A distinct opportunity is **AI Agent Change Management: Detecting Drift in Tools, Policies, and World State Before Actions Break**. It connects existing themes without repeating any one of them: it focuses on schema/policy/environment drift between planning and execution, with compatibility manifests, drift detectors, preflight checks, and safe degradation.

## Candidate shortlist
1. AI Agent Change Management: Detecting Drift in Tools, Policies, and World State Before Actions Break — chosen.
2. Context Budget Governance: Treating Prompt Context as a Versioned, Metered Production Dependency.
3. Agentic SRE Runbooks: From Alert Summaries to Bounded, Reversible Remediation.
4. Capability Discovery for MCP at Runtime: Negotiation, Expiry, and Safe Downgrade.
5. Model Behavior Drift: Detecting Silent Changes Behind a Stable API Contract.
6. AI Workflow Replay: Reconstructing Production Runs Without Replaying Side Effects.
7. Evidence Freshness Graphs for RAG: Knowing Which Claims Expire First.
8. Agent Permission Diffing: Reviewing Scope Changes Like Code Changes.
9. Human Escalation Queues as Reliability Systems: Capacity, SLA, and Decision Debt.
10. AI-Native Data Migration: Verifying Semantics When Agents Rewrite Legacy Records.

## Selected publication date
Random date selected within Jan–Jul 2026: **April 22, 2026**.

## Proposed slug
`ai-agent-drift-management`

## Source notes for final article
Use authoritative references around semantic versioning/API compatibility, Kubernetes-style readiness/preflight concepts, OpenTelemetry semantic conventions where relevant, and International AI Safety Report 2026 for the evaluation-gap/reliability framing. Avoid asserting unsupported vendor-specific facts.

## Validation and UI review
- `pnpm check`, `pnpm test`, and `pnpm build` completed successfully locally; Astro reported 0 errors and only pre-existing hints.
- The new route rendered successfully in the generated build and on local dev at `/blog/ai-agent-drift-management`.
- Desktop full-page capture: 1440×1000 viewport, 0% pixel difference between identical before/after captures; manual inspection showed title, hero, tables, code blocks, four images, references, and related reading present.
- The repository uses one canonical blog URL for both languages and a client-side language switcher; `/blog/<slug>/vi` is not a route and returned 404 during the first mobile probe. This is expected routing behavior, not a content defect.
- The local dev UI review also reported one Vite 504 `Outdated Optimize Dep` console warning on desktop and a 404 only for the intentionally invalid `/vi` probe. These are non-production diagnostics; rerun mobile capture on the canonical slug.
- Commit `c599623` contains the audit/opportunity report. Commit `a6c4ece` contains the selected bilingual article and four images. Both were pushed to `origin/main`.
