import type {
  ProviderFailure,
  ProviderName,
  ProviderRequest,
  ProviderResponse,
} from "./types";
import { getEnvKey } from "./model-catalog";

const PROVIDER_URLS: Record<ProviderName, string> = {
  orcarouter: "https://api.orcarouter.ai/v1/chat/completions",
  openrouter: "https://openrouter.ai/api/v1/chat/completions",
};

const DEFAULT_TIMEOUT_MS = 22_000;

export class ProviderRequestError extends Error {
  readonly failure: ProviderFailure;

  constructor(failure: ProviderFailure) {
    super(failure.message);
    this.name = "ProviderRequestError";
    this.failure = failure;
  }
}

function isRetryableStatus(status?: number) {
  return (
    status === undefined || [408, 409, 429, 500, 502, 503, 504].includes(status)
  );
}

function parseErrorMessage(
  payload: unknown,
  provider: ProviderName,
  status: number,
) {
  if (payload && typeof payload === "object") {
    const error = (payload as { error?: unknown }).error;
    if (error && typeof error === "object" && "message" in error) {
      const message = (error as { message?: unknown }).message;
      if (typeof message === "string" && message.trim()) return message.trim();
    }
    if ("message" in payload) {
      const message = (payload as { message?: unknown }).message;
      if (typeof message === "string" && message.trim()) return message.trim();
    }
  }
  return `${provider} returned HTTP ${status}.`;
}

function normalizeUsage(payload: unknown) {
  const usage =
    payload && typeof payload === "object"
      ? (payload as { usage?: Record<string, unknown> }).usage
      : undefined;
  if (!usage) return undefined;
  return {
    promptTokens:
      typeof usage.prompt_tokens === "number" ? usage.prompt_tokens : undefined,
    completionTokens:
      typeof usage.completion_tokens === "number"
        ? usage.completion_tokens
        : undefined,
    totalTokens:
      typeof usage.total_tokens === "number" ? usage.total_tokens : undefined,
  };
}

function normalizeContent(payload: unknown) {
  const choice =
    payload && typeof payload === "object"
      ? (payload as { choices?: Array<{ message?: { content?: unknown } }> })
          .choices?.[0]
      : undefined;
  const content = choice?.message?.content;
  return typeof content === "string" ? content.trim() : "";
}

export async function completeWithProvider(
  provider: ProviderName,
  request: ProviderRequest,
): Promise<ProviderResponse> {
  const apiKey = getEnvKey(provider);
  if (!apiKey) {
    throw new ProviderRequestError({
      provider,
      code: "missing_configuration",
      message: `${provider} is not configured.`,
      retryable: false,
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  const signal = request.signal
    ? AbortSignal.any([request.signal, controller.signal])
    : controller.signal;

  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };
    if (provider === "openrouter") {
      headers["HTTP-Referer"] = "https://vietdoo.vndo.vn";
      headers["X-OpenRouter-Title"] = "vndo-ai";
    }

    const response = await fetch(PROVIDER_URLS[provider], {
      method: "POST",
      headers,
      signal,
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        temperature: request.temperature ?? 0.4,
        max_tokens: request.maxTokens ?? 1200,
        ...(provider === "orcarouter"
          ? { chat_template_kwargs: { enable_thinking: false } }
          : provider === "openrouter"
            ? { reasoning: { effort: "none" } }
            : {}),
      }),
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new ProviderRequestError({
        provider,
        status: response.status,
        code: response.status === 429 ? "rate_limited" : "upstream_error",
        message: parseErrorMessage(payload, provider, response.status),
        retryable: isRetryableStatus(response.status),
      });
    }

    const content = normalizeContent(payload);
    if (!content) {
      throw new ProviderRequestError({
        provider,
        status: response.status,
        code: "empty_response",
        message: `${provider} returned an empty response.`,
        retryable: true,
      });
    }

    return {
      content,
      provider,
      model: request.model,
      usage: normalizeUsage(payload),
    };
  } catch (error) {
    if (error instanceof ProviderRequestError) throw error;
    throw new ProviderRequestError({
      provider,
      code:
        error instanceof DOMException && error.name === "AbortError"
          ? "timeout"
          : "network_error",
      message: `${provider} could not be reached.`,
      retryable: true,
    });
  } finally {
    clearTimeout(timeout);
  }
}
