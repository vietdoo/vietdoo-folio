# Research note — Langfuse giữa dev/prod và CI/CD

Ngày kiểm tra: 2026-08-20 (theo session)

## Nguồn chính thống

1. Langfuse, **Experiments in CI/CD**: https://langfuse.com/docs/evaluation/experiments/experiments-ci-cd
   - Luồng chính thức: tạo dataset test cases; viết experiment bằng Python hoặc JS/TS SDK; thêm evaluators; raise `RegressionError` khi score vi phạm threshold; chạy qua `langfuse/experiment-action` trong GitHub Actions.
   - Action hỗ trợ `dataset_name`, `dataset_version`, `experiment_metadata`, `should_fail_on_regression`, `should_fail_on_script_error`, và PR comment. Context của action cung cấp metadata mặc định như commit SHA, branch, job URL và actor.
   - Tài liệu ghi yêu cầu tối thiểu cho action: Python SDK v4.6.0+ hoặc JS SDK v5.3.0+; action có thể dùng `langfuse_base_url` cho Langfuse Cloud hoặc self-hosted.

2. Langfuse, **Environments**: https://langfuse.com/docs/observability/features/environments
   - Environment tổ chức traces, observations, scores và sessions theo các context như production, staging, development; cho phép tách data dev/prod trong cùng project, lọc theo environment và tái sử dụng datasets/prompts.
   - Có thể cấu hình bằng `LANGFUSE_TRACING_ENVIRONMENT` hoặc tham số khởi tạo client; tham số khởi tạo có precedence. Nếu không cấu hình, giá trị mặc định là `default`.
   - Environment phải khớp regex `^(?!langfuse)[a-z0-9-_]+$` và tối đa 40 ký tự; các environment được tạo khi ingest lần đầu và hiện không thể delete/rename qua UI.
   - Với request-scoped environment, Python SDK có `propagate_attributes(environment="...")`; `as_baggage=True` dùng để truyền qua service boundary.

3. Langfuse, **Prompt Management — Get Started**: https://langfuse.com/docs/prompt-management/get-started
   - Prompt có version; tạo prompt cùng name sẽ tạo version mới.
   - Có thể gắn label `production` khi promote. Runtime nên fetch version production có chủ đích; API hỗ trợ fetch theo `label=production` hoặc pin theo `version`.
   - Prompt hỗ trợ text và chat; runtime compile variables theo template. Public API và SDK đều hỗ trợ create/fetch.

4. Langfuse, **SDK Overview**: https://langfuse.com/docs/observability/sdk/overview
   - Python SDK v4 và JS/TS SDK v5 là SDK hiện hành; tracing dựa trên OpenTelemetry.
   - SDK hỗ trợ async requests, latency tracking, nested observations và lỗi SDK không làm vỡ application vì được catch/log.
   - Self-hosted compatibility trong tài liệu: Python SDK v3/v4 và JS/TS SDK v4/v5 yêu cầu server >= 3.63.0; Cloud đáp ứng minimum.

## Editorial conclusions

- Bài phải phân biệt rõ **Langfuse environment field** với việc tách project/instance và với deployment environment của CI/CD; không tuyên bố ba khái niệm này là một.
- Promotion nên pin prompt version/label và lưu release metadata gồm commit SHA, branch, environment, model, prompt version, dataset version và job URL.
- Data promotion có chọn lọc: prompt/version/dataset definition/eval config có thể promote; raw production traces/PII/secrets không được copy thẳng về dev; nếu cần dùng làm regression case thì phải redact/minimize.
- CI gate nên fail khi regression threshold hoặc script error xảy ra; dataset version cần pin để kết quả reproducible.
- Bài cần làm rõ đâu là capability chính thức của Langfuse và đâu là pattern kiến trúc đề xuất (ví dụ GitOps manifest, approval gate, canary/rollback).

## Chưa được khẳng định trong nguồn đã đọc

- Cơ chế import/export prompt/dataset cụ thể giữa hai Langfuse project hoặc instance cần đọc thêm API/CLI/self-hosting docs trước khi viết code minh họa.
- Cách quản lý nhiều environment tùy thuộc Cloud project hay self-hosted instance cần đối chiếu FAQ/architecture docs.
- Không được dùng `latest` như một release contract trong production nếu yêu cầu reproducibility; bài cần khuyến nghị label/version rõ ràng nhưng phải diễn đạt phù hợp với API hiện hành.

## Planned article

EN: Langfuse Across Environments: Syncing Prompts, Traces, and Evaluations from Dev to Production
VI: Langfuse giữa các môi trường: Đồng bộ Prompt, Trace và Evaluation từ Dev đến Production
Slug dự kiến: langfuse-dev-prod-prompt-trace-eval-cicd
Media plan: hero/thumbnail, environment promotion map, CI/CD release gates, trace-to-regression loop.

## Additional sources to verify

- Langfuse Prompt Management overview and concepts
- Langfuse datasets and experiments docs
- Langfuse API/CLI docs
- Langfuse self-hosting and compatibility matrix
- GitHub Actions workflow/security documentation
- Langfuse best practices for tracing and masking

*Note: Đây là research note nội bộ, không thay thế references cuối bài blog.*

## Findings added during research

- Official CI/CD docs show a first-party `langfuse/experiment-action` path, PR-comment support, pinned dataset timestamp via `dataset_version`, and fail-fast regression handling via `RegressionError`.
- Official environments docs show environment is first-class on traces, observations, scores, and sessions; it can be configured globally or per request scope.
- Official prompt docs show labels and versions are separate control points; production fetch defaults to the `production` label, while an explicit version can be requested for reproducibility.
- Official SDK docs state current major SDK generations and self-hosted minimum server compatibility.

### Sources accessed

- https://langfuse.com/docs/evaluation/experiments/experiments-ci-cd
- https://langfuse.com/docs/observability/features/environments
- https://langfuse.com/docs/prompt-management/get-started
- https://langfuse.com/docs/observability/sdk/overview

## Additional verified sources

5. Langfuse, **Prompt Version Control**: https://langfuse.com/docs/prompt-management/features/prompt-version-control
   - Prompt deployment is managed through versions and labels. Labels may represent environments, tenants, or experiments.
   - `latest` points to the newest version; absent an explicit label the SDK serves the version labeled `production`.
   - A rollback can be done by moving the `production` label to a previous version. Protected labels can prevent viewer/member roles from modifying or deleting deployment labels.
   - Prompts are scoped to a project; separate-project synchronization is a distinct concern.

6. Langfuse, **Datasets**: https://langfuse.com/docs/evaluation/experiments/datasets
   - A dataset is a collection of inputs and expected outputs used to test/benchmark an LLM application.
   - Dataset item add/update/delete/archive creates a new version tracked by timestamp; schemas themselves are not versioned.
   - A dataset can be retrieved at a version timestamp and used for reproducible experiments.

7. Langfuse, **Masking**: https://langfuse.com/docs/observability/features/masking
   - Masking can redact inputs, outputs, metadata, and OpenTelemetry attributes before export.
   - Current Python setups should prefer `mask_otel_spans`; the legacy `mask` hook runs at SDK attribute creation time and does not cover final raw third-party OTEL attributes in the same way.
   - Masking is synchronous and must be deterministic/fast; an invalid masking result can drop an export batch or span.
   - For OTEL Collector deployments, masking can be applied in application or collector layer; separate exporters require separate masking policies.

8. Langfuse, **Data Masking (self-hosted)**: https://langfuse.com/self-hosting/security/data-masking
   - Client-side masking prevents sensitive data from leaving the application.
   - Self-hosted server-side ingestion masking is an Enterprise feature and acts as centralized safety net; it is not a replacement for client-side masking when data must never leave the app boundary.
   - Server-side masking callback applies to OTEL ingestion and may be configured fail-open or fail-closed; asynchronous processing means data lands in blob storage before masking/ClickHouse persistence, so policy decisions must consider this boundary.

9. Langfuse, **GitHub Integration**: https://langfuse.com/docs/prompt-management/features/github-integration
   - Officially documented options include GitHub Repository Dispatch to trigger CI/CD when prompts change, and a Prompt Version Webhook plus a webhook server to sync prompt changes into a repository.
   - Repository Dispatch payload can include prompt name, version and labels; a workflow can gate deployment on the `production` label.
   - Prompt Version Webhooks require a public HTTPS endpoint and signing secret; the integration can commit prompt JSON into GitHub via the Contents API. This is a supported pattern, but a production implementation must verify webhook signatures, handle retries/idempotency and avoid leaking prompt secrets.

10. Langfuse, **CLI**: https://langfuse.com/docs/api-and-data-platform/features/cli
    - `npx langfuse-cli api <resource> <action>` wraps the full Langfuse API; credentials come from the same project-scoped public/secret key pair and `LANGFUSE_BASE_URL`.
    - It can script prompt, dataset, trace, score and other workflows in CI/CD.

11. Langfuse, **Public API**: https://langfuse.com/docs/api-and-data-platform/features/public-api
    - Project-level APIs cover prompts, traces, evaluations and configuration; organization-level and instance-management APIs are separate.
    - Current docs recommend high-performance Observations API v2, Metrics API v2 and Scores API v3 for new extraction workflows.
    - Prompt retrieval should use SDK `get_prompt`/`getPrompt` for client-side caching, retries and fallbacks.
    - OTEL endpoint is the supported ingestion path; the legacy ingestion endpoint is scheduled for Cloud sunset on 2026-11-16 and is unavailable in self-hosted v4 default `events_only` mode.

12. Langfuse, **Deployment Strategies (self-hosted)**: https://langfuse.com/self-hosting/security/deployment-strategies
    - A single deployment is the standard recommendation, using RBAC and projects for logical separation across teams/environments.
    - Multiple deployments are justified by strict regulatory/infrastructure isolation but add duplicated cost, upgrade burden and make prompt/dataset synchronization harder.

## Refined article guidance

The article will recommend a default single Langfuse deployment with project/RBAC/environment separation where acceptable, and will explicitly describe when physical multi-deployment is required. It will distinguish three synchronization planes: application release artifacts in Git, Langfuse-managed prompt versions/labels, and observability/evaluation data. It will not claim that all three should be copied identically.

A safe CI/CD example should use a pinned dataset version, a named experiment, a threshold-based regression failure, protected production labels, environment-specific credentials, and redacted test inputs. GitHub Repository Dispatch and Prompt Version Webhooks will be presented as official integration options; custom webhook hardening and GitOps manifests will be labeled as implementation patterns rather than native Langfuse features.

## Sources accessed in this pass

- https://langfuse.com/docs/prompt-management/features/prompt-version-control
- https://langfuse.com/docs/evaluation/experiments/datasets
- https://langfuse.com/docs/observability/features/masking
- https://langfuse.com/self-hosting/security/data-masking
- https://langfuse.com/docs/prompt-management/features/github-integration
- https://langfuse.com/docs/api-and-data-platform/features/cli
- https://langfuse.com/docs/api-and-data-platform/features/public-api
- https://langfuse.com/self-hosting/security/deployment-strategies
