import { AiModelConfig, db } from "astro:db";
import {
  getPublicModelCatalog,
  isModelEnabled,
  MODEL_ROUTES,
  setModelOverride,
} from "./model-catalog";

let loaded = false;

export async function refreshModelOverrides() {
  if (loaded) return;
  try {
    const rows = await db.select().from(AiModelConfig);
    for (const row of rows) {
      setModelOverride(row.modelId, row.enabled === 1);
    }
  } catch (error) {
    console.warn(
      "[admin] Could not load model overrides; using env defaults.",
      error,
    );
  } finally {
    loaded = true;
  }
}

export async function listModelConfigurations() {
  await refreshModelOverrides();
  return getPublicModelCatalog();
}

export async function setModelConfiguration(modelId: string, enabled: boolean) {
  const route = MODEL_ROUTES.find((candidate) => candidate.id === modelId);
  if (!route) return null;

  setModelOverride(modelId, enabled);
  try {
    await db
      .insert(AiModelConfig)
      .values({ modelId, enabled: enabled ? 1 : 0, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: AiModelConfig.modelId,
        set: { enabled: enabled ? 1 : 0, updatedAt: new Date() },
      });
  } catch (error) {
    console.error("[admin] Could not persist model override.", error);
    throw new Error("model_config_persistence_failed");
  }

  return {
    ...getPublicModelCatalog().find((candidate) => candidate.id === modelId)!,
    enabled: isModelEnabled(route),
  };
}

export function resetModelConfigurationCache() {
  loaded = false;
}
