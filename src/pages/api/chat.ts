import type { APIRoute } from "astro";
import {
  SmartRouterError,
  inferCapabilities,
  smartComplete,
} from "../../lib/server/ai/smart-router";
import type { ChatContentPart, ChatMessage } from "../../lib/server/ai/types";
import {
  createAiRequestId,
  measureMessageChars,
  recordAiRequest,
} from "../../lib/server/ai/audit-log";
import { enableAiAuditPersistence } from "../../lib/server/ai/audit-log-persistence";

const MAX_MESSAGES = 24;
const MAX_TOTAL_CHARS = 32_000;
const MAX_MESSAGE_CHARS = 12_000;
const ALLOWED_ROLES = new Set<ChatMessage["role"]>([
  "system",
  "user",
  "assistant",
]);
const ALLOWED_PART_TYPES = new Set([
  "text",
  "image_url",
  "video_url",
  "input_audio",
  "file",
]);

function json(data: unknown, status = 200, requestId?: string) {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
  });
  if (requestId) headers.set("X-AI-Request-ID", requestId);
  return new Response(JSON.stringify(data), { status, headers });
}

async function recordInvalidRequest(requestId: string, errorCode: string) {
  await recordAiRequest({
    requestId,
    kind: "chat",
    status: "invalid",
    capabilities: ["text"],
    attemptedProviders: [],
    attemptCount: 0,
    inputChars: 0,
    durationMs: 0,
    errorCode,
  });
}

function normalizeContent(content: unknown): string | ChatContentPart[] | null {
  if (typeof content === "string") {
    const value = content.trim();
    return value ? value.slice(0, MAX_MESSAGE_CHARS) : null;
  }
  if (!Array.isArray(content) || content.length === 0) return null;

  const parts: ChatContentPart[] = [];
  for (const rawPart of content) {
    if (!rawPart || typeof rawPart !== "object" || !("type" in rawPart)) {
      return null;
    }
    const type = (rawPart as { type?: unknown }).type;
    if (typeof type !== "string" || !ALLOWED_PART_TYPES.has(type)) return null;

    if (type === "text") {
      const text = (rawPart as { text?: unknown }).text;
      if (typeof text !== "string" || !text.trim()) return null;
      parts.push({ type: "text", text: text.slice(0, MAX_MESSAGE_CHARS) });
      continue;
    }

    if (type === "image_url") {
      const url = (rawPart as { image_url?: { url?: unknown } }).image_url?.url;
      if (typeof url !== "string" || !url.startsWith("data:image/"))
        return null;
      parts.push({ type, image_url: { url } });
      continue;
    }

    if (type === "video_url") {
      const url = (rawPart as { video_url?: { url?: unknown } }).video_url?.url;
      if (typeof url !== "string" || !url.startsWith("data:video/"))
        return null;
      parts.push({ type: "video_url", video_url: { url } });
      continue;
    }

    if (type === "input_audio") {
      const audio = rawPart as {
        input_audio?: { data?: unknown; format?: unknown };
      };
      if (
        typeof audio.input_audio?.data !== "string" ||
        typeof audio.input_audio.format !== "string"
      ) {
        return null;
      }
      parts.push({
        type: "input_audio",
        input_audio: audio.input_audio as { data: string; format: string },
      });
      continue;
    }

    const file = rawPart as {
      file?: { filename?: unknown; file_data?: unknown; file_id?: unknown };
    };
    if (!file.file || typeof file.file !== "object") return null;
    parts.push({
      type: "file",
      file: {
        filename:
          typeof file.file.filename === "string"
            ? file.file.filename
            : undefined,
        file_data:
          typeof file.file.file_data === "string"
            ? file.file.file_data
            : undefined,
        file_id:
          typeof file.file.file_id === "string" ? file.file.file_id : undefined,
      },
    });
  }
  return parts;
}

function normalizeMessages(input: unknown) {
  if (
    !Array.isArray(input) ||
    input.length === 0 ||
    input.length > MAX_MESSAGES
  ) {
    return null;
  }
  const messages: ChatMessage[] = [];
  let totalChars = 0;

  for (const rawMessage of input) {
    if (!rawMessage || typeof rawMessage !== "object") return null;
    const role = (rawMessage as { role?: unknown }).role;
    if (
      typeof role !== "string" ||
      !ALLOWED_ROLES.has(role as ChatMessage["role"])
    ) {
      return null;
    }
    const content = normalizeContent(
      (rawMessage as { content?: unknown }).content,
    );
    if (!content) return null;
    totalChars += JSON.stringify(content).length;
    if (totalChars > MAX_TOTAL_CHARS) return null;
    messages.push({ role: role as ChatMessage["role"], content });
  }
  return messages;
}

function routerErrorResponse(error: SmartRouterError, requestId?: string) {
  if (error.failures.some((failure) => failure.code === "rate_limited")) {
    return json(
      {
        error: "vndo-ai is busy right now. Please wait a moment and try again.",
        code: "rate_limited",
      },
      429,
      requestId,
    );
  }
  if (
    error.failures.some(
      (failure) =>
        failure.code === "missing_configuration" ||
        failure.code === "no_capable_route",
    )
  ) {
    return json(
      {
        error:
          "The chat service is not configured yet. Add the server-side provider keys to the deployment environment.",
        code: "missing_configuration",
      },
      503,
      requestId,
    );
  }
  return json(
    {
      error: "vndo-ai could not complete the chat request. Please try again.",
      code: "upstream_error",
    },
    502,
    requestId,
  );
}

export const POST: APIRoute = async ({ request }) => {
  enableAiAuditPersistence();
  const requestId = createAiRequestId();
  if (!request.headers.get("content-type")?.includes("application/json")) {
    await recordInvalidRequest(requestId, "invalid_content_type");
    return json({ error: "The request body must be JSON." }, 415, requestId);
  }

  let body: { messages?: unknown };
  try {
    body = await request.json();
  } catch {
    await recordInvalidRequest(requestId, "invalid_json");
    return json(
      { error: "The request body is not valid JSON." },
      400,
      requestId,
    );
  }

  const messages = normalizeMessages(body.messages);
  if (!messages) {
    await recordInvalidRequest(requestId, "invalid_messages");
    return json(
      {
        error: "Please provide a valid conversation with up to 24 messages.",
        code: "invalid_messages",
      },
      400,
      requestId,
    );
  }

  try {
    const result = await smartComplete({
      requestId,
      kind: "chat",
      messages,
      requiredCapabilities: inferCapabilities(messages),
      inputChars: measureMessageChars(messages),
      temperature: 0.4,
      maxTokens: 1200,
    });
    return json(
      {
        success: true,
        message: { role: "assistant", content: result.content },
      },
      200,
      requestId,
    );
  } catch (error) {
    if (error instanceof SmartRouterError)
      return routerErrorResponse(error, requestId);
    console.error("Chat request failed", error);
    await recordAiRequest({
      requestId,
      kind: "chat",
      status: "failed",
      capabilities: inferCapabilities(messages),
      attemptedProviders: [],
      attemptCount: 0,
      inputChars: measureMessageChars(messages),
      durationMs: 0,
      errorCode: "network_error",
    });
    return json(
      {
        error: "Could not reach vndo-ai. Please try again.",
        code: "network_error",
      },
      502,
      requestId,
    );
  }
};
