import type { AiCapability, ModelRoute } from "./types";

const ORCAROUTER_MULTIMODAL_MODEL = "qwen/qwen3.8-27b-free";

const OPENROUTER_MULTIMODAL_MODEL =
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free";
const OPENROUTER_VISION_PRIMARY_MODEL = "google/gemma-4-26b-a4b-it:free";
const OPENROUTER_VISION_SECONDARY_MODEL = "google/gemma-4-31b-it:free";
const OPENROUTER_DOCUMENT_MODEL = "dots-studio/dots-3-note-preview:free";
const OPENROUTER_VISION_FALLBACK_MODEL =
  "nvidia/nemotron-nano-12b-v2-vl:free";
const OPENROUTER_TEXT_LONG_CONTEXT_MODEL =
  "nvidia/nemotron-3-ultra-550b-a55b:free";
const OPENROUTER_TEXT_THROUGHPUT_MODEL =
  "nvidia/nemotron-3.5-lightning:free";
const OPENROUTER_TEXT_REASONING_MODEL =
  "nvidia/nemotron-3-super-120b-a12b:free";
const OPENROUTER_TEXT_GENERAL_MODEL = "openai/gpt-oss-20b:free";
const OPENROUTER_TEXT_CODING_MODEL = "cohere/north-mini-code:free";
const OPENROUTER_DYNAMIC_FREE_MODEL = "openrouter/free";

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
const OPENROUTER_MULTIMODAL_CAPABILITIES: readonly AiCapability[] = [
  "text",
  "image",
  "video",
  "audio",
];
const OPENROUTER_VISION_CAPABILITIES: readonly AiCapability[] = [
  "text",
  "image",
  "video",
];
const OPENROUTER_DOCUMENT_CAPABILITIES: readonly AiCapability[] = [
  "text",
  "image",
];
const OPENROUTER_TEXT_CAPABILITIES: readonly AiCapability[] = ["text"];

export const MODEL_ROUTES: readonly ModelRoute[] = [
  {
    id: ORCAROUTER_MULTIMODAL_MODEL,
    label: "vndo-ai multimodal",
    provider: "orcarouter",
    capabilities: ORCAROUTER_CAPABILITIES,
    priority: 100,
    enabled: () => hasKey("ORCAROUTER_API_KEY"),
  },
  {
    id: OPENROUTER_MULTIMODAL_MODEL,
    label: "vndo-ai omni",
    provider: "openrouter",
    capabilities: OPENROUTER_MULTIMODAL_CAPABILITIES,
    priority: 98,
    enabled: () => hasKey("OPENROUTER_API_KEY"),
  },
  {
    id: OPENROUTER_VISION_PRIMARY_MODEL,
    label: "vndo-ai vision primary",
    provider: "openrouter",
    capabilities: OPENROUTER_VISION_CAPABILITIES,
    priority: 96,
    enabled: () => hasKey("OPENROUTER_API_KEY"),
  },
  {
    id: OPENROUTER_VISION_SECONDARY_MODEL,
    label: "vndo-ai vision secondary",
    provider: "openrouter",
    capabilities: OPENROUTER_VISION_CAPABILITIES,
    priority: 94,
    enabled: () => hasKey("OPENROUTER_API_KEY"),
  },
  {
    id: OPENROUTER_DOCUMENT_MODEL,
    label: "vndo-ai document",
    provider: "openrouter",
    capabilities: OPENROUTER_DOCUMENT_CAPABILITIES,
    priority: 92,
    enabled: () => hasKey("OPENROUTER_API_KEY"),
  },
  {
    id: OPENROUTER_VISION_FALLBACK_MODEL,
    label: "vndo-ai vision fallback",
    provider: "openrouter",
    capabilities: OPENROUTER_VISION_CAPABILITIES,
    priority: 90,
    enabled: () => hasKey("OPENROUTER_API_KEY"),
  },
  {
    id: OPENROUTER_TEXT_LONG_CONTEXT_MODEL,
    label: "vndo-ai long context",
    provider: "openrouter",
    capabilities: OPENROUTER_TEXT_CAPABILITIES,
    priority: 86,
    enabled: () => hasKey("OPENROUTER_API_KEY"),
  },
  {
    id: OPENROUTER_TEXT_THROUGHPUT_MODEL,
    label: "vndo-ai fast text",
    provider: "openrouter",
    capabilities: OPENROUTER_TEXT_CAPABILITIES,
    priority: 84,
    enabled: () => hasKey("OPENROUTER_API_KEY"),
  },
  {
    id: OPENROUTER_TEXT_REASONING_MODEL,
    label: "vndo-ai reasoning",
    provider: "openrouter",
    capabilities: OPENROUTER_TEXT_CAPABILITIES,
    priority: 82,
    enabled: () => hasKey("OPENROUTER_API_KEY"),
  },
  {
    id: OPENROUTER_TEXT_GENERAL_MODEL,
    label: "vndo-ai text",
    provider: "openrouter",
    capabilities: OPENROUTER_TEXT_CAPABILITIES,
    priority: 80,
    enabled: () => hasKey("OPENROUTER_API_KEY"),
  },
  {
    id: OPENROUTER_TEXT_CODING_MODEL,
    label: "vndo-ai coding",
    provider: "openrouter",
    capabilities: OPENROUTER_TEXT_CAPABILITIES,
    priority: 78,
    enabled: () => hasKey("OPENROUTER_API_KEY"),
  },
  {
    id: OPENROUTER_DYNAMIC_FREE_MODEL,
    label: "vndo-ai dynamic fallback",
    provider: "openrouter",
    capabilities: OPENROUTER_DOCUMENT_CAPABILITIES,
    priority: 70,
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
