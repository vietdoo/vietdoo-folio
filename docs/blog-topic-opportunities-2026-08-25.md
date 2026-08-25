# AI blog topic opportunities — 2026-08-25

## Audit basis

The current folio contains 100 Markdown files, mostly bilingual EN/VI pairs, and is strongest in production AI engineering: agent reliability, evaluations, observability, MCP and tool security, RAG, memory policy, routing and failover, cost, identity, human approval, sandboxing, streaming, and deployment. The latest posts already cover incident response, state-aware browser agents, voice interruption handling, release experiments, durable execution, decision traces, telemetry, admission control, and provider rotation.

The opportunities below were screened against both slugs and article bodies. Each proposal has a clear boundary so it does not become another generic RAG, eval, MCP-security, routing, memory, or observability post.

| Rank | Proposed English title | Vietnamese title | Differentiation boundary | Fit / 10 |
|---:|---|---|---|---:|
| 1 | **AI Agent Deletion Guarantees: Memory Erasure, Tombstones, and Audit Evidence** | **Deletion Guarantee cho AI Agent: Xóa Memory, Tombstone và Audit Evidence** | End-to-end propagation of erasure through conversation stores, durable memory, vector/graph projections, caches, summaries, traces, exports, and evidence. It is narrower than the existing memory-policy and observability articles. | **9.5** |
| 2 | **Tool Result Freshness: Preventing Agents from Acting on Expired Observations** | **Freshness của Tool Result: Ngăn Agent hành động trên Observation hết hạn** | TTL, leases, version checks, and read-before-write revalidation; it does not revisit semantic caching or temporal RAG. | **9.2** |
| 3 | **Agent Policy as Code: Testing Authorization Rules Like Software** | **Policy-as-Code cho AI Agent: Kiểm thử Authorization như Software** | Versioned policy decisions, negative tests, policy diffs, and enforcement points; it is not another human-approval or identity-delegation tutorial. | **9.0** |
| 4 | **Embedding Index Migrations: Re-Embedding Without Losing Retrieval Behavior** | **Migration Embedding Index: Re-Embedding mà không làm mất Retrieval Behavior** | Versioned embeddings, dual-read comparison, recall/precision checks, rollback, and cost controls; it is distinct from temporal and multimodal RAG. | **8.9** |
| 5 | **The Context Firewall: Governing What Enters the Model** | **Context Firewall: Quản trị dữ liệu trước khi vào Model** | Pre-inference admission, purpose limitation, field transforms, lineage, and retrieval envelopes; it is narrower than logging redaction and context engineering. | **8.8** |
| 6 | **Semantic Drift in AI Products: Detecting When “Correct” Behavior Quietly Changes** | **Semantic Drift trong AI Product: Khi hành vi “đúng” âm thầm thay đổi** | Meaning-level drift across intent slices, tool choices, escalations, and user rework; it is not release rollout or SLO monitoring. | **8.7** |
| 7 | **Multimodal Input Contracts: Making Images, Audio, and PDFs Testable** | **Input Contract đa phương thức: Khi Image, Audio và PDF có thể Test** | Normalization, modality-specific uncertainty, OCR/transcription quality, and contract checks; it is not multimodal RAG. | **8.6** |
| 8 | **Agent Capacity Planning: Turning Task Mix Into GPU and Queue Demand** | **Capacity Planning cho Agent: Từ Task Mix đến GPU và Queue Demand** | Workload modeling by task shape, burst, tool latency, model mix, and capacity reservations; it is not admission control or an on-prem serving guide. | **8.5** |
| 9 | **Agent Configuration Rollouts: Feature Flags for Tools, Prompts, and Policies** | **Rollout Configuration cho Agent: Feature Flag cho Tool, Prompt và Policy** | Targeting, sticky cohorts, kill switches, auditability, and rollback of non-code behavior; it is distinct from model-release experimentation. | **8.3** |
| 10 | **Agent Authorization Across Delegation Chains: Proving Who Allowed the Action** | **Authorization qua Chuỗi Delegation của Agent: Chứng minh ai cho phép Action** | Propagating authority and accountability across multi-agent delegation; it is narrower than basic identity and A2A interoperability. | **8.2** |

## Selection

The selected article is **AI Agent Deletion Guarantees**. It is the strongest addition because the folio already explains how to prevent unsafe actions, observe agent behavior, and govern memory, but it does not yet explain how to honor an erasure request across every place an agent may have copied or derived a user's data. The topic is technically concrete, visually explainable, relevant to privacy engineering, and broad enough to attract platform, security, and AI application readers without duplicating an existing post.

## Editorial constraints for the selected post

The article will be published as a full EN/VI pair with the shared translation key `ai-agent-deletion-guarantees`, `draft: false`, category `engineering`, and the randomly selected publication date **2026-07-15**. The hero will also serve as the blog thumbnail. Three additional in-article visuals will explain the deletion graph, tombstone/retrieval gating, and evidence ledger. The article will distinguish architectural guidance from legal advice and cite GDPR Article 17, NIST AI RMF, Pinecone deletion documentation, and Qdrant point-management documentation.

## References used for screening

[1]: https://gdpr-info.eu/art-17-gdpr/ "GDPR Article 17 — Right to erasure"
[2]: https://www.nist.gov/itl/ai-risk-management-framework "NIST AI Risk Management Framework"
[3]: https://docs.pinecone.io/guides/manage-data/delete-data "Pinecone Docs — Delete records"
[4]: https://qdrant.tech/documentation/manage-data/points/ "Qdrant Documentation — Points"
