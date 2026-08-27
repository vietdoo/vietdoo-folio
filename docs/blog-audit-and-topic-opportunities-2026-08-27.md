# Rà soát blog Folio và cơ hội chủ đề AI — 27/08/2026

## Phạm vi và baseline

Tôi đã kiểm tra trực tiếp toàn bộ file Markdown trong `src/data/blog`, đọc front matter và đối chiếu tiêu đề, translation key cùng các chủ đề trong nội dung hiện có. Checkout hiện tại có **114 file Markdown**, tương ứng **56 translation key**; trong đó có bốn bài legacy/unpaired không thuộc cặp EN/VI đầy đủ. Trục biên tập chính của Folio là production AI engineering: agent reliability, evaluation, observability, security boundaries, MCP/tooling, RAG/memory, routing/failover, identity, approval, sandboxing, streaming và deployment.

Những bài gần đây đã phủ khá sâu các vùng như context engineering, context firewall, semantic caching, temporal RAG, provenance, prompt-injection boundary, browser state verification, idempotent action, durable execution, deletion guarantee, decision trace, telemetry, provider routing, admission control, release experiment, tool-result freshness và arbitration. Vì vậy, tôi loại khỏi shortlist mọi đề tài chỉ đổi tên nhưng vẫn quay lại các trục “xây agent”, “RAG cơ bản”, “retry”, “observability chung” hoặc “security boundary” đã có.

## Mười cơ hội không trùng lặp

| Hạng | Chủ đề đề xuất | Ranh giới với nội dung đã có | Vì sao phù hợp với Folio | Potential |
|---:|---|---|---|---:|
| 1 | **Agent Policy as Code: Testing Authorization Rules Like Software** / **Policy-as-Code cho AI Agent: Kiểm thử Authorization như Software** | Tập trung vào policy lifecycle, input contract, deny-by-default, negative tests, policy diff, shadow evaluation và rollback; không viết lại agent identity, MCP authorization hay human approval. | Có failure mode rõ, có code/test thực dụng, nối security với engineering discipline và mở rộng tự nhiên từ các bài reliability hiện có. | **9.7/10** |
| 2 | **Embedding Index Migrations: Re-Embedding Without Losing Retrieval Behavior** / **Migration Embedding Index: Re-Embedding mà không làm mất Retrieval Behavior** | Chỉ xử lý index version, dual-read, backfill, recall/precision delta, rollback và chi phí; không lặp multimodal RAG hay temporal RAG. | Đây là một migration problem production cụ thể, ít bị viết chung chung và có nhiều cơ hội cho diagram. | **9.3/10** |
| 3 | **Semantic Drift in AI Products: Detecting When “Correct” Behavior Quietly Changes** / **Semantic Drift trong AI Product: Khi hành vi “đúng” âm thầm thay đổi** | Đo thay đổi ở intent slice, tool choice, escalation và user rework; không phải model upgrade hay release experiment nói chung. | Bổ sung lớp user-outcome vào SLO/evaluation, hợp với hướng AI behavior phải đo được của tác giả. | **9.0/10** |
| 4 | **Multimodal Input Contracts: Making Images, Audio, and PDFs Testable** / **Input Contract đa phương thức: Khi Image, Audio và PDF có thể Test** | Tập trung normalization, OCR/transcription uncertainty, schema và rejection trước retrieval; không lặp multimodal RAG. | Mở rộng multimodal theo góc contract/quality gate thay vì demo model. | **8.8/10** |
| 5 | **Agent Capacity Planning: Turning Task Mix Into GPU and Queue Demand** / **Capacity Planning cho Agent: Từ Task Mix đến GPU và Queue Demand** | Mô hình workload shape, burst, token demand, reservation và forecast; không lặp admission control hay on-prem VRAM. | Tạo cầu nối hiếm giữa FinOps, queue, routing và model serving. | **8.6/10** |
| 6 | **Agent Configuration Rollouts: Feature Flags for Tools, Prompts, and Policies** / **Rollout Configuration cho Agent: Feature Flag cho Tool, Prompt và Policy** | Chỉ nói về config targeting, sticky cohorts, provenance, kill switch và rollback cho prompt/tool/policy; không phải model-release experimentation. | Rất thực dụng cho team ship thay đổi non-code mà vẫn kiểm soát được blast radius. | **8.5/10** |
| 7 | **Authorization Across Delegation Chains: Proving Who Allowed the Action** / **Authorization qua Chuỗi Delegation của Agent: Chứng minh ai cho phép Action** | Tập trung propagation, attenuation, expiry và proof xuyên nhiều agent; không lặp basic identity/delegation. | Có chiều sâu security, nhưng cần giữ ranh giới rõ để không biến thành phần hai của bài identity hiện có. | **8.3/10** |
| 8 | **Evidence Retention for AI Decisions: Keeping Proof Without Keeping Sensitive Payloads** / **Lưu Evidence cho Quyết định AI: Giữ bằng chứng mà không giữ toàn bộ dữ liệu nhạy cảm** | Tập trung minimal evidence, hash, retention tier và audit reconstruction; không phải cited answer, observability hay deletion guarantee. | Là giao điểm có giá trị giữa provenance, privacy, audit và data minimization. | **8.2/10** |
| 9 | **Human-Safe Reconciliation: Recovering Agent State After an Uncertain Tool Outcome** / **Reconciliation an toàn khi Tool Result không chắc chắn** | Xử lý unknown outcome sau timeout/partial failure bằng read-after-write, reconciliation state machine và escalation; không viết lại idempotency hay durable execution. | Chạm đúng khoảng trống giữa “retry-safe” và “đã biết trạng thái cuối”, rất hợp giọng production incident. | **8.1/10** |
| 10 | **Evaluation Dataset Governance: Consent, Lineage, and Deletion for AI Test Data** / **Governance cho Evaluation Dataset: Consent, Lineage và Deletion của dữ liệu test AI** | Chỉ tập trung provenance, consent, retention và deletion của dataset dùng để eval; không lặp synthetic users hay deletion guarantees của agent memory. | Mở rộng evaluation từ metric sang governance, hợp với mạch privacy/reliability nhưng vẫn là một bài độc lập. | **7.9/10** |

## Bài được chọn

Bài có tiềm năng cao nhất là **Agent Policy as Code: Testing Authorization Rules Like Software**. Lý do không chỉ là điểm tiềm năng cao mà còn vì nó lấp một khoảng trống cụ thể: Folio đã nói agent là ai, agent được cấp quyền thế nào, tool cần contract ra sao và người dùng duyệt action ra sao; nhưng chưa có bài tách riêng **policy được viết, kiểm thử, review, rollout và rollback như một artifact phần mềm**.

Bài sẽ giữ scope application-level. Nó không tuyên bố OPA, Cedar hay OpenFGA là một lựa chọn duy nhất; thay vào đó, chúng được dùng như các ví dụ để minh họa ba lớp: policy input contract, policy decision và enforcement point. Trọng tâm là cách một team biến yêu cầu “agent này không được export dữ liệu tenant khác” thành test case có cả allow path lẫn deny path, rồi kiểm soát thay đổi bằng diff, shadow decision, promotion gate và kill switch.

> **Publication date được chọn ngẫu nhiên:** `2026-01-02` — một ngày hợp lệ trong khoảng tháng 1–7/2026.

### Editorial brief

- **Shared slug:** `agent-policy-as-code-authorization-testing`
- **Category:** `security`
- **Languages:** English và Vietnamese, đầy đủ tương đương về độ dài, cấu trúc, code và references
- **Translation key:** `agent-policy-as-code-authorization-testing`
- **Visual set:** một hero/thumbnail và ba hình trong bài, cùng phong cách editorial paper-texture, charcoal, terracotta, lilac và olive của các bài AI engineering gần đây
- **Planned structure:** incident mở bài; policy không phải prose; decision contract; deny-by-default; positive/negative matrix; Rego/Cedar-style examples; policy diff; shadow evaluation; enforcement boundary; rollout; telemetry; failure-mode tests; checklist; references

## Nguồn kiểm chứng

[1]: https://openfga.dev/docs/modeling/agents "OpenFGA — Authorization for Agents"
[2]: https://www.openpolicyagent.org/docs "Open Policy Agent — Official Documentation"
[3]: https://www.openpolicyagent.org/docs/policy-testing "Open Policy Agent — Policy Testing"
[4]: https://docs.cedarpolicy.com/policies/validation.html "Cedar — Policy validation"
