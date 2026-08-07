export type AIProvider = 
  | "openai" 
  | "anthropic" 
  | "google" 
  | "mistral" 
  | "deepseek" 
  | "stability" 
  | "openrouter";

export type AITaskType = "text" | "image" | "video" | "audio" | "seo";

export interface AIModelConfig {
  id: string;
  provider: AIProvider;
  model: string;
  apiKey?: string;
  priority: number;
  is_active: boolean;
}

export interface AIRouterConfig {
  tasks: Record<AITaskType, {
    primaryModelId: string;
    balancing: "quality" | "speed" | "cost";
  }>;
  models: AIModelConfig[];
}

export const DEFAULT_ROUTER_CONFIG: AIRouterConfig = {
  tasks: {
    text: { primaryModelId: "gpt-4o", balancing: "quality" },
    image: { primaryModelId: "dall-e-3", balancing: "quality" },
    video: { primaryModelId: "veo-1", balancing: "quality" },
    audio: { primaryModelId: "eleven-v2", balancing: "quality" },
    seo: { primaryModelId: "gpt-4o", balancing: "quality" },
  },
  models: [
    {
      id: "gpt-4o",
      provider: "openai",
      model: "gpt-4o",
      priority: 1,
      is_active: true
    },
    {
      id: "gemini-pro",
      provider: "google",
      model: "gemini-1.5-pro",
      priority: 2,
      is_active: true
    }
  ]
};

