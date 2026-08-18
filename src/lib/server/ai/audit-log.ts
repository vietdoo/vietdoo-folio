import type {
  AiCapability,
  ChatMessage,
  ProviderFailure,
  ProviderName,
} from "./types";

export type AiRequestKind = "chat" | "image-description";
export type AiRequestStatus = "success" | "failed" | "invalid";

export type AiRequestAudit = {
  requestId: string;
  kind: AiRequestKind;
  status: AiRequestStatus;
  capabilities: readonly AiCapability[];
  attemptedProviders: readonly ProviderName[];
  attemptCount: number;
  usedFallback?: boolean;
  inputChars: number;
  durationMs: number;
  provider?: ProviderName;
  modelLabel?: string;
  errorCode?: string;
  errorStatus?: number;
};

type AiAuditWriter = (event: AiRequestAudit) => Promise<void>;
let auditWriter: AiAuditWriter | undefined;

export function setAiAuditWriter(writer?: AiAuditWriter) {
  auditWriter = writer;
}

export function createAiRequestId() {
  return crypto.randomUUID();
}

export function measureMessageChars(messages: readonly ChatMessage[]) {
  return messages.reduce((total, message) => {
    if (typeof message.content === "string")
      return total + message.content.length;
    return (
      total +
      message.content.reduce((partTotal, part) => {
        if (part.type === "text") return partTotal + part.text.length;
        return partTotal + 1;
      }, 0)
    );
  }, 0);
}

export async function recordAiRequest(event: AiRequestAudit) {
  if (!auditWriter) return;
  try {
    await auditWriter(event);
  } catch (error) {
    console.error("AI audit log persistence failed", error);
  }
}

export function getFailureSummary(failures: readonly ProviderFailure[]) {
  const lastFailure = failures.at(-1);
  return {
    attemptedProviders: failures.map((failure) => failure.provider),
    errorCode: lastFailure?.code || "unknown_error",
    errorStatus: lastFailure?.status,
  };
}
