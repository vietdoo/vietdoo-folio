import type { APIRoute } from "astro";

const MODEL = "qwen/qwen3.8-27b-free";
const ORCAROUTER_URL = "https://api.orcarouter.ai/v1/chat/completions";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

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

export const POST: APIRoute = async ({ request }) => {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ error: "The request body must be JSON." }, 415);
  }

  let body: { score?: unknown; uniqueSignals?: unknown; categories?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "The request body is not valid JSON." }, 400);
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
    return json({ error: "Please provide a coarse fingerprint summary." }, 400);
  }

  const apiKey =
    import.meta.env.ORCAROUTER_API_KEY || process.env.ORCAROUTER_API_KEY;
  if (!apiKey) {
    return json(
      { error: "AI summary is not configured.", code: "missing_configuration" },
      503,
    );
  }

  const prompt = `You are a privacy educator writing a concise Vietnamese summary for a browser fingerprint self-audit. Do not identify the person, infer exact location, name, IP address, hardware serial, or behavior. Do not mention raw values because none were provided. Explain what the coarse categories suggest about uniqueness, emphasize uncertainty, and give 2 practical privacy mitigations. Use a calm, human tone in 2 short paragraphs. Never recommend covert tracking.\n\nExposure score: ${score}/100. Distinctive signal count: ${uniqueSignals}. Categories: ${JSON.stringify(categories)}.`;

  try {
    const upstream = await fetch(ORCAROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 500,
        chat_template_kwargs: { enable_thinking: false },
      }),
    });
    const payload = await upstream.json().catch(() => null);
    if (!upstream.ok) {
      return json(
        {
          error:
            upstream.status === 429
              ? "The free model is rate-limited right now."
              : "AI summary service is unavailable.",
          code: upstream.status === 429 ? "rate_limited" : "upstream_error",
        },
        upstream.status === 429 ? 429 : 502,
      );
    }
    const summary = payload?.choices?.[0]?.message?.content;
    if (typeof summary !== "string" || !summary.trim()) {
      return json(
        {
          error: "The model returned an empty summary.",
          code: "empty_response",
        },
        502,
      );
    }
    return json({ success: true, summary: summary.trim(), model: MODEL });
  } catch (error) {
    console.error("Fingerprint summary request failed", error);
    return json(
      {
        error: "Could not reach the AI summary service.",
        code: "network_error",
      },
      502,
    );
  }
};
