# Provider Rotation / Multi-Model Failover — Delivery Report

**Ngày hoàn tất:** 19/08/2026  
**Ngày publish trong bài:** 19/08/2026  
**Repository:** `vietdoo/vietdoo-folio`

## Bài viết

Bài mới có tiêu đề tiếng Anh **“Multi-Model Failover Without Route Flapping: Provider Rotation, Stateful Recovery, and Quality Gates”** và bản tiếng Việt **“Failover đa mô hình không phải Route Flapping: Xoay Provider, Phục hồi Stateful và Quality Gate”**.

Góc tiếp cận được chọn để không trùng với bài `model-router-ai-agent`: bài cũ tập trung vào chọn model theo capability, cost và latency; bài mới tập trung vào lớp vận hành sau quyết định đó, gồm phân tách provider rotation với model fallback, capability envelope, provider health, quota-aware admission, circuit breaker, retry budget, jittered backoff, stateful failover, route lease, continuity preservation và quality gates.

Nội dung có các ví dụ code Python, route matrix, bảng quyết định, checklist production và liên kết nội bộ tới các bài về model router, idempotent actions, durable execution, agent evals và agent observability. Hai bản EN/VI dùng chung `translationKey`, cùng ngày pub và cùng cấu trúc hình ảnh.

## Research đã dùng

Các claim kỹ thuật được đối chiếu với tài liệu OpenRouter về provider selection và model fallbacks, hướng dẫn OpenAI về `Retry-After`, exponential backoff, jitter và retry budget, tài liệu Anthropic về request/token rate-limit headers và acceleration limits, bài Sierra AI về congestion-aware model failover và behavior preservation, cùng nghiên cứu ContinuityBench về stateful failover và conversational continuity.

Các nguồn được liên kết trực tiếp ở phần References cuối mỗi bài. Những con số trong nghiên cứu ContinuityBench được trình bày rõ là kết quả của chính evaluation của nghiên cứu, không phải cam kết chung cho mọi hệ thống.

## Visual assets

Bộ ảnh được tạo theo phong cách **whiteboard app / hand-drawn technical editorial** với nền giấy sáng, nét marker không hoàn hảo, mảng nhấn coral–blue–yellow–mint và chú thích lớn dễ đọc:

| Asset | Vai trò |
|---|---|
| `hero.png` | Thumbnail/hero: model router, provider pools, retry budget và stateful conversation. |
| `provider-pools.png` | Phân biệt provider rotation với model fallback. |
| `circuit-breaker-retry-budget.png` | Circuit breaker, half-open probe, retry budget, jittered backoff và retry storm. |
| `stateful-failover.png` | Continuity envelope, immutable tool events, state hash và route lease. |

## Kiểm tra

`pnpm run check` hoàn tất với **0 errors** và chỉ còn các hints/warnings vốn có trong project. Astro build với `@astrojs/vercel` hoàn tất thành công và prerender được route mới `/blog/provider-rotation-multi-model-failover/`. Các asset đều nằm trong `public/blog/provider-rotation/` và được tham chiếu đúng từ cả hai bản ngôn ngữ.

## Git và deploy

Bài mới, các asset và report này sẽ được đưa vào **một commit riêng**, sau đó push lên `main`. Workflow GitHub Actions sẽ được theo dõi sau push. Repository hiện build artifact Vercel trong CI; production URL chỉ cập nhật trực tiếp nếu Vercel Git Integration hoặc deployment hook bên ngoài repository đang hoạt động.
