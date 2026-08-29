# Audit blog và cơ hội chủ đề AI mới — 29/08/2026

## Phạm vi rà soát

Đã rà soát `src/data/blog/*.md`, metadata `pubDate`, `category`, `translationKey`, các bản EN/VI, quy ước hình ảnh dưới `public/blog/`, cùng các bài gần đây về reliability, agent runtime, tool calls, RAG, routing, evaluation, security và deployment. Kết luận: folio đã có độ phủ tốt ở các chủ đề **idempotent action**, **tool-result freshness**, **approval fatigue**, **prompt injection**, **MCP tool poisoning**, **agent disagreement**, **provider failover**, **model upgrade**, **multi-tenant isolation**, **synthetic users**, **observability**, **RAG**, **browser agents**, **voice agents** và **event-driven reliability**.

Một chủ đề mới chỉ được xem là không trùng lặp nếu có failure mode, abstraction và operational artifact riêng; không chỉ đổi tên cho một bài cũ.

## Mười cơ hội chủ đề không trùng với blog hiện có

| # | English title / Tiêu đề tiếng Việt | Khoảng trống riêng | Tiềm năng |
|---:|---|---|---:|
| 1 | **AI Agent Compensation Transactions: Recovering from Partial Side Effects** / **Compensation Transaction cho AI Agent: Khôi phục sau Partial Side Effect** | Tập trung vào business compensation sau khi workflow đã tạo side effect một phần; khác với idempotency, retry, approval và durable execution. | **9.5/10** |
| 2 | **Policy-as-Code for AI Agents: Turning Intent into Enforceable Runtime Decisions** / **Policy-as-Code cho AI Agent: Biến Intent thành Quyết định Runtime có thể cưỡng chế** | Đi từ policy lifecycle, decision trace và enforcement boundary; không lặp prompt-injection hay tool authorization. | **9.1/10** |
| 3 | **AI Agent Admission Control: Backpressure Before Context Becomes a Cost Incident** / **Admission Control cho AI Agent: Backpressure trước khi Context thành Cost Incident** | Xử lý overload, queueing, token budget và load shedding trước model call; khác model routing và telemetry. | **8.9/10** |
| 4 | **Capability Negotiation for Tool-Using Agents: Stop Assuming Every Tool Can Do Everything** / **Capability Negotiation cho Tool-Using Agent: Đừng giả định Tool nào cũng làm được mọi thứ** | Contract discovery và graceful degradation khi tool version/capability thay đổi; khác MCP poisoning. | **8.7/10** |
| 5 | **Prompt Cache Invalidation for AI Systems: When Reuse Becomes a Correctness Bug** / **Invalidation cho Prompt Cache: Khi Reuse trở thành Bug về Correctness** | Cache invalidation theo policy, tenant, model và freshness; khác semantic caching hiện có ở lớp correctness của prompt scaffold. | **8.6/10** |
| 6 | **Token Budget Allocation Across Agent Plans: Fairness, Deadlines, and Cutoffs** / **Phân bổ Token Budget cho Agent Plan: Fairness, Deadline và Cutoff** | Điều phối ngân sách giữa các bước trong một plan; khác cost optimization chung và streaming partial JSON. | **8.5/10** |
| 7 | **Evidence Retention for AI Decisions: Keeping Proof Without Keeping Sensitive Payloads** / **Lưu Evidence cho Quyết định AI: Giữ bằng chứng mà không giữ toàn bộ Payload nhạy cảm** | Minimal evidence, hash, retention tier và audit reconstruction; khác observability và deletion guarantee. | **8.4/10** |
| 8 | **Evaluation Dataset Governance: Consent, Lineage, and Deletion for AI Test Data** / **Governance cho Evaluation Dataset: Consent, Lineage và Deletion của Dữ liệu Test AI** | Vòng đời và quyền sử dụng dữ liệu evaluation; khác synthetic users và runtime memory deletion. | **8.1/10** |
| 9 | **Concurrency Control for AI Agents: Leases, Locks, and Optimistic Conflict Checks** / **Concurrency Control cho AI Agent: Lease, Lock và Kiểm tra Xung đột** | Hai agent cùng sửa một resource và cách ngăn lost update; khác idempotent retry và multi-tenant isolation. | **8.0/10** |
| 10 | **Dead-Letter Workflows for AI Agents: Parking Runs That Should Not Auto-Retry** / **Dead-Letter Workflow cho AI Agent: Đưa Run không nên Retry vào vùng chờ an toàn** | Vùng xử lý giữa retry tự động và human escalation cho các run không thể tự tiếp tục. | **7.9/10** |

## Bài được chọn

Bài có tiềm năng cao nhất là **AI Agent Compensation Transactions: Recovering from Partial Side Effects**. Nó trả lời một câu hỏi production còn thiếu trong chuỗi nội dung hiện tại: sau khi một phần side effect đã xảy ra, hệ thống khôi phục thế nào mà không giả vờ rollback là miễn phí? Bài sẽ phân biệt `failed` với `unknown`, mô hình hóa `effect`, `unknown-state probe` và `compensation`, dùng durable action ledger, đăng ký compensation trước forward action, chạy theo thứ tự ngược, authorize compensation như một action riêng và chuyển sang human reconciliation khi inverse không an toàn.

Ngày xuất bản được chọn ngẫu nhiên trong khoảng tháng 1–7/2026: **2026-06-07**.

### Editorial brief

| Trường | Quyết định |
|---|---|
| Shared slug | `ai-agent-compensation-transactions` |
| Category | `engineering` |
| Languages | English và Vietnamese, hai bản đầy đủ tương đương |
| Target length | Bài dài, khoảng 3.000 từ mỗi ngôn ngữ |
| Visual set | 1 hero/thumbnail + 3 hình trong bài |
| Visual style | Technical editorial / whiteboard trên nền giấy kem, nét mực xanh đậm và accent cam, đồng bộ các post kỹ thuật gần đây |
| Audience | Backend/platform engineers đang đưa AI agents vào workflow có side effect |

## References

[1]: https://docs.temporal.io/design-patterns/saga-pattern "Temporal Documentation — Saga Pattern"
[2]: https://blogs.oracle.com/database/ai-agents-enterprise-reality-workflows-transactions-runtime-controls "Oracle Database Insider — When AI Agents Meet Enterprise Reality"
[3]: https://arxiv.org/html/2605.03409v2 "Perera et al. — Robust Agent Compensation"
[4]: https://www.datadoghq.com/state-of-ai-engineering/ "Datadog — State of AI Engineering 2026"
