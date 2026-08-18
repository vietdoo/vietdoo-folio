import type { APIRoute } from "astro";

const MODEL = "qwen/qwen3.8-27b-free";
const ORCAROUTER_URL = "https://api.orcarouter.ai/v1/chat/completions";
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);
const DEFAULT_PROMPT =
  "Describe this image clearly for a human reader. Mention the main subject, setting, actions, notable visual details, any text that is visible, and meaningful uncertainty. Respond in the same language as this instruction.";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
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

export const POST: APIRoute = async ({ request }) => {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ error: "The request body must be JSON." }, 415);
  }

  let body: { image?: unknown; prompt?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "The request body is not valid JSON." }, 400);
  }

  if (typeof body.image !== "string") {
    return json({ error: "Please provide an image." }, 400);
  }

  const match = body.image.match(
    /^data:(image\/[^;]+);base64,([A-Za-z0-9+/=\s]+)$/,
  );
  if (!match || !ALLOWED_IMAGE_TYPES.has(match[1])) {
    return json(
      { error: "Please upload a PNG, JPEG, WebP, or GIF image." },
      400,
    );
  }

  if (getImageSizeBytes(match[2]) > MAX_IMAGE_BYTES) {
    return json({ error: "Images must be 8 MB or smaller." }, 413);
  }

  const apiKey =
    import.meta.env.ORCAROUTER_API_KEY || process.env.ORCAROUTER_API_KEY;
  if (!apiKey) {
    return json(
      {
        error:
          "Image description is not configured yet. Add ORCAROUTER_API_KEY to the deployment environment.",
        code: "missing_configuration",
      },
      503,
    );
  }

  const customPrompt =
    typeof body.prompt === "string" ? body.prompt.trim().slice(0, 1000) : "";
  const prompt = customPrompt || DEFAULT_PROMPT;

  try {
    const upstream = await fetch(ORCAROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: body.image } },
            ],
          },
        ],
        temperature: 0.2,
        max_tokens: 1000,
        chat_template_kwargs: { enable_thinking: false },
      }),
    });

    const payload = await upstream.json().catch(() => null);
    if (!upstream.ok) {
      const upstreamMessage =
        payload?.error?.message ||
        payload?.message ||
        `OrcaRouter returned HTTP ${upstream.status}.`;
      return json(
        {
          error:
            upstream.status === 429
              ? "The free model is rate-limited right now. Please wait a moment and try again."
              : upstreamMessage,
          code: upstream.status === 429 ? "rate_limited" : "upstream_error",
        },
        upstream.status === 429 ? 429 : 502,
      );
    }

    const description = payload?.choices?.[0]?.message?.content;
    if (typeof description !== "string" || !description.trim()) {
      return json(
        {
          error: "The model returned an empty description.",
          code: "empty_response",
        },
        502,
      );
    }

    return json({
      success: true,
      description: description.trim(),
      model: MODEL,
    });
  } catch (error) {
    console.error("Image description request failed", error);
    return json(
      {
        error:
          "Could not reach the image description service. Please try again.",
        code: "network_error",
      },
      502,
    );
  }
};
