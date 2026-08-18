# Blog Audit & AI Topic Opportunities — August 2026

## Audit summary

The folio currently contains **72 Markdown files** in `src/data/blog`: **34 bilingual translation groups** (68 files) plus **4 legacy or unpaired files**. The recent editorial center of gravity is production AI engineering, especially agent reliability, evaluation, observability, security boundaries, MCP, RAG, caching, orchestration, and deployment. This is a strong technical identity, but it also means a generic “what is an AI agent?” article would add little value.

The new recommendations below were checked against the current `translationKey`, title, category, and asset inventory. Each topic is intentionally one layer deeper or sideways from an existing post. In particular, the selected topic is not a duplicate of `durable-execution-ai-agent`: that post explains checkpoints, resume, and retry mechanics, whereas the new article will focus on **business side effects, API contracts, deduplication, reconciliation, and compensating actions**.

## Ten non-duplicate opportunities

| Rank | Proposed EN title | Proposed VI title | Distinct editorial angle | Existing-topic boundary | Potential / 10 |
|---:|---|---|---|---|---:|
| 1 | **Idempotent AI Actions: Making Tool Calls Safe to Retry** | **AI Action có tính Idempotent: Retry Tool Call mà không nhân đôi Side Effect** | Idempotency keys, semantic equivalence, deduplication tables, outbox/inbox, reconciliation, and compensating actions for write tools. | Durable execution covers workflow checkpoints and resume; this article covers the business API contract that prevents duplicate payments, emails, tickets, and records. | **9.6** |
| 2 | **The Context Firewall: Redaction, Tokenization, and Data Lineage Before the Prompt** | **Context Firewall: Redaction, Tokenization và Data Lineage trước khi vào Prompt** | Treat prompt context as a governed data plane with classification, masking, tenant boundaries, and lineage. | Prompt-injection posts cover instruction/data attacks; observability covers log leakage. This focuses on pre-inference data governance. | **9.2** |
| 3 | **MCP Lifecycle Engineering: Capability Negotiation, Versioning, and Compatibility** | **Engineering vòng đời MCP: Capability Negotiation, Versioning và Compatibility** | Handshake, capability discovery, version skew, graceful degradation, and contract tests. | Existing MCP articles cover authorization, least privilege, human approval, and tool poisoning—not lifecycle compatibility. | **9.1** |
| 4 | **AI Agent FinOps: Allocating Token Cost by Tenant, Workflow, and Outcome** | **FinOps cho AI Agent: Phân bổ Token Cost theo Tenant, Workflow và Outcome** | Cost attribution, budget envelopes, marginal value, chargeback/showback, and cost per successful task. | Model-router and SLO posts use cost as a signal; neither builds an accounting and governance model. | **8.9** |
| 5 | **Multi-Agent Coordination Without Chaos: Leases, Arbitration, and Shared State** | **Điều phối Multi-Agent không hỗn loạn: Lease, Arbitration và Shared State** | Concurrency control, ownership leases, conflict resolution, and durable shared state. | Handover covers session transfer; multi-tenancy covers isolation. This covers concurrent agents writing to the same work item. | **8.8** |
| 6 | **AI Coding Agent Verification: From Patch Generation to Merge Confidence** | **Verification cho AI Coding Agent: Từ sinh Patch đến Confidence trước khi Merge** | Repository invariants, test selection, mutation checks, review evidence, and risk-based merge policy. | Cursor guidance covers usage workflow; supply-chain coverage handles provenance/SBOM. This focuses on behavioral correctness before merge. | **8.7** |
| 7 | **Rollback Is Not Enough: AI Release Experiments With Shadow Traffic and Counterfactuals** | **Rollback chưa đủ: Thử nghiệm AI Release bằng Shadow Traffic và Counterfactuals** | Shadow mode, offline replay, counterfactual evaluation, feature flags, and probabilistic behavior promotion. | Canary/DB migration is infrastructure-focused; this treats model, prompt, and tool behavior as the release unit. | **8.6** |
| 8 | **When Agents Disagree: Arbitration Protocols for Conflicting AI Decisions** | **Khi các Agent bất đồng: Arbitration Protocol cho những quyết định xung đột** | Confidence calibration, evidence-weighted arbitration, escalation, and audit trails for disagreeing agents. | A2A covers interoperability and handover covers transfer; this focuses on conflict resolution after parallel reasoning. | **8.4** |
| 9 | **AI Workflow Quotas: Rate Limits, Fairness, and Backpressure for Agent Runs** | **Quota cho AI Workflow: Rate Limit, Fairness và Backpressure cho Agent Run** | Per-tenant budgets, concurrency leases, queue admission, fairness, and overload behavior. | SLO covers measurement; event-driven AI covers timeout decoupling. This focuses on admission control and noisy-neighbor prevention. | **8.3** |
| 10 | **Reconciliation Loops for AI Systems: Repairing Drift Between Intent and State** | **Reconciliation Loop cho AI System: Sửa độ lệch giữa Intent và State** | Periodic reconciliation, invariant checks, repair plans, safe replay, and operator handoff when agent intent diverges from actual state. | Durable execution handles resumption; idempotency is one building block. This article would be broader, centered on state repair. | **8.2** |

## Selection decision

The strongest next post is **Idempotent AI Actions: Making Tool Calls Safe to Retry**. It has the clearest reader pain, the most concrete failure stories, and a strong bridge between the folio’s existing agent reliability work and conventional distributed-systems practice. It is also easy to make useful rather than abstract: the article can show an idempotency-key contract, a deduplication table, a transactional outbox, a retry state machine, a reconciliation path, and a risk matrix.

The topic is supported by established engineering guidance rather than novelty claims. RFC 9110 distinguishes idempotent methods because a request may be automatically repeated after a communication failure; AWS describes caller-provided request identifiers as a way to express intent and safely retry distributed operations; Stripe documents replaying the saved result for a reused key; and the transactional-outbox pattern explains how to make a database mutation and event publication reliable without two-phase commit.[1] [2] [3] [4]

## Publication choice

A reproducible random draw from all valid calendar dates in January–July 2026 selected **2026-01-13**. The date is within the requested range and is not used as a claim about actual historical publication; it is the editorial publication date requested for the new post.

## References

[1]: https://www.rfc-editor.org/rfc/rfc9110.html "RFC 9110 — HTTP Semantics"
[2]: https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/ "AWS Builders' Library — Making retries safe with idempotent APIs"
[3]: https://docs.stripe.com/api/idempotent_requests "Stripe API — Idempotent requests"
[4]: https://microservices.io/patterns/data/transactional-outbox.html "Microservices.io — Transactional outbox pattern"
[5]: https://modelcontextprotocol.io/specification/2025-06-18 "Model Context Protocol specification"
[6]: https://github.com/open-telemetry/semantic-conventions-genai "OpenTelemetry GenAI semantic conventions"
[7]: https://www.finops.org/wg/finops-for-ai-overview/ "FinOps Foundation — FinOps for AI overview"
