# Smart router provider findings

## OpenRouter

- Official API base URL: `https://openrouter.ai/api/v1`.
- Chat completions use `POST /chat/completions`, Bearer authentication, and an OpenAI-compatible JSON body with `model` and `messages`.
- The Models API is `GET /models` and exposes model metadata, including input modalities, output modalities, supported parameters, context length, pricing, provider data, and latency/throughput-related fields.
- OpenRouter supports model fallback with a `models` array in priority order. The fallback model is tried when the selected model returns errors such as rate limits, downtime, moderation refusal, or context validation failures.
- OpenRouter supports provider-level routing through a `provider` request object. Relevant fields include `order`, `allow_fallbacks`, `require_parameters`, `data_collection`, `only`, `ignore`, `sort`, `preferred_min_throughput`, `preferred_max_latency`, and `max_price`.
- OpenRouter also performs provider load balancing by default when explicit provider order/sort is not supplied. For the application-level router, keep a second layer that can fail over between OrcaRouter and OpenRouter when a provider request fails.

## Architecture implications

- Keep a provider adapter interface independent of provider-specific HTTP details.
- Keep the public API contract provider-agnostic. The client sends messages and optional task intent/capability hints, never a provider or model ID.
- Use a server-only model catalog with normalized capability labels: text, image, video, audio, file, tools, structured-output, and streaming.
- Distinguish retryable failures (timeouts, 408, 429, 500, 502, 503, 504, network errors) from non-retryable client/model failures (400, 401, 403, invalid input). Only retry/fail over on the former and on an empty/invalid provider response.
- Add bounded timeouts, per-request attempt budgets, circuit-breaker state, and structured redacted logs. Never return provider API keys or raw upstream error payloads to the browser.

## Sources

- https://openrouter.ai/docs/api/api-reference/chat/create-a-chat-completion
- https://openrouter.ai/docs/api/api-reference/models/list-all-models-and-their-properties
- https://openrouter.ai/docs/guides/routing/model-fallbacks
- https://openrouter.ai/docs/guides/routing/provider-selection
- Existing repo note: `docs/orcarouter-qwen-findings.md`

Generated for the vndo-ai smart routing implementation on 2026-08-18.
