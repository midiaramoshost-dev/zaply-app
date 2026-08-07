export type AIProvider = 
  | "openai" 
  | "anthropic" 
  | "google" 
  | "mistral" 
  | "deepseek" 
  | "stability" 
  | "elevenlabs";

export type AITaskType = "text" | "image" | "video" | "audio" | "ocr" | "seo";

export interface AIModelConfig {
  provider: AIProvider;
  model: string;
  apiKey: string;
  priority: number;
  fallbackTo?: string; // modelId do fallback
  timeout?: number;
}

export interface AIRouterConfig {
  tasks: Record<AITaskType, {
    primaryModelId: string;
    balancing: "quality" | "speed" | "cost" | "balanced";
  }>;
  models: Record<string, AIModelConfig>;
}

// Configuração padrão (inicialmente configurada via ENV para segurança)
export const DEFAULT_ROUTER_CONFIG: AIRouterConfig = {
  tasks: {
    text: { primaryModelId: "gemini-flash", balancing: "quality" },
    image: { primaryModelId: "imagen-3", balancing: "quality" },
    video: { primaryModelId: "veo-1", balancing: "quality" },
    audio: { primaryModelId: "eleven-v2", balancing: "quality" },
    ocr: { primaryModelId: "gemini-vision", balancing: "speed" },
    seo: { primaryModelId: "gemini-flash", balancing: "balanced" },
  },
  models: {
    "gemini-flash": {
      provider: "google",
      model: "google/gemini-2.0-flash-001",
      apiKey: process.env.LOVABLE_API_KEY || "",
      priority: 1,
    },
    "imagen-3": {
      provider: "google",
      model: "google/imagen-3",
      apiKey: process.env.LOVABLE_API_KEY || "",
      priority: 1,
    }
  }
};
