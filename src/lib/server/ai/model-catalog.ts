import type { AiCapability, ModelRoute } from "./types";

const ORCAROUTER_TEXT_MODEL = "qwen/qwen3.8-27b-free";
const OPENROUTER_TEXT_MODEL = "openrouter/free";
const OPENROUTER_VISION_MODEL = "google/gemini-3.7-flash";

const runtimeOverrides = new Map<string, boolean>();

function env(name: string) {
  return import.meta.env[name] || process.env[name];
}

function hasKey(name: string) {
  return Boolean(env(name));
}

const ORCAROUTER_CAPABILITIES: readonly AiCapability[] = [
  "text",
  "image",
  "video",
];
const OPENROUTER_TEXT_CAPABILITIES: readonly AiCapability[] = ["text"];
const OPENROUTER_VISION_CAPABILITIES: readonly AiCapability[] = [
  "text",
  "image",
  "video",
  "file",
  "audio",
];

export const MODEL_ROUTES: readonly ModelRoute[] = [
  {
    id: ORCAROUTER_TEXT_MODEL,
    label: "vndo-ai multimodal",
    provider: "orcarouter",
    capabilities: ORCAROUTER_CAPABILITIES,
    priority: 100,
    enabled: () => hasKey("ORCAROUTER_API_KEY"),
  },
  {
    id: OPENROUTER_VISION_MODEL,
    label: "vndo-ai vision",
    provider: "openrouter",
    capabilities: OPENROUTER_VISION_CAPABILITIES,
    priority: 95,
    enabled: () => hasKey("OPENROUTER_API_KEY"),
  },
  {
    id: OPENROUTER_TEXT_MODEL,
    label: "vndo-ai text",
    provider: "openrouter",
    capabilities: OPENROUTER_TEXT_CAPABILITIES,
    priority: 90,
    enabled: () => hasKey("OPENROUTER_API_KEY"),
  },
];

export function setModelOverride(modelId: string, enabled: boolean) {
  runtimeOverrides.set(modelId, enabled);
}

export function isModelEnabled(route: ModelRoute) {
  return runtimeOverrides.get(route.id) ?? route.enabled();
}

export function getPublicModelCatalog() {
  return MODEL_ROUTES.map((route) => ({
    id: route.id,
    label: route.label,
    provider: route.provider,
    capabilities: route.capabilities,
    priority: route.priority,
    credentialConfigured: route.enabled(),
    enabled: isModelEnabled(route),
  }));
}

export function getEnvKey(provider: ModelRoute["provider"]) {
  return env(
    provider === "orcarouter" ? "ORCAROUTER_API_KEY" : "OPENROUTER_API_KEY",
  );
}

export function getModelCapabilities() {
  return MODEL_ROUTES.map(({ id, label, provider, capabilities }) => ({
    id,
    label,
    provider,
    capabilities,
  }));
}
