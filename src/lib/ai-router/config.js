export const DEFAULT_ROUTER_CONFIG = {
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
