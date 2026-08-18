import type { APIRoute } from "astro";
import {
  SmartRouterError,
  smartComplete,
} from "../../lib/server/ai/smart-router";
import {
  createAiRequestId,
  recordAiRequest,
} from "../../lib/server/ai/audit-log";
import { enableAiAuditPersistence } from "../../lib/server/ai/audit-log-persistence";
import { refreshModelOverrides } from "../../lib/server/ai/model-config";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);
const DEFAULT_PROMPT =
  "Describe this image clearly for a human reader. Mention the main subject, setting, actions, notable visual details, any text that is visible, and meaningful uncertainty. Respond in the same language as this instruction.";

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
    kind: "image-description",
    status: "invalid",
    capabilities: ["text", "image"],
    attemptedProviders: [],
    attemptCount: 0,
    inputChars: 0,
    durationMs: 0,
    errorCode,
  });
}

function getImageSizeBytes(base64: string) {
  const normalized = base64.replace(/\s/g, "");
  const padding = normalized.endsWith("==")
    ? 2
    : normalized.endsWith("=")
      ? 1
      : 0;
  return Math.floor((normalized.length * 3) / 4) - padding;
}

function routerErrorResponse(error: SmartRouterError, requestId?: string) {
  if (error.failures.some((failure) => failure.code === "rate_limited")) {
    return json(
      {
        error:
          "vndo-ai is rate-limited right now. Please wait a moment and try again.",
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
          "Image description is not configured yet. Add the server-side provider keys to the deployment environment.",
        code: "missing_configuration",
      },
      503,
      requestId,
    );
  }
  return json(
    {
      error: "vndo-ai could not complete the request. Please try again.",
      code: "upstream_error",
    },
    502,
    requestId,
  );
}

export const POST: APIRoute = async ({ request }) => {
  enableAiAuditPersistence();
  await refreshModelOverrides();
  const requestId = createAiRequestId();
  if (!request.headers.get("content-type")?.includes("application/json")) {
    await recordInvalidRequest(requestId, "invalid_content_type");
    return json({ error: "The request body must be JSON." }, 415, requestId);
  }

  let body: { image?: unknown; prompt?: unknown };
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

  if (typeof body.image !== "string") {
    await recordInvalidRequest(requestId, "missing_image");
    return json({ error: "Please provide an image." }, 400, requestId);
  }

  const match = body.image.match(
    /^data:(image\/[^;]+);base64,([A-Za-z0-9+/=\s]+)$/,
  );
  if (!match || !ALLOWED_IMAGE_TYPES.has(match[1])) {
    await recordInvalidRequest(requestId, "invalid_image_format");
    return json(
      { error: "Please upload a PNG, JPEG, WebP, or GIF image." },
      400,
      requestId,
    );
  }

  if (getImageSizeBytes(match[2]) > MAX_IMAGE_BYTES) {
    await recordInvalidRequest(requestId, "image_too_large");
    return json({ error: "Images must be 8 MB or smaller." }, 413, requestId);
  }

  const customPrompt =
    typeof body.prompt === "string" ? body.prompt.trim().slice(0, 1000) : "";
  const prompt = customPrompt || DEFAULT_PROMPT;

  try {
    const result = await smartComplete({
      requestId,
      kind: "image-description",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: body.image } },
          ],
        },
      ],
      requiredCapabilities: ["text", "image"],
      inputChars: prompt.length + 1,
      temperature: 0.2,
      maxTokens: 1000,
    });

    return json(
      {
        success: true,
        description: result.content,
      },
      200,
      requestId,
    );
  } catch (error) {
    if (error instanceof SmartRouterError) {
      return routerErrorResponse(error, requestId);
    }
    console.error("Image description request failed", error);
    await recordAiRequest({
      requestId,
      kind: "image-description",
      status: "failed",
      capabilities: ["text", "image"],
      attemptedProviders: [],
      attemptCount: 0,
      inputChars: prompt.length + 1,
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
