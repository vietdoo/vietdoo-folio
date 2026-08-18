import type { APIRoute } from "astro";
import {
  hasAdminSession,
  unauthorizedResponse,
} from "../../../lib/server/admin-auth";
import {
  listModelConfigurations,
  setModelConfiguration,
} from "../../../lib/server/ai/model-config";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "private, no-store",
    },
  });
}

export const GET: APIRoute = async ({ request }) => {
  if (!hasAdminSession(request)) return unauthorizedResponse();
  try {
    return json({ models: await listModelConfigurations() });
  } catch (error) {
    console.error("[admin] Could not load model configuration.", error);
    return json({ error: "Could not load model configuration." }, 500);
  }
};

export const PATCH: APIRoute = async ({ request }) => {
  if (!hasAdminSession(request)) return unauthorizedResponse();

  let body: { modelId?: unknown; enabled?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  if (typeof body.modelId !== "string" || typeof body.enabled !== "boolean") {
    return json({ error: "modelId and enabled are required." }, 400);
  }

  try {
    const model = await setModelConfiguration(body.modelId, body.enabled);
    if (!model) return json({ error: "Unknown model." }, 404);
    return json({ model });
  } catch (error) {
    console.error("[admin] Could not update model configuration.", error);
    return json({ error: "Could not persist model configuration." }, 500);
  }
};
