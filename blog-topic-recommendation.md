# Folio AI blog opportunity review

## Phạm vi rà soát

Đã kiểm kê các file trong `src/data/blog`, gom theo `translationKey`/slug và đọc metadata cùng nội dung mở đầu của các bài tiếng Anh và tiếng Việt. Kho hiện tại có hơn 40 chủ đề song ngữ, với trọng tâm rất rõ: production AI agents, tool calling, evals, security, RAG, observability, release engineering, reliability, MCP, multi-tenant systems và các bài engineering cá nhân.

## Những vùng chủ đề đã phủ khá dày

| Cụm chủ đề | Các bài đã có trong folio | Kết luận tránh lặp |
|---|---|---|
| Reliability và recovery | durable execution, idempotent actions, compensation transactions, failover, incident response, retry/state patterns | Không viết thêm một bài retry/checkpoint chung chung |
| Context, memory và freshness | context engineering, context firewall, memory policy, temporal RAG, tool-result freshness, semantic caching | Không viết thêm bài “RAG freshness” hoặc “agent memory” cơ bản |
| Security và authorization | prompt injection, MCP poisoning, policy-as-code, agent identity, supply chain, sandboxing, human approval | Không viết thêm bài security checklist tổng quát |
| Evaluation và release | eval-driven design, regression suite, model upgrade, release experiments, Langfuse CI/CD, SLO | Không viết thêm bài eval hay canary ở mức overview |
| Agent architecture | A2A, multi-tenant, model router, event-driven, schema evolution, NLU, browser agent, voice agent | Cần đi vào một primitive còn thiếu thay vì thêm framework comparison |

## Mười chủ đề đề xuất không trùng chủ đề hiện hữu

| # | Chủ đề đề xuất | Góc tiếp cận riêng | Vì sao hợp với folio |
|---:|---|---|---|
| 1 | **AI Agents Have a Clock: Deadlines, Leases, and Stale Plans** / **AI Agent có một chiếc đồng hồ: Deadline, Lease và Plan hết hạn** | Time semantics cho agent: tách timeout kỹ thuật, deadline nghiệp vụ, lease quyền thực thi, timer bền vững và stale-plan detection | Nối reliability với safety nhưng không lặp durable execution, retry hay tool freshness; có thể viết thành playbook production rất thực dụng |
| 2 | **Agent-Ready Data Contracts: Quarantine Bad Facts Before They Reach the Model** | Data quarantine, freshness SLA, confidence routing và provenance ở lớp dữ liệu trước inference | Khác RAG provenance: tập trung vào chất lượng và trạng thái dữ liệu đầu vào, không phải citation trong output |
| 3 | **The AI Agent Control Plane: Separating Intent from Execution** | Thiết kế control plane quản lý task, policy, budgets, leases và workers thay vì để prompt điều phối mọi thứ | Mở rộng architecture theo hướng platform nhưng không trùng model router hay durable execution |
| 4 | **When the Agent Is Offline: Designing Asynchronous Workflows for Humans and Models** | Agent làm việc qua inbox, callback, approval và resume; coi “chờ” là trạng thái sản phẩm | Khác handover architecture ở repo-level; tập trung vào async product workflow và UX |
| 5 | **Agent Concurrency Is a Product Decision: Locks, Reservations, and Conflict UX** | Xử lý hai agent cùng chạm một resource: optimistic concurrency, reservation, conflict resolution và user-visible recovery | Chưa có bài về concurrent actors/resource contention; bổ sung lớp vận hành còn thiếu |
| 6 | **AI Agent Budget Policies: From Token Caps to Outcome Budgets** | Budget theo task/risk/outcome, không chỉ token cost; phân biệt spend ceiling, retry budget và action budget | Khác FinOps phân bổ chi phí: bài này tập trung vào enforcement trong runtime |
| 7 | **Designing Agent Checkpoints People Can Understand** | Checkpoint không chỉ để resume mà còn để người dùng xem, sửa, fork và tiếp tục workflow | Khác durable execution vì lấy human comprehension làm trung tâm |
| 8 | **The Last Mile of Agent Reliability: Reconciliation Against the Real World** | Reconciliation loop sau tool success/unknown outcome, drift detection và repair queue | Có liên hệ compensation nhưng không lặp; trọng tâm là đối soát định kỳ với external truth |
| 9 | **AI Agent Simulation Without Theater: Modeling Users, Tools, and World State** | Simulation có stateful environment, adversarial timing và leakage controls, thay vì synthetic prompt generator | Khác synthetic users: đề cao world model và kiểm thử state transitions |
| 10 | **Designing AI Agent Interfaces for Inspectable Work** | UI cho plan, evidence, pending action, uncertainty và change history; biến trace thành trải nghiệm | Khác failure UX/approval button: tập trung vào inspectability như một design system |

## Lựa chọn ưu tiên

Bài được chọn là **“AI Agents Have a Clock: Deadlines, Leases, and Stale Plans”**. Đây là chủ đề cân bằng tốt nhất giữa tính mới, chiều sâu kỹ thuật và độ hợp với voice hiện có của folio. Nó tận dụng thế mạnh của tác giả ở system design, safety boundary và production failure, đồng thời tránh trùng trực tiếp với các bài về durable execution, retry policy, tool-result freshness, temporal RAG và human approval.

Bài sẽ trình bày một mental model có thể áp dụng ngay: mỗi agent run phải có `deadline`, mỗi quyền hành động có thể cần `lease`, mỗi observation có `observedAt/expiresAt`, và mỗi plan cần bị từ chối khi không còn hợp lệ. Phần code sẽ dùng TypeScript/pseudocode ngắn, có bảng phân loại, state machine, rollout checklist và các failure cases đời thường thay vì giọng quảng cáo framework.

## Ngày xuất bản được chọn ngẫu nhiên

**2026-03-12**. Ngày này nằm trong khoảng tháng 1–7/2026, không trùng một ngày đã dùng trong inventory hiện tại, và phù hợp để đặt bài giữa các nhóm bài security/reliability đã có.

## Nguồn tham khảo định hướng

Các khái niệm lease, deadline/timeout và retry được đối chiếu với tài liệu về lease trong distributed systems, tài liệu Temporal về timers/timeouts/retries, cùng góc nhìn mới về data freshness cho agentic AI. Bài viết cuối sẽ diễn giải lại bằng ví dụ riêng, không sao chép nội dung nguồn.

[1]: https://martinfowler.com/articles/patterns-of-distributed-systems/lease.html "Martin Fowler — Lease"
[2]: https://temporal.io/blog/timers-timeouts-and-the-art-of-waiting-in-temporal "Temporal — Timers, Timeouts, and the Art of Waiting"
[3]: https://docs.temporal.io/encyclopedia/retry-policies "Temporal — Retry Policies"
[4]: https://www.martinfowler.com/articles/making-data-ready-for-agentic-ai.html "Martin Fowler — Making Your Data Ready for Agentic AI"
