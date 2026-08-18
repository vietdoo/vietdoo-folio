import { AiRequestLog, count, db, desc } from "astro:db";
import {
  createAiRequestId,
  measureMessageChars,
} from "../ai/audit-log";
import { smartComplete } from "../ai/smart-router";
import { listModelConfigurations } from "../ai/model-config";
import type { ChatMessage } from "../ai/types";

export const ADMIN_SUMMARY_TTL_SECONDS = 5 * 60;
const ADMIN_SUMMARY_TTL_MS = ADMIN_SUMMARY_TTL_SECONDS * 1000;
const SUMMARY_WINDOW_SIZE = 50;
const MAX_BULLETS = 3;

export type AdminSummaryTone = "positive" | "neutral" | "attention";

export type AdminSummary = {
  headline: string;
  bullets: string[];
  tone: AdminSummaryTone;
  generatedAt: string;
  expiresAt: string;
  cached: boolean;
  degraded: boolean;
  sourceWindow: number;
  cacheTtlSeconds: number;
};

type SummarySnapshot = {
  totalRequests: number;
  windowRequests: number;
  successful: number;
  failed: number;
  fallbackEvents: number;
  averageLatencyMs: number;
  enabledRoutes: number;
  configuredRoutes: number;
  latestRequestAt: string | null;
  recentFailures: Array<{
    kind: string;
    errorCode: string | null;
    usedFallback: boolean;
  }>;
};

type CachedSummary = {
  key: string;
  value: AdminSummary;
  expiresAt: number;
};

let cachedSummary: CachedSummary | undefined;

function toIso(value: unknown) {
  return value instanceof Date ? value.toISOString() : new Date(String(value)).toISOString();
}

function buildSnapshot(
  rows: Array<{
    kind: string;
    status: string;
    usedFallback: number;
    durationMs: number;
    errorCode: string | null;
    createdAt: Date;
  }>,
  total: number,
  models: Array<{ enabled: boolean; credentialConfigured: boolean }>,
): SummarySnapshot {
  const successful = rows.filter((row) => row.status === "success").length;
  const failed = rows.filter((row) => row.status === "failed").length;
  const fallbackEvents = rows.filter((row) => row.usedFallback === 1).length;
  const averageLatencyMs = rows.length
    ? Math.round(
        rows.reduce((sum, row) => sum + row.durationMs, 0) / rows.length,
      )
    : 0;

  return {
    totalRequests: total,
    windowRequests: rows.length,
    successful,
    failed,
    fallbackEvents,
    averageLatencyMs,
    enabledRoutes: models.filter((model) => model.enabled).length,
    configuredRoutes: models.filter((model) => model.credentialConfigured).length,
    latestRequestAt: rows[0] ? toIso(rows[0].createdAt) : null,
    recentFailures: rows
      .filter((row) => row.status !== "success")
      .slice(0, 3)
      .map((row) => ({
        kind: row.kind,
        errorCode: row.errorCode,
        usedFallback: row.usedFallback === 1,
      })),
  };
}

function snapshotKey(snapshot: SummarySnapshot) {
  return JSON.stringify(snapshot);
}

function fallbackContent(snapshot: SummarySnapshot) {
  if (snapshot.totalRequests === 0) {
    return {
      headline: "No AI request activity yet.",
      bullets: [
        "The control room is ready to observe your first request.",
        `${snapshot.enabledRoutes} route${snapshot.enabledRoutes === 1 ? " is" : "s are"} enabled for smart routing.`,
        "Metrics will become more useful as traffic arrives.",
      ],
      tone: "neutral" as const,
    };
  }

  const successRate = Math.round(
    (snapshot.successful / Math.max(snapshot.windowRequests, 1)) * 100,
  );
  const tone: AdminSummaryTone =
    snapshot.failed > 0 ? "attention" : snapshot.fallbackEvents > 0 ? "neutral" : "positive";

  return {
    headline:
      snapshot.failed > 0
        ? "A few requests need attention."
        : "Routing is operating steadily.",
    bullets: [
      `${successRate}% of the latest ${snapshot.windowRequests} recorded requests succeeded.`,
      `${snapshot.fallbackEvents} request${snapshot.fallbackEvents === 1 ? " used" : "s used"} provider failover in this window.`,
      `${snapshot.averageLatencyMs} ms average latency across the latest request window.`,
    ],
    tone,
  };
}

function normalizeTone(value: unknown): AdminSummaryTone {
  return value === "positive" || value === "attention" ? value : "neutral";
}

function parseModelContent(content: string) {
  const candidates = [
    content.trim(),
    content
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim(),
  ];

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as {
        headline?: unknown;
        bullets?: unknown;
        tone?: unknown;
      };
      if (
        typeof parsed.headline !== "string" ||
        !Array.isArray(parsed.bullets) ||
        parsed.bullets.some((bullet) => typeof bullet !== "string")
      ) {
        continue;
      }
      const headline = parsed.headline.trim().slice(0, 180);
      const bullets = parsed.bullets
        .map((bullet) => bullet.trim().slice(0, 220))
        .filter(Boolean)
        .slice(0, MAX_BULLETS);
      if (!headline || bullets.length === 0) continue;
      return {
        headline,
        bullets,
        tone: normalizeTone(parsed.tone),
      };
    } catch {
      // Try the next representation, then use the deterministic fallback.
    }
  }
  return null;
}

function buildPrompt(snapshot: SummarySnapshot): ChatMessage[] {
  return [
    {
      role: "system",
      content:
        "You write a concise internal operations summary for an admin dashboard. Return JSON only with exactly three keys: headline (string), bullets (array of 2-3 short strings), tone (one of positive, neutral, attention). Do not mention provider names, model names, API keys, prompts, credentials, or invent facts. Use only the supplied aggregate snapshot. Keep the tone calm and professional.",
    },
    {
      role: "user",
      content: JSON.stringify(snapshot),
    },
  ];
}

export async function generateAdminSummary(): Promise<AdminSummary> {
  const [rows, totalResult, models] = await Promise.all([
    db
      .select({
        kind: AiRequestLog.kind,
        status: AiRequestLog.status,
        usedFallback: AiRequestLog.usedFallback,
        durationMs: AiRequestLog.durationMs,
        errorCode: AiRequestLog.errorCode,
        createdAt: AiRequestLog.createdAt,
      })
      .from(AiRequestLog)
      .orderBy(desc(AiRequestLog.createdAt))
      .limit(SUMMARY_WINDOW_SIZE),
    db.select({ total: count() }).from(AiRequestLog),
    listModelConfigurations(),
  ]);

  const snapshot = buildSnapshot(
    rows,
    totalResult[0]?.total ?? 0,
    models,
  );
  const key = snapshotKey(snapshot);
  const now = Date.now();
  if (cachedSummary && cachedSummary.key === key && cachedSummary.expiresAt > now) {
    return { ...cachedSummary.value, cached: true };
  }

  const generatedAt = new Date(now).toISOString();
  const expiresAt = new Date(now + ADMIN_SUMMARY_TTL_MS).toISOString();
  let content = fallbackContent(snapshot);
  let degraded = true;

  if (snapshot.totalRequests > 0) {
    const messages = buildPrompt(snapshot);
    try {
      const result = await smartComplete({
        requestId: createAiRequestId(),
        kind: "admin-summary",
        messages,
        requiredCapabilities: ["text"],
        inputChars: measureMessageChars(messages),
        temperature: 0.2,
        maxTokens: 280,
      });
      const parsedContent = parseModelContent(result.content);
      if (parsedContent) {
        content = parsedContent;
        degraded = false;
      }
    } catch (error) {
      console.warn("[admin] AI summary unavailable; using deterministic fallback.", error);
    }
  }

  const value: AdminSummary = {
    ...content,
    generatedAt,
    expiresAt,
    cached: false,
    degraded,
    sourceWindow: snapshot.windowRequests,
    cacheTtlSeconds: ADMIN_SUMMARY_TTL_SECONDS,
  };
  cachedSummary = { key, value, expiresAt: now + ADMIN_SUMMARY_TTL_MS };
  return value;
}

export function resetAdminSummaryCache() {
  cachedSummary = undefined;
}

export function createUnavailableAdminSummary(): AdminSummary {
  const now = Date.now();
  const content = fallbackContent({
    totalRequests: 0,
    windowRequests: 0,
    successful: 0,
    failed: 0,
    fallbackEvents: 0,
    averageLatencyMs: 0,
    enabledRoutes: 0,
    configuredRoutes: 0,
    latestRequestAt: null,
    recentFailures: [],
  });

  return {
    ...content,
    generatedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + ADMIN_SUMMARY_TTL_MS).toISOString(),
    cached: false,
    degraded: true,
    sourceWindow: 0,
    cacheTtlSeconds: ADMIN_SUMMARY_TTL_SECONDS,
  };
}

export function parseAdminSummaryCacheControl() {
  return `private, max-age=${ADMIN_SUMMARY_TTL_SECONDS}, stale-while-revalidate=60`;
}
