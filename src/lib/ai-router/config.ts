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
    text: { primaryModelId: "gemini-flash", balancing: "quality" },
    image: { primaryModelId: "flux", balancing: "quality" },
    video: { primaryModelId: "veo-1", balancing: "quality" },
    audio: { primaryModelId: "eleven-v2", balancing: "quality" },
    seo: { primaryModelId: "gpt-4o", balancing: "quality" },
  },
  models: [
    {
      id: "gemini-flash",
      provider: "google",
      model: "google/gemini-2.0-flash-001",
      priority: 1,
      is_active: true
    },
    {
      id: "flux",
      provider: "stability",
      model: "black-forest-labs/flux-1-schnell",
      priority: 1,
      is_active: true
    }
  ]
};

