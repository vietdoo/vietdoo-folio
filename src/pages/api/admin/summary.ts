import type { APIRoute } from "astro";
import {
  hasAdminSession,
  unauthorizedResponse,
} from "../../../lib/server/admin-auth";
import { enableAiAuditPersistence } from "../../../lib/server/ai/audit-log-persistence";
import { refreshModelOverrides } from "../../../lib/server/ai/model-config";
import {
  generateAdminSummary,
  parseAdminSummaryCacheControl,
} from "../../../lib/server/admin/ai-summary";

export const GET: APIRoute = async ({ request }) => {
  if (!hasAdminSession(request)) return unauthorizedResponse();

  enableAiAuditPersistence();
  await refreshModelOverrides();

  try {
    const summary = await generateAdminSummary();
    return new Response(JSON.stringify({ summary }), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": parseAdminSummaryCacheControl(),
        "X-Admin-Summary-Cache": summary.cached ? "HIT" : "MISS",
      },
    });
  } catch (error) {
    console.error("[admin] Could not generate AI summary.", error);
    return new Response(
      JSON.stringify({ error: "Could not generate the admin summary." }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "private, no-store",
        },
      },
    );
  }
};
