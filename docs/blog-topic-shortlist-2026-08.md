# Twenty AI Blog Opportunities for Vietdoo Folio

## Audit basis

The refreshed repository contains 100 Markdown files, representing the existing bilingual and legacy blog inventory. The folio already has deep coverage of agent reliability, evals, observability, MCP and tool security, RAG, memory policy, routing and failover, cost, identity, human approval, sandboxing, streaming, and progressive deployment. The recently published `ai-agent-release-experiments` article now owns the shadow-traffic, counterfactual-replay, and promotion-gate angle.

The following ideas were screened against existing titles and the actual body content, not only slugs. Generic AI explainers, another RAG introduction, another eval overview, another MCP security article, provider routing, FinOps, arbitration, synthetic users, idempotency, and release experimentation were excluded.

## Twenty screened opportunities

| Rank | Proposed English title | Proposed Vietnamese title | Differentiation boundary | Fit / 10 |
|---:|---|---|---|---:|
| 1 | **AI Agent Incident Response: Kill Switches, Evidence Packs, and Safe Degradation** | **Incident Response cho AI Agent: Kill Switch, Evidence Pack và Degradation an toàn** | Operational response after an agent failure: stop conditions, blast-radius reduction, user messaging, evidence preservation, recovery, and post-incident learning. It is not an observability or identity-revocation tutorial. | **9.3** |
| 2 | **State-Aware Browser Agents: Verifying the World Before Every Click** | **Browser Agent hiểu State: Xác minh thế giới trước mỗi lần click** | Computer-use reliability: stale DOM/screenshots, target revalidation, confirmation surfaces, transaction boundaries, and recovery. No existing post covers GUI/browser state as the primary failure mode. | **9.1** |
| 3 | **Voice Agents Under Interruption: Turn-Taking, Barge-In, and Safe Handoffs** | **Voice Agent khi bị ngắt lời: Turn-Taking, Barge-In và Handoff an toàn** | Adds a voice-first production lane: end-of-turn detection, interruption semantics, partial speech, latency, repair, and human fallback. Existing posts are text-first. | **8.9** |
| 4 | **MCP Lifecycle Engineering: Version Skew, Capability Negotiation, and Compatibility** | **Engineering vòng đời MCP: Version Skew, Capability Negotiation và Compatibility** | Protocol lifecycle and dual-era compatibility, separated from existing MCP authorization, poisoning, telemetry, and tool contract posts. | **8.8** |
| 5 | **AI Coding Agent Verification: From Patch Generation to Merge Confidence** | **Verification cho AI Coding Agent: Từ Patch đến Confidence trước Merge** | Repository invariants, changed-surface testing, mutation checks, review evidence, and risk-based merge policy, distinct from Cursor workflow and supply-chain provenance. | **8.8** |
| 6 | **The Context Firewall: Governing What Enters the Model** | **Context Firewall: Quản trị dữ liệu trước khi vào Model** | Pre-inference admission, purpose limitation, field transforms, lineage, and retrieval envelope. It must stay narrower than existing observability redaction and context engineering. | **8.6** |
| 7 | **Reconciliation Loops for AI Systems: Repairing Drift Between Intent and State** | **Reconciliation Loop cho AI System: Sửa độ lệch giữa Intent và State** | Periodic invariant checks, drift classification, repair plans, convergence, and operator handoff; idempotency and durable execution are prerequisites only. | **8.6** |
| 8 | **Embedding Index Migrations: Re-Embedding Without Losing Retrieval Behavior** | **Migration Embedding Index: Re-Embedding mà không làm mất Retrieval Behavior** | Versioned embeddings, dual-read/dual-write, recall comparison, rollback, and cost control. Distinct from temporal RAG, semantic cache, and multimodal RAG. | **8.4** |
| 9 | **AI Agent Deletion Guarantees: Memory Erasure, Tombstones, and Audit Evidence** | **Deletion Guarantee cho AI Agent: Xóa Memory, Tombstone và Audit Evidence** | Right-to-delete and provable erasure across conversation stores, vector indexes, caches, traces, and derived summaries; narrower than memory policy. | **8.4** |
| 10 | **Semantic Drift in AI Products: Detecting When “Correct” Behavior Quietly Changes** | **Semantic Drift trong AI Product: Khi hành vi “đúng” âm thầm thay đổi** | Meaning-level drift across intent slices, tool choices, escalation, and user rework, distinct from release rollout and SLO monitoring. | **8.3** |
| 11 | **Agent Policy as Code: Testing Authorization Rules Like Software** | **Policy-as-Code cho AI Agent: Kiểm thử Authorization như Software** | Versioned policy evaluation, decision tables, negative tests, policy diff, and enforcement points; narrower than human approval and identity delegation. | **8.3** |
| 12 | **Human Escalation Queues for AI: Routing Uncertainty Without Losing Context** | **Queue Escalation cho AI: Chuyển Uncertainty cho người mà không mất Context** | Handoff packets, queue priority, SLA, ownership, feedback loops, and context minimization; distinct from action approval and agent handover architecture. | **8.2** |
| 13 | **Long-Horizon Agent Budgets: Time, Tool Calls, and State Checkpoints** | **Budget cho Agent chạy dài: Time, Tool Call và State Checkpoint** | Runtime budget envelopes for horizon length and tool-call count, with graceful stop and resumable state; not another generic admission-control or durable-execution post. | **8.1** |
| 14 | **Multimodal Input Contracts: Making Images, Audio, and PDFs Testable** | **Input Contract đa phương thức: Khi Image, Audio và PDF có thể Test** | Input normalization, modality-specific uncertainty, OCR/transcription quality, and downstream contract checks; distinct from multimodal RAG and math correctness. | **8.1** |
| 15 | **Agent Configuration Rollouts: Feature Flags for Tools, Prompts, and Policies** | **Rollout Configuration cho Agent: Feature Flag cho Tool, Prompt và Policy** | Configuration targeting, sticky cohorts, kill switches, auditability, and rollback of non-code behavior; distinct from model-release experiments by focusing on flag governance. | **8.0** |
| 16 | **Tool Result Freshness: Preventing Agents from Acting on Expired Observations** | **Freshness của Tool Result: Ngăn Agent hành động trên Observation hết hạn** | TTL, leases, version checks, and revalidation between read and write; not semantic caching or temporal RAG. | **8.0** |
| 17 | **Agent Authorization Across Delegation Chains: Proving Who Allowed the Action** | **Authorization qua Chuỗi Delegation của Agent: Chứng minh ai cho phép Action** | Propagating authority and accountability across multi-agent delegation; distinct from user/agent identity basics and A2A interoperability. | **7.9** |
| 18 | **AI Data Contracts for Structured Outputs: Compatibility Beyond JSON Schema** | **Data Contract cho Structured Output: Vượt qua JSON Schema** | Semantic compatibility, null/unknown states, version negotiation, and consumer-driven tests; excludes streaming partial JSON and event-schema migration. | **7.9** |
| 19 | **Privacy-Preserving Agent Analytics: Measuring Quality Without Reconstructing Users** | **Analytics bảo vệ Privacy cho Agent: Đo Quality mà không tái dựng User** | Aggregation, minimum cohorts, tokenization, differential privacy concepts, and safe retention; narrower than observability data leakage. | **7.8** |
| 20 | **Agent Capacity Planning: Turning Task Mix Into GPU and Queue Demand** | **Capacity Planning cho Agent: Từ Task Mix đến GPU và Queue Demand** | Workload modeling by task shape, burst, tool latency, model mix, and capacity reservations; not another admission-control or on-prem serving guide. | **7.7** |

## Three selected posts

### 1. AI Agent Incident Response

This is the highest-value addition because the folio is strong on prevention and instrumentation but does not yet have a complete operating playbook for the moment an agent is already failing. The article will define kill-switch layers, safe degradation modes, evidence packs, incident roles, and recovery without duplicating observability or revocation.

### 2. State-Aware Browser Agents

This is the cleanest new technical surface. Existing tool and agent posts assume API-like capabilities, while browser agents act on a changing visual and DOM world. The article will focus on revalidation before every irreversible click, state fingerprints, confirmation boundaries, and recovery from stale observations.

### 3. Voice Agents Under Interruption

This adds a genuinely different modality while preserving the folio's production-engineering identity. The article will cover turn-taking, barge-in, partial transcripts, cancellation, repair, latency budgets, safe handoff, and evaluation slices. It will not become a generic speech or voice-AI introduction.

## Editorial constraints for all three

Each selected topic receives one full English article and one full Vietnamese article. Each pair uses an independent translation key and an independently selected date inside January–July 2026. Each article uses a 16:9 hero that also acts as its thumbnail plus three in-article diagrams, all in the folio's cream-paper, hand-drawn engineering style. The existing blog layout supplies the byline automatically through `LayoutBlogPost.astro`, so no duplicate or conflicting author metadata will be added.
