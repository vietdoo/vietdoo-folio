# Blog topic audit and opportunity shortlist — 2026-08-27

## Phạm vi rà soát

Tôi đã kiểm tra trực tiếp toàn bộ `src/data/blog` ở HEAD `4da041c` của repo `vietdoo/vietdoo-folio`, không dựa chỉ vào tên file. Inventory hiện có **112 Markdown files**, **54 translation keys** dùng cho cặp EN/VI và **4 bài legacy/unpaired**. Có 77 file thuộc `engineering`, 22 `architecture`, 8 `security`, 3 `intro` và 2 `education`. Ngày xuất bản trải từ 2021-07-17 đến 2026-08-26.

Trục biên tập rất rõ: production AI engineering cho agent, reliability, evaluation, observability, MCP/tool security, RAG/memory, routing/failover, identity, approval, sandboxing, streaming, deployment và release operations. Những chủ đề đã có gần đây gồm context engineering, context firewall, semantic caching, temporal RAG, output provenance, prompt-injection boundaries, browser state verification, idempotent actions, durable execution, deletion guarantees, decision traces, telemetry, model/provider routing, admission control, release experiments và enterprise Git release.

Vì vậy, bài tiếp theo không nên là “how to build an AI agent”, prompt engineering chung chung, hay một bài lặp lại về RAG, retries, observability và security boundaries. Tôi ưu tiên các đề tài có một failure mode rõ, một contract có thể kiểm tra, một rollout production cụ thể và đủ không gian cho visual giải thích hệ thống.

## Mười cơ hội không trùng lặp

| Hạng | Chủ đề đề xuất | Khoảng trống và ranh giới không trùng | Vì sao hợp với folio | Potential |
|---:|---|---|---|---:|
| 1 | **Tool Result Freshness: Preventing Agents from Acting on Expired Observations** / **Freshness của Tool Result: Ngăn Agent hành động trên Observation hết hạn** | Tập trung vào observation do tool trả về, freshness budget, version/ETag, revalidation ngay trước write và fail-closed khi state đã cũ. Không phải semantic caching của câu trả lời LLM, temporal RAG, browser fingerprint hay idempotency. | Nối trực tiếp reliability, tool contract, state-aware action và human-safe execution; failure mode dễ hiểu nhưng ít bị viết trùng dưới góc production agent. RFC 9111 cung cấp vocabulary chuẩn về fresh response, age và validation.[1] | **9.7/10** |
| 2 | **Agent Policy as Code: Testing Authorization Rules Like Software** / **Policy-as-Code cho AI Agent: Kiểm thử Authorization như Software** | Chỉ nói về policy versioning, deny-by-default, negative tests, diff và enforcement points; không lặp agent identity/delegation, MCP least privilege hay human approval. | Hợp với nhóm security/architecture và nối được OpenFGA, Cedar/OPA với regression thinking; OpenFGA hiện đã có hướng dẫn riêng cho task-based authorization của agent.[2] | **9.3/10** |
| 3 | **Embedding Index Migrations: Re-Embedding Without Losing Retrieval Behavior** / **Migration Embedding Index: Re-Embedding mà không làm mất Retrieval Behavior** | Tập trung vào index-version, dual read, backfill, recall/precision delta, rollback và chi phí; không phải multimodal RAG hay temporal RAG. | Là một migration problem rất production, bổ sung chiều vận hành còn thiếu giữa RAG quality và safe deployment. | **9.1/10** |
| 4 | **Semantic Drift in AI Products: Detecting When “Correct” Behavior Quietly Changes** / **Semantic Drift trong AI Product: Khi hành vi “đúng” âm thầm thay đổi** | Đo thay đổi ý nghĩa trong intent slice, tool choice, escalation và user rework; không phải model upgrade hay release experiment nói chung. | Mở rộng SLO/evals bằng góc nhìn user outcome, vẫn giữ tinh thần “AI behavior phải đo được”. | **8.9/10** |
| 5 | **Multimodal Input Contracts: Making Images, Audio, and PDFs Testable** / **Input Contract đa phương thức: Khi Image, Audio và PDF có thể Test** | Chỉ xử lý normalization, OCR/transcription uncertainty, input schema, modality-specific quality checks và rejection trước retrieval; không lặp multimodal RAG. | Hợp với hướng multimodal đang tăng nhưng vẫn có contract/engineering angle đặc trưng của tác giả. | **8.8/10** |
| 6 | **Agent Capacity Planning: Turning Task Mix Into GPU and Queue Demand** / **Capacity Planning cho Agent: Từ Task Mix đến GPU và Queue Demand** | Mô hình workload shape, burst, token demand, reservations và forecast; không lặp admission control hay on-prem dưới 100 GB VRAM. | Tạo cầu nối giữa FinOps, routing, queue và hạ tầng model serving. | **8.6/10** |
| 7 | **Agent Configuration Rollouts: Feature Flags for Tools, Prompts, and Policies** / **Rollout Configuration cho Agent: Feature Flag cho Tool, Prompt và Policy** | Tập trung vào config targeting, sticky cohorts, provenance, kill switch và rollback của prompt/tool/policy; không phải model release experimentation. | Rất thực dụng cho team ship thay đổi non-code của agent mà chưa có pattern rõ. | **8.5/10** |
| 8 | **Authorization Across Delegation Chains: Proving Who Allowed the Action** / **Authorization qua Chuỗi Delegation của Agent: Chứng minh ai cho phép Action** | Chỉ nghiên cứu propagation, attenuation, expiry và proof xuyên nhiều agent; không lặp basic identity, A2A transport hay approval UX. | Có chiều sâu security và mở rộng tự nhiên từ identity/delegation hiện có. | **8.3/10** |
| 9 | **Evidence Retention for AI Decisions: Keeping Proof Without Keeping Sensitive Payloads** / **Lưu Evidence cho Quyết định AI: Giữ bằng chứng mà không giữ toàn bộ dữ liệu nhạy cảm** | Minimal evidence, hashes, retention tiers và audit reconstruction; không phải cited answers, observability hay deletion guarantees. | Tạo điểm giao hiếm giữa provenance, privacy, audit và deletion. | **8.2/10** |
| 10 | **Human-Safe Reconciliation: Recovering Agent State After an Uncertain Tool Outcome** / **Reconciliation an toàn khi Tool Result không chắc chắn** | Xử lý unknown outcome sau timeout/partial failure bằng read-after-write, reconciliation state machine và escalation; không phải idempotency hay durable execution. | Gần với failure thực tế và làm rõ khoảng giữa “retry-safe” và “đã biết trạng thái cuối”. | **8.1/10** |

## Chủ đề được chọn

Tôi chọn **Tool Result Freshness: Preventing Agents from Acting on Expired Observations** vì đây là khoảng trống rõ nhất sau khi loại trừ các bài đã có. Folio đã nói về việc cache câu trả lời, truy hồi theo thời gian, xác minh trạng thái trình duyệt, retry-safe action và approval có thời hạn; nhưng chưa có bài tách riêng một observation từ tool thành một **fact có tuổi đời, phiên bản, phạm vi và điều kiện revalidation** trước khi agent được phép hành động.

Bài sẽ không khẳng định tool result freshness là một chuẩn pháp lý hay một tính năng có sẵn trong mọi framework. Đây là một pattern application-level, mượn các khái niệm freshness/age/validation của HTTP caching để thiết kế contract cho agent. Trọng tâm là: tool trả về snapshot gì, snapshot đó được phép sống bao lâu, action cần freshness mức nào, hệ thống revalidate ở đâu, và phải dừng thế nào khi dữ liệu đã hết hạn.

### Publication và cấu trúc nội dung

Ngày xuất bản được chọn ngẫu nhiên trong khoảng người dùng yêu cầu là **2026-04-20**. Shared slug sẽ là `tool-result-freshness-agent-observations`, với `category: "engineering"`, `draft: false`, cặp `lang: "en"` và `lang: "vi"`, cùng một `translationKey` và một hero dùng đồng thời làm thumbnail.

Bài sẽ viết theo giọng kể first-person production của folio, mở bằng một incident trong đó agent thấy inventory còn hàng nhưng action diễn ra sau khi stock đã đổi. Cấu trúc dự kiến gồm: observation không phải truth vĩnh viễn; freshness contract; soft TTL, hard TTL và version; read-before-write revalidation; so sánh stale-while-revalidate với fail-closed; race window và optimistic concurrency; tool/result schema; metrics; test matrix; rollout theo risk tier; checklist. Bộ ảnh gồm hero/thumbnail và ba visual trong bài: observation lifecycle, revalidation gate và state/version race.

## Kết luận biên tập

Đây là lựa chọn có độ mới cao, vừa đủ chuyên sâu cho nhóm độc giả engineering, nhưng vẫn có hook dễ hiểu cho người đọc AI product. Nó có thể liên kết hữu ích tới các bài hiện có về [Semantic Caching](/blog/semantic-caching-llm-freshness-safety/), [Temporal RAG](/blog/temporal-rag-time-aware-retrieval/), [State-Aware Browser Agents](/blog/state-aware-browser-agents/) và [Idempotent AI Actions](/blog/idempotent-ai-actions/) mà không biến thành bản viết lại của chúng.

## References

[1]: https://www.rfc-editor.org/rfc/rfc9111.html "RFC 9111 — HTTP Caching"
[2]: https://openfga.dev/docs/modeling/agents "OpenFGA — Authorization for Agents"
