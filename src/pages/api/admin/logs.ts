import type { APIRoute } from "astro";
import { AiRequestLog, count, db, desc } from "astro:db";
import {
  hasAdminSession,
  unauthorizedResponse,
} from "../../../lib/server/admin-auth";

function parseJsonArray(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function isMissingAuditTable(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /(?:no such table|does not exist|not found)/i.test(message) &&
    /AiRequestLog|ai_request_log/i.test(message);
}

export const GET: APIRoute = async ({ request, url }) => {
  if (!hasAdminSession(request)) return unauthorizedResponse();

  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1") || 1);
  const requestedLimit = Number(url.searchParams.get("limit") ?? "25") || 25;
  const limit = Math.min(100, Math.max(10, requestedLimit));
  const offset = (page - 1) * limit;

  try {
    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(AiRequestLog)
        .orderBy(desc(AiRequestLog.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ total: count() }).from(AiRequestLog),
    ]);

    const logs = rows.map((row) => ({
      id: row.id,
      requestId: row.requestId,
      kind: row.kind,
      status: row.status,
      capabilities: parseJsonArray(row.capabilities),
      attemptedProviders: parseJsonArray(row.attemptedProviders),
      attemptCount: row.attemptCount,
      usedFallback: row.usedFallback === 1,
      inputChars: row.inputChars,
      durationMs: row.durationMs,
      provider: row.provider ?? null,
      modelLabel: row.modelLabel ?? null,
      errorCode: row.errorCode ?? null,
      errorStatus: row.errorStatus ?? null,
      createdAt: row.createdAt,
    }));

    return new Response(
      JSON.stringify({
        logs,
        page,
        limit,
        total: totalResult[0]?.total ?? 0,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "private, no-store",
        },
      },
    );
  } catch (error) {
    if (isMissingAuditTable(error)) {
      console.warn("[admin] AiRequestLog table is not available yet.");
      return new Response(
        JSON.stringify({
          logs: [],
          page,
          limit,
          total: 0,
          storageReady: false,
          warning:
            "AI request logs are not ready yet. Run pnpm db:push against the production Astro DB, then redeploy.",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "private, no-store",
            "X-AI-Logs-Storage": "unavailable",
          },
        },
      );
    }

    console.error("[admin] Could not load AI request logs.", error);
    return new Response(
      JSON.stringify({ error: "Could not load AI request logs." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  }
};
