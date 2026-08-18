# OrcaRouter / Qwen3.8-27B-Free findings

- Model page: https://www.orcarouter.ai/models/qwen/qwen3.8-27b-free
- Chat API reference: https://docs.orcarouter.ai/api-reference/chat/create-a-chat-completion
- The API is OpenAI-compatible and uses `POST https://api.orcarouter.ai/v1/chat/completions`.
- Authentication is via `Authorization: Bearer <token>` and `Content-Type: application/json`.
- The model request accepts `model` and `messages`; model IDs can be provider-prefixed, bare aliases when available, or named routers.
- The docs explicitly state multimodal requests can send images via message `content` parts with `{type: "image_url", image_url: {url: ...}}`; URLs work against every vision-capable model and OrcaRouter adapts the content part for the upstream provider.
- The user-provided screenshot says to select model `qwen/qwen3.8-27b-free`, describes image input support, 256K context, and free access with rate limits. This is the intended model for the image-description playground.
The implementation should keep the API token server-side. The existing Astro repo is not a static-only app, so add a server endpoint or platform-compatible API route rather than exposing the token in the browser.

To enable the feature in a deployment, create an OrcaRouter API key at https://www.orcarouter.ai/ and set it as `ORCAROUTER_API_KEY` in the deployment environment. The UI intentionally returns a clear configuration error instead of making an unauthenticated upstream request when the variable is absent.
