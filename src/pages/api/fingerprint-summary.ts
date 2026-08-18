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

const KIND = "fingerprint-summary" as const;
const CAPABILITIES = ["text"] as const;

const ALLOWED_RISKS = new Set(["low", "medium", "high", "local"]);
const ALLOWED_IDS = new Set([
  "ua",
  "ua-brands",
  "platform",
  "high-entropy",
  "locale",
  "timezone",
  "display",
  "hardware",
  "webgl",
  "canvas",
  "network",
  "privacy",
  "capabilities",
  "permissions",
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
    kind: KIND,
    status: "invalid",
    capabilities: CAPABILITIES,
    attemptedProviders: [],
    attemptCount: 0,
    inputChars: 0,
    durationMs: 0,
    errorCode,
  });
}

function routerErrorResponse(error: SmartRouterError, requestId: string) {
  if (error.failures.some((failure) => failure.code === "rate_limited")) {
    return json(
      {
        error: "The AI summary service is rate-limited right now.",
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
        error: "AI summary is not configured yet.",
        code: "missing_configuration",
      },
      503,
      requestId,
    );
  }

  return json(
    {
      error: "The AI summary service is temporarily unavailable.",
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

  let body: { score?: unknown; uniqueSignals?: unknown; categories?: unknown };
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

  const score =
    typeof body.score === "number"
      ? Math.max(0, Math.min(100, Math.round(body.score)))
      : null;
  const uniqueSignals =
    typeof body.uniqueSignals === "number"
      ? Math.max(0, Math.min(30, Math.round(body.uniqueSignals)))
      : null;
  const categories = Array.isArray(body.categories)
    ? body.categories
        .filter(
          (
            category,
          ): category is { id: string; risk: string; localOnly?: boolean } => {
            return Boolean(
              category &&
              typeof category === "object" &&
              typeof (category as { id?: unknown }).id === "string" &&
              typeof (category as { risk?: unknown }).risk === "string",
            );
          },
        )
        .filter(
          (category) =>
            ALLOWED_IDS.has(category.id) && ALLOWED_RISKS.has(category.risk),
        )
        .map((category) => ({
          id: category.id,
          risk: category.risk,
          localOnly: Boolean(category.localOnly),
        }))
        .slice(0, 20)
    : [];

  if (score === null || uniqueSignals === null || categories.length === 0) {
    await recordInvalidRequest(requestId, "invalid_coarse_summary");
    return json(
      { error: "Please provide a coarse fingerprint summary." },
      400,
      requestId,
    );
  }

  const prompt = `You are a privacy educator writing a concise Vietnamese summary for a browser fingerprint self-audit. Do not identify the person, infer exact location, name, IP address, hardware serial, or behavior. Do not mention raw values because none were provided. Explain what the coarse categories suggest about uniqueness, emphasize uncertainty, and give 2 practical privacy mitigations. Use a calm, human tone in 2 short paragraphs. Never recommend covert tracking.

Exposure score: ${score}/100. Distinctive signal count: ${uniqueSignals}. Categories: ${JSON.stringify(categories)}.`;

  try {
    const result = await smartComplete({
      requestId,
      kind: KIND,
      messages: [{ role: "user", content: prompt }],
      requiredCapabilities: CAPABILITIES,
      inputChars: prompt.length,
      temperature: 0.3,
      maxTokens: 500,
    });

    return json(
      {
        success: true,
        summary: result.content,
        model: result.modelLabel,
      },
      200,
      requestId,
    );
  } catch (error) {
    if (error instanceof SmartRouterError) {
      return routerErrorResponse(error, requestId);
    }

    console.error("Fingerprint summary request failed", error);
    await recordAiRequest({
      requestId,
      kind: KIND,
      status: "failed",
      capabilities: CAPABILITIES,
      attemptedProviders: [],
      attemptCount: 0,
      inputChars: prompt.length,
      durationMs: 0,
      errorCode: "network_error",
    });
    return json(
      {
        error: "Could not reach the AI summary service.",
        code: "network_error",
      },
      502,
      requestId,
    );
  }
};
