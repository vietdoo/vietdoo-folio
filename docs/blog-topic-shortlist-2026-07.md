# AI Blog Topic Shortlist for Vietdoo Folio

## Audit basis

The current checkout contains 98 Markdown blog files. The editorial center of gravity is production AI engineering: agent reliability, evals, observability, tool safety, MCP, RAG, memory, orchestration, cost, model routing, deployment, and failure UX. The shortlist below deliberately avoids generic AI explainers and removes ideas that are already published, including agent arbitration, AI-agent FinOps, synthetic users, admission control, idempotent actions, and provider rotation.

The strongest gap is the release boundary for probabilistic behavior. Existing posts mention canaries, shadow mode, replay, evaluation, and model upgrades as individual techniques, but no post makes the model/prompt/tool/retrieval/policy bundle itself the release artifact and explains how to promote it safely.

## Ten differentiated opportunities

| Rank | Proposed English title | Proposed Vietnamese title | What makes it distinct from existing posts | Potential |
|---:|---|---|---|---:|
| 1 | **AI Agent Release Experiments: Shadow Traffic, Counterfactual Replay, and Promotion Gates** | **Thử nghiệm Release cho AI Agent: Shadow Traffic, Counterfactual Replay và Promotion Gate** | Treats model, prompt, retrieval index, tool schema, routing policy, and safety policy as one behavior release. Covers offline baseline, shadow, cohort canary, counterfactual replay, invariant gates, and abort/rollback. It does not re-teach the existing eval suite, model upgrade, provider failover, or infrastructure canary posts. | **9.6/10** |
| 2 | **MCP Lifecycle Engineering: Capability Negotiation, Version Skew, and Compatibility Matrices** | **Engineering vòng đời MCP: Capability Negotiation, Version Skew và Compatibility Matrix** | Focuses on initialization/modern per-request versioning, capability negotiation, dual-era clients, downgrade behavior, and lifecycle contract tests. It is not another MCP security, tool-poisoning, authorization, or generic contract-testing article. | **9.2/10** |
| 3 | **AI Coding Agent Verification: From Patch Generation to Merge Confidence** | **Verification cho AI Coding Agent: Từ Patch được sinh đến Confidence trước khi Merge** | Centers on repository invariants, changed-surface test selection, mutation checks, static analysis, reviewer evidence, and risk-based merge policy. It is not a Cursor workflow or a software supply-chain provenance post. | **9.1/10** |
| 4 | **The Context Firewall: Governing What Enters the Model** | **Context Firewall: Quản trị dữ liệu trước khi vào Model** | Makes pre-inference data admission, purpose limitation, field-level transforms, lineage, tenant scope, and retrieval envelopes the main system. It goes beyond observability redaction and prompt-injection boundaries by deciding what may enter context in the first place. | **8.9/10** |
| 5 | **Reconciliation Loops for AI Systems: Repairing Drift Between Intent and State** | **Reconciliation Loop cho AI System: Sửa độ lệch giữa Intent và State** | Focuses on periodic invariant checks, drift classification, repair plans, safe convergence, operator handoff, and dashboards. Idempotency and durable execution are treated as prerequisites, not as the article topic. | **8.8/10** |
| 6 | **Voice Agents Under Interruption: Turn-Taking, Barge-In, and Safe Handoffs** | **Voice Agent khi bị ngắt lời: Turn-Taking, Barge-In và Handoff an toàn** | Covers audio turn boundaries, interruption semantics, partial speech, latency budgets, fallback to text/human, and conversation repair. This adds a multimodal/voice lane not represented by the current text-first production posts. | **8.6/10** |
| 7 | **Semantic Drift in AI Products: Detecting When “Correct” Behavior Quietly Changes** | **Semantic Drift trong AI Product: Nhận biết khi hành vi “đúng” âm thầm thay đổi** | Defines behavior fingerprints, slice-level drift, contract changes, user-intent distributions, and alert thresholds for meaning rather than infrastructure metrics. It is not a generic SLO or regression-suite tutorial. | **8.5/10** |
| 8 | **AI Agent Incident Response: Kill Switches, Evidence Packs, and Safe Degradation** | **Incident Response cho AI Agent: Kill Switch, Evidence Pack và Degradation an toàn** | Turns agent failures into an incident operating model: stop conditions, blast-radius reduction, evidence capture, user messaging, recovery, and post-incident learning. It is broader than observability and does not duplicate identity revocation or human approval mechanics. | **8.4/10** |
| 9 | **State-Aware Browser Agents: Verifying the World Before Every Click** | **Browser Agent hiểu State: Xác minh thế giới trước mỗi lần click** | Focuses on stale DOM/screenshot state, optimistic assumptions, target revalidation, transaction boundaries, confirmation surfaces, and recovery in GUI automation. It is a new computer-use reliability angle rather than another tool-calling article. | **8.3/10** |
| 10 | **AI Product Experiments Without Vanity Metrics: Linking Model Behavior to User Outcomes** | **Thử nghiệm AI Product không chạy theo Vanity Metrics** | Connects model behavior slices to task completion, rework, escalation, retention, and cost without treating token or thumbs-up metrics as the product truth. It complements, but does not repeat, the existing SLO, FinOps, and eval posts. | **8.2/10** |

## Selection

The selected topic is **AI Agent Release Experiments: Shadow Traffic, Counterfactual Replay, and Promotion Gates**. It is the cleanest fit for the folio because it joins several concerns already present in isolated form while answering a missing production question: how can a team change a probabilistic system without asking real users to be the test harness? The article will stay practical and implementation-oriented, with a release ledger, traffic modes, counterfactual comparison rules, safety invariants, promotion gates, and an abort-first rollout sequence.

## Editorial package

- Slug: `ai-agent-release-experiments`
- Publication date: `2026-07-24` (randomly selected inside the requested January–July 2026 window)
- Category: `engineering`
- Translation key: `ai-agent-release-experiments`
- Hero/thumbnail: one 16:9 hand-drawn editorial systems illustration
- In-article visuals: three matching diagrams for experiment modes, counterfactual replay, and promotion/abort gates
- Languages: full English and full Vietnamese versions with aligned structure, code, tables, image captions, and references
- Tone: human-like, incident-led, practical, skeptical of vanity metrics, and explicit about what the system must not assume
