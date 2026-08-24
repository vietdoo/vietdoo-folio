# Blog Audit & AI Topic Opportunities — August 2026

## Audit scope

This audit reviews the Markdown content in `src/data/blog`, its frontmatter, internal links, image inventory, and the production blog index. The folio currently contains **96 Markdown files**: **46 bilingual EN/VI translation groups** (92 files) and **4 legacy/unpaired files**. The category distribution is 65 engineering files, 20 architecture files, 6 security files, 2 education files, and 3 intro files.

The blog has a clear technical identity. Its strongest cluster is production AI engineering: agent reliability, evaluation, observability, security boundaries, MCP, RAG, orchestration, cost, model routing, deployment, and AI product failure UX. This is a valuable niche, but it also means broad topics such as “what is generative AI?” or another generic RAG introduction would be weak additions.

## Existing-topic map and gap logic

The current posts already cover durable execution, event-driven workflows, model failover, model routing, tool contract testing, evals, prompt injection, tool poisoning, agent identity, human approval, memory policy, provenance, telemetry, quotas/admission control, SLOs, FinOps, MCP authorization, and multi-tenant isolation. The opportunities below therefore target **adjacent production failure modes** rather than repeating those subjects.

## Ten non-duplicate opportunities

| Rank | Proposed EN title | Proposed VI title | Distinct editorial angle | Existing-topic boundary | Potential / 10 |
|---:|---|---|---|---|---:|
| 1 | **The Context Firewall: Redaction, Tokenization, and Data Lineage Before the Prompt** | **Context Firewall: Redaction, Tokenization và Data Lineage trước khi vào Prompt** | Treat prompt context as a governed data plane with classification, masking, tenant boundaries, lineage, and safe retrieval. | Prompt-injection posts cover instruction/data attacks; observability covers log leakage. This focuses on pre-inference data governance. | **9.5** |
| 2 | **MCP Lifecycle Engineering: Capability Negotiation, Versioning, and Compatibility** | **Engineering vòng đời MCP: Capability Negotiation, Versioning và Compatibility** | Handshake, capability discovery, version skew, graceful degradation, and contract tests for evolving MCP clients and servers. | Existing MCP posts cover authorization, least privilege, human approval, and tool poisoning—not lifecycle compatibility. | **9.3** |
| 3 | **AI Coding Agent Verification: From Patch Generation to Merge Confidence** | **Verification cho AI Coding Agent: Từ sinh Patch đến Confidence trước khi Merge** | Repository invariants, test selection, mutation checks, review evidence, and risk-based merge policy. | Cursor guidance covers usage workflow; supply-chain coverage handles provenance/SBOM. This focuses on behavioral correctness before merge. | **9.2** |
| 4 | **Rollback Is Not Enough: AI Release Experiments With Shadow Traffic and Counterfactuals** | **Rollback chưa đủ: Thử nghiệm AI Release bằng Shadow Traffic và Counterfactuals** | Shadow mode, offline replay, counterfactual evaluation, feature flags, and probabilistic behavior promotion. | Canary/DB migration is infrastructure-focused; this treats model, prompt, and tool behavior as the release unit. | **9.0** |
| 5 | **Multi-Agent Coordination Without Chaos: Leases, Arbitration, and Shared State** | **Điều phối Multi-Agent không hỗn loạn: Lease, Arbitration và Shared State** | Concurrency control, ownership leases, conflict resolution, and durable shared state. | Handover covers session transfer; multi-tenancy covers isolation. This covers concurrent agents writing to the same work item. | **8.9** |
| 6 | **AI Workflow Quotas: Rate Limits, Fairness, and Backpressure for Agent Runs** | **Quota cho AI Workflow: Rate Limit, Fairness và Backpressure cho Agent Run** | Per-tenant budgets, concurrency leases, queue admission, fairness, and overload behavior. | The queue/admission post covers admission control; this focuses on quota policy and fairness across workflow classes. | **8.7** |
| 7 | **Reconciliation Loops for AI Systems: Repairing Drift Between Intent and State** | **Reconciliation Loop cho AI System: Sửa độ lệch giữa Intent và State** | Periodic reconciliation, invariant checks, repair plans, safe replay, and operator handoff when intent diverges from actual state. | Idempotency is one building block; this broader article would center on state repair and drift detection. | **8.7** |
| 8 | **When Agents Disagree: Arbitration Protocols for Conflicting AI Decisions** | **Khi các Agent bất đồng: Arbitration Protocol cho những quyết định xung đột** | Confidence calibration, evidence-weighted arbitration, escalation, and audit trails for disagreeing agents. | A2A covers interoperability and handover covers transfer; this focuses on conflict resolution after parallel reasoning. | **8.5** |
| 9 | **AI Agent FinOps: Allocating Token Cost by Tenant, Workflow, and Outcome** | **FinOps cho AI Agent: Phân bổ Token Cost theo Tenant, Workflow và Outcome** | Cost attribution, budget envelopes, marginal value, chargeback/showback, and cost per successful task. | Existing router/SLO work uses cost as a signal; this builds an accounting and governance model. | **8.4** |
| 10 | **Synthetic Users for AI Agents: Scenario Generation Without Evaluation Leakage** | **Synthetic User cho AI Agent: Sinh Scenario mà không làm rò rỉ Evaluation** | Generate diverse user behavior, preserve held-out evaluation sets, model edge cases, and prevent synthetic-data self-confirmation. | Existing eval posts cover regression suites and golden sets; this focuses on how to generate trustworthy scenario populations. | **8.3** |

## Selection decision

The strongest existing opportunity remains **The Context Firewall**, because it opens a genuinely adjacent lane between the folio’s prompt-injection, observability, multi-tenant, and RAG posts. It addresses a practical question many AI teams still handle informally: what data is allowed to enter model context, under which tenant and purpose, with what transformation and lineage? It can be made concrete with a data classification matrix, a redaction/tokenization pipeline, a retrieval envelope, and a leakage-oriented test plan.

However, the previous editorial selection **Idempotent AI Actions: Making Tool Calls Safe to Retry** is already implemented in the current repository and production site. It remains a strong article and is not a duplicate of durable execution: durable execution explains workflow checkpoints and resume mechanics, whereas idempotency explains the business API contract that prevents duplicate payments, emails, tickets, and records. Because the user asked for the most promising post to be selected and published, the correct action against the current repo is to verify and preserve this existing publication rather than create a duplicate slug.

## Published article verification

The selected article has two full translations:

- `src/data/blog/idempotent-ai-actions-en.md`
- `src/data/blog/idempotent-ai-actions-vi.md`

It uses the editorial date **2026-01-13**, randomly selected from valid calendar dates in January–July 2026. Both files are `draft: false`, share the same `translationKey`, and reference the same hero asset. The article contains a human-like production incident, a thesis, conceptual definitions, TypeScript and SQL examples, a retry state machine, idempotency-record rules, transactional outbox, reconciliation, compensation, approval boundaries, failure-mode tests, telemetry, rollout guidance, related reading, and references.

The article includes four coherent image assets in `public/blog/idempotent-ai-actions/`: `hero.png`, `dedup-record.png`, `retry-state-machine.png`, and `outbox-reconciliation.png`. The hero doubles as the thumbnail; the remaining three visuals are embedded in the article. They share a cream paper texture, hand-drawn editorial diagrams, and a restrained charcoal/terracotta/lilac/olive palette consistent with the visual language of the recent AI engineering posts.

The production blog index at `https://vietdoo.vndo.vn/blog/` lists the article under Engineering with the date January 13, 2026. The route `https://vietdoo.vndo.vn/blog/idempotent-ai-actions` renders the English article and hero successfully.

## Sources used for fact-checking

The article’s core claims are supported by RFC 9110 on HTTP method idempotency, AWS Builders’ Library on caller-provided request identifiers and retry/reconciliation behavior, Stripe’s documentation on replaying the original result and rejecting parameter mismatches, and Microservices.io on the transactional outbox pattern and duplicate relay delivery.[1] [2] [3] [4]

## References

[1]: https://www.rfc-editor.org/rfc/rfc9110.html "RFC 9110 — HTTP Semantics"
[2]: https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/ "AWS Builders' Library — Making retries safe with idempotent APIs"
[3]: https://docs.stripe.com/api/idempotent_requests "Stripe API — Idempotent requests"
[4]: https://microservices.io/patterns/data/transactional-outbox.html "Microservices.io — Transactional outbox pattern"

## Additional opportunity validation

Two current technical references reinforce the ranking logic. Red Hat’s January 2026 guide describes enterprise MCP needs around tracking server versions, lifecycle metadata, automated scanning/signing/certification, and observability.[5] The official MCP specification defines stateful connections and server/client capability negotiation as core protocol details, while separately emphasizing consent, privacy, and tool safety.[6] These references make MCP lifecycle engineering a defensible future topic, but the subject remains ranked below Context Firewall because the current folio already has several MCP security and authorization posts.

[5]: https://developers.redhat.com/articles/2026/01/08/building-effective-ai-agents-mcp "Red Hat Developer — Building effective AI agents with Model Context Protocol (MCP)"
[6]: https://modelcontextprotocol.io/specification/2025-06-18 "Model Context Protocol — Specification 2025-06-18"
