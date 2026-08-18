import { isModelEnabled, MODEL_ROUTES } from "./model-catalog";
import {
  createAiRequestId,
  getFailureSummary,
  recordAiRequest,
} from "./audit-log";
import { completeWithProvider, ProviderRequestError } from "./providers";
import type {
  AiCapability,
  ChatContentPart,
  ChatMessage,
  ModelRoute,
  ProviderFailure,
  ProviderName,
  SmartCompletionRequest,
  SmartCompletionResult,
} from "./types";

const MAX_ATTEMPTS = 3;
const CIRCUIT_FAILURE_THRESHOLD = 2;
const CIRCUIT_COOLDOWN_MS = 60_000;

type CircuitState = {
  failures: number;
  openedUntil: number;
};

const circuitStates = new Map<string, CircuitState>();

export class SmartRouterError extends Error {
  readonly failures: ProviderFailure[];

  constructor(failures: ProviderFailure[]) {
    super("All configured AI routes failed.");
    this.name = "SmartRouterError";
    this.failures = failures;
  }
}

function routeKey(route: ModelRoute) {
  return `${route.provider}:${route.id}`;
}

function isCircuitOpen(route: ModelRoute) {
  const state = circuitStates.get(routeKey(route));
  if (!state) return false;
  if (state.openedUntil <= Date.now()) {
    circuitStates.delete(routeKey(route));
    return false;
  }
  return true;
}

function recordSuccess(route: ModelRoute) {
  circuitStates.delete(routeKey(route));
}

function recordFailure(route: ModelRoute, failure: ProviderFailure) {
  if (!failure.retryable) return;
  const key = routeKey(route);
  const current = circuitStates.get(key) || { failures: 0, openedUntil: 0 };
  const failures = current.failures + 1;
  circuitStates.set(key, {
    failures,
    openedUntil:
      failures >= CIRCUIT_FAILURE_THRESHOLD
        ? Date.now() + CIRCUIT_COOLDOWN_MS
        : 0,
  });
}

function supportsAll(route: ModelRoute, required: readonly AiCapability[]) {
  return required.every((capability) =>
    route.capabilities.includes(capability),
  );
}

function eligibleRoutes(required: readonly AiCapability[]) {
  return MODEL_ROUTES.filter(
    (route) => isModelEnabled(route) && supportsAll(route, required),
  ).sort((a, b) => b.priority - a.priority);
}

function contentCapabilities(content: ChatMessage["content"]): AiCapability[] {
  if (typeof content === "string") return ["text"];
  const capabilities = new Set<AiCapability>(["text"]);
  for (const part of content as ChatContentPart[]) {
    if (part.type === "image_url") capabilities.add("image");
    if (part.type === "video_url") capabilities.add("video");
    if (part.type === "input_audio") capabilities.add("audio");
    if (part.type === "file") capabilities.add("file");
  }
  return [...capabilities];
}

export function inferCapabilities(messages: ChatMessage[]) {
  const capabilities = new Set<AiCapability>(["text"]);
  for (const message of messages) {
    for (const capability of contentCapabilities(message.content)) {
      capabilities.add(capability);
    }
  }
  return [...capabilities];
}

export async function smartComplete(
  request: SmartCompletionRequest,
): Promise<SmartCompletionResult> {
  const startedAt = Date.now();
  const requestId = request.requestId || createAiRequestId();
  const routes = eligibleRoutes(request.requiredCapabilities);
  const failures: ProviderFailure[] = [];
  const attemptedProviders: ProviderName[] = [];

  if (routes.length === 0) {
    await recordAiRequest({
      requestId,
      kind: request.kind,
      status: "failed",
      capabilities: request.requiredCapabilities,
      attemptedProviders: [],
      attemptCount: 0,
      inputChars: request.inputChars ?? 0,
      durationMs: Date.now() - startedAt,
      errorCode: "no_capable_route",
    });
    throw new SmartRouterError([
      {
        provider: "orcarouter",
        code: "no_capable_route",
        message: "No configured route supports the requested capabilities.",
        retryable: false,
      },
    ]);
  }

  let attempts = 0;
  for (const route of routes) {
    if (attempts >= MAX_ATTEMPTS) break;
    if (isCircuitOpen(route)) continue;
    attempts += 1;
    attemptedProviders.push(route.provider);

    try {
      const response = await completeWithProvider(route.provider, {
        model: route.id,
        messages: request.messages,
        temperature: request.temperature,
        maxTokens: request.maxTokens,
        signal: request.signal,
      });
      recordSuccess(route);
      await recordAiRequest({
        requestId,
        kind: request.kind,
        status: "success",
        capabilities: request.requiredCapabilities,
        attemptedProviders,
        attemptCount: attempts,
        usedFallback: attempts > 1,
        inputChars: request.inputChars ?? 0,
        durationMs: Date.now() - startedAt,
        provider: response.provider,
        modelLabel: route.label,
      });
      return {
        content: response.content,
        publicLabel: "vndo-ai",
        provider: response.provider,
        modelLabel: route.label,
        usedFallback: attempts > 1,
        attemptedProviders,
      };
    } catch (error) {
      const failure =
        error instanceof ProviderRequestError
          ? error.failure
          : ({
              provider: route.provider,
              code: "unknown_error",
              message: "The AI route failed.",
              retryable: true,
            } satisfies ProviderFailure);
      failures.push(failure);
      recordFailure(route, failure);
    }
  }

  const failureSummary = getFailureSummary(failures);
  await recordAiRequest({
    requestId,
    kind: request.kind,
    status: "failed",
    capabilities: request.requiredCapabilities,
    attemptCount: attempts,
    usedFallback: attempts > 1,
    inputChars: request.inputChars ?? 0,
    durationMs: Date.now() - startedAt,
    ...failureSummary,
  });
  throw new SmartRouterError(failures);
}

export function resetRouterHealth() {
  circuitStates.clear();
}
