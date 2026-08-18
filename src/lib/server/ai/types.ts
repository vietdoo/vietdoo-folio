export type AiCapability =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "file"
  | "tools"
  | "structured-output"
  | "streaming";

export type ChatRole = "system" | "user" | "assistant" | "tool";

export type ChatContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } }
  | { type: "video_url"; video_url: { url: string } }
  | { type: "input_audio"; input_audio: { data: string; format: string } }
  | {
      type: "file";
      file: { filename?: string; file_data?: string; file_id?: string };
    };

export type ChatMessage = {
  role: ChatRole;
  content: string | ChatContentPart[];
  name?: string;
};

export type ProviderName = "orcarouter" | "openrouter";

export type ProviderRequest = {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
};

export type ProviderResponse = {
  content: string;
  provider: ProviderName;
  model: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
};

export type ProviderFailure = {
  provider: ProviderName;
  status?: number;
  code: string;
  message: string;
  retryable: boolean;
};

export type ModelRoute = {
  id: string;
  label: string;
  provider: ProviderName;
  capabilities: readonly AiCapability[];
  priority: number;
  enabled: () => boolean;
};

export type SmartCompletionRequest = {
  requestId: string;
  kind: "chat" | "image-description";
  messages: ChatMessage[];
  requiredCapabilities: readonly AiCapability[];
  inputChars?: number;
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
};

export type SmartCompletionResult = {
  content: string;
  publicLabel: "vndo-ai";
  provider: ProviderName;
  modelLabel: string;
  usedFallback: boolean;
  attemptedProviders: ProviderName[];
};
