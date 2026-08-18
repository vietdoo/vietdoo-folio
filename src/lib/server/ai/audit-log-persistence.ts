import { AiRequestLog, db } from "astro:db";
import { setAiAuditWriter } from "./audit-log";
import type { AiRequestAudit } from "./audit-log";

let enabled = false;

export function enableAiAuditPersistence() {
  if (enabled) return;
  enabled = true;
  setAiAuditWriter(async (event: AiRequestAudit) => {
    await db.insert(AiRequestLog).values({
      requestId: event.requestId,
      kind: event.kind,
      status: event.status,
      capabilities: JSON.stringify(event.capabilities),
      attemptedProviders: JSON.stringify(event.attemptedProviders),
      attemptCount: event.attemptCount,
      usedFallback: event.usedFallback ? 1 : 0,
      inputChars: Math.max(0, Math.round(event.inputChars)),
      durationMs: Math.max(0, Math.round(event.durationMs)),
      provider: event.provider,
      modelLabel: event.modelLabel,
      errorCode: event.errorCode,
      errorStatus: event.errorStatus,
      createdAt: new Date(),
    });
  });
}
