# Audit blog và cơ hội chủ đề AI mới — 27/08/2026

## Phạm vi rà soát

Tôi đã kiểm tra trực tiếp `src/data/blog` trên repository `vietdoo/vietdoo-folio`, đọc front matter, translation key, tiêu đề, mô tả, heading và các đường dẫn ảnh. Hiện có **118 file Markdown trong checkout** tương ứng với **57 nhóm translation key**, trong đó phần lớn là các cặp EN/VI và vẫn còn một số bài legacy chưa ghép cặp. Trục biên tập nổi bật của Folio là production AI engineering: agent reliability, evaluation, observability, security boundaries, MCP/tooling, RAG/memory, routing/failover, identity, approval, sandboxing, streaming, cost và deployment.

Các vùng đã được phủ tương đối sâu gồm: policy-as-code và authorization; identity/delegation/revocation; MCP least privilege và tool poisoning; prompt injection; human approval; idempotency; durable execution; incident response; provider failover và model routing; model upgrade; eval suite và release experiment; observability/telemetry/decision trace; context engineering/firewall; memory policy; semantic caching; temporal RAG; output provenance; partial-answer UX; browser state; voice interruption; multi-tenant isolation; cost allocation; admission control; schema evolution; multimodal RAG; sandboxing; và A2A collaboration. Vì vậy, các đề xuất dưới đây không quay lại các chủ đề đó dưới tên mới.

## Tín hiệu thị trường và kỹ thuật

Báo cáo *State of AI Engineering 2026* của Datadog mô tả bước chuyển từ một model call đơn lẻ sang model fleet, orchestration, tool calls, prompt dài, retry và nhiều service boundary; báo cáo cũng nhấn mạnh rằng thay đổi model, prompt hoặc retrieval có thể làm thay đổi latency, chi phí và failure rate mà không có code diff rõ ràng.[1] Điều này làm các bài có ranh giới production cụ thể phù hợp hơn một bài tổng quan về “AI agent architecture”.

Một bài viết của Oracle minh họa order-exception workflow trong đó agent đã reserve inventory và queue payment adjustment trước khi bước shipping thất bại. Retry không tự undo được side effect; timeout cũng không chứng minh downstream thất bại vì operation có thể vẫn đang chạy hoặc đã thành công nhưng chưa trả response.[2] Nghiên cứu *Robust Agent Compensation* đưa compensation vào recovery manager dạng log, ghép action với compensation và truy ra input cho compensation từ output của action trước đó.[3] Tài liệu Saga của Temporal bổ sung nguyên tắc thực dụng: mỗi local transaction có một compensating action, compensation chạy theo thứ tự ngược và nên được đăng ký trước activity để vẫn bao phủ trường hợp activity fail sau khi đã tạo partial effect.[4]

## Mười cơ hội chủ đề không trùng với blog hiện có

| Hạng | Chủ đề EN / VI | Ranh giới chống trùng | Vì sao phù hợp với Folio | Điểm tiềm năng |
|---:|---|---|---|---:|
| 1 | **AI Agent Compensation Transactions: Recovering from Partial Side Effects** / **Compensation Transaction cho AI Agent: Khôi phục sau Partial Side Effect** | Không phải idempotency, durable execution hay incident response. Trọng tâm là compensation contract, action ledger, trạng thái `unknown`, và recovery có kiểm soát khi tool đã tạo side effect một phần. | Có incident mở bài mạnh, code contract rõ, state machine, bảng failure mode và cầu nối tự nhiên giữa agent, workflow và distributed systems. | **9.8/10** |
| 2 | **Embedding Index Migrations: Re-Embedding Without Losing Retrieval Behavior** / **Migration Embedding Index: Re-Embedding mà không làm mất Retrieval Behavior** | Chỉ xử lý version index, dual-read, backfill, recall/precision delta và rollback; không viết lại temporal hoặc multimodal RAG. | Là migration problem cụ thể, hữu ích cho team có corpus lớn và tạo được diagram kỹ thuật dễ đọc. | **9.3/10** |
| 3 | **Semantic Drift in AI Products: Detecting When Correct Behavior Quietly Changes** / **Semantic Drift trong AI Product: Khi hành vi đúng âm thầm thay đổi** | Không phải model upgrade hoặc release experiment chung; đo thay đổi ở intent slice, tool choice, escalation và user rework. | Bổ sung lớp “hành vi người dùng” vào mạch SLO/evaluation hiện có mà không lặp lại eval suite. | **9.1/10** |
| 4 | **Multimodal Input Contracts: Making Images, Audio, and PDFs Testable** / **Input Contract đa phương thức: Khi Image, Audio và PDF có thể Test** | Tập trung normalization, OCR/transcription uncertainty, schema và rejection trước retrieval; không phải multimodal RAG. | Mở rộng AI engineering sang input boundary, có thể minh họa bằng pipeline và contract examples. | **8.9/10** |
| 5 | **Agent Configuration Rollouts: Feature Flags for Prompts, Tools, and Policies** / **Rollout Configuration cho Agent: Feature Flag cho Prompt, Tool và Policy** | Không phải model release experiment; chỉ nói về targeting, sticky cohorts, provenance, kill switch và rollback cho non-code configuration. | Rất thực dụng cho team ship thay đổi prompt/tool/policy mà vẫn kiểm soát blast radius. | **8.7/10** |
| 6 | **Agent Capacity Planning: Turning Task Mix into GPU and Queue Demand** / **Capacity Planning cho Agent: Từ Task Mix đến GPU và Queue Demand** | Không lặp admission control hoặc on-prem VRAM; tập trung workload shape, burst, token demand, reservation và forecast. | Nối được FinOps, queue và serving thành một bài vận hành có số liệu nhưng không biến thành bài giới thiệu hạ tầng. | **8.5/10** |
| 7 | **Evidence Retention for AI Decisions: Keeping Proof Without Keeping Sensitive Payloads** / **Lưu Evidence cho Quyết định AI: Giữ bằng chứng mà không giữ toàn bộ Payload nhạy cảm** | Không phải cited answer, observability hay deletion guarantee; tập trung minimal evidence, hash, retention tier và audit reconstruction. | Giao điểm riêng giữa provenance, privacy, audit và data minimization; hợp với độc giả enterprise. | **8.4/10** |
| 8 | **Evaluation Dataset Governance: Consent, Lineage, and Deletion for AI Test Data** / **Governance cho Evaluation Dataset: Consent, Lineage và Deletion của Dữ liệu Test AI** | Chỉ xử lý dữ liệu dùng để eval, không phải synthetic users hoặc memory deletion của agent runtime. | Mở rộng câu chuyện evaluation từ metric sang quyền sử dụng, lineage và vòng đời dữ liệu. | **8.1/10** |
| 9 | **Concurrency Control for AI Agents: Leases, Locks, and Optimistic Conflict Checks** / **Concurrency Control cho AI Agent: Lease, Lock và Kiểm tra Xung đột** | Không phải idempotent retry hay multi-tenant isolation; tập trung hai agent cùng sửa một resource và cách phát hiện lost update trước side effect. | Có tình huống production rõ, code dễ áp dụng và bổ sung khoảng trống “hai action đều hợp lệ nhưng cùng lúc thì sai”. | **8.0/10** |
| 10 | **Dead-Letter Workflows for AI Agents: Parking Runs That Should Not Auto-Retry** / **Dead-Letter Workflow cho AI Agent: Đưa Run không nên Retry vào vùng chờ an toàn** | Không phải kill switch hoặc incident response; tập trung phân loại run không thể tự xử lý, giữ context tối thiểu, SLA escalation và resume có điều kiện. | Hữu ích khi agent tăng quy mô, tạo một lớp vận hành còn thiếu giữa retry tự động và con người xử lý. | **7.9/10** |

## Bài được chọn

Bài được chọn là **AI Agent Compensation Transactions: Recovering from Partial Side Effects** với bản tiếng Việt **Compensation Transaction cho AI Agent: Khôi phục sau Partial Side Effect**. Đây là lựa chọn mạnh nhất vì nó giải quyết một failure mode mà các bài hiện tại mới chỉ chạm ở những lát cắt khác nhau: idempotency giúp tránh lặp, durable execution giúp resume, approval giúp chặn trước action, còn bài mới sẽ trả lời câu hỏi **sau khi một phần side effect đã xảy ra thì hệ thống khôi phục thế nào mà không giả vờ rằng rollback là miễn phí**.

Scope bài được khóa ở application-level playbook. Bài sẽ không trình bày Saga như một khái niệm mới, không tuyên bố RAC là sản phẩm duy nhất và không cho model tự phát minh compensation ở thời điểm incident. Trọng tâm là: action contract có `effect`, `unknown-state probe` và `compensation`; durable action ledger; phân biệt `failed` với `unknown`; đăng ký compensation trước forward action; chạy compensation theo thứ tự ngược; authorize compensation như một action riêng; và chuyển sang human reconciliation khi inverse không an toàn hoặc không tồn tại.

> **Ngày xuất bản được chọn ngẫu nhiên trong khoảng tháng 1–7/2026:** `2026-06-07`.

### Editorial brief

| Trường | Quyết định |
|---|---|
| Shared slug | `ai-agent-compensation-transactions` |
| Category | `engineering` |
| Languages | English và Vietnamese, hai bản đầy đủ tương đương |
| Target length | Khoảng 3.000–3.800 từ mỗi ngôn ngữ |
| Visual set | 1 hero/thumbnail + 3 hình trong bài, cùng phong cách technical whiteboard trên nền giấy kem |
| Core structure | Incident mở bài; rollback không phải compensation; effect contract; action ledger; `failed` vs `unknown`; đăng ký compensation trước action; reverse-order recovery; authorization; code; state machine; failure-mode matrix; operational checklist; references |
| Primary audience | Kỹ sư backend/platform đang đưa AI agent vào workflow có side effect |

## References

[1]: https://www.datadoghq.com/state-of-ai-engineering/ "Datadog — State of AI Engineering 2026"

[2]: https://blogs.oracle.com/database/ai-agents-enterprise-reality-workflows-transactions-runtime-controls "Oracle Database Insider — When AI Agents Meet Enterprise Reality: Workflows, Transactions, and Runtime Controls"

[3]: https://arxiv.org/html/2605.03409v2 "Perera et al. — Robust Agent Compensation (RAC): Teaching AI Agents to Compensate"

[4]: https://docs.temporal.io/design-patterns/saga-pattern "Temporal Documentation — Saga Pattern"
