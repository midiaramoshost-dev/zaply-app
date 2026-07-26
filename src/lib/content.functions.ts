import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";

export const CHANNELS = [
  "Instagram",
  "LinkedIn",
  "X (Twitter)",
  "Blog",
  "Newsletter",
] as const;

export const TONES = [
  "Profissional",
  "Descontraído",
  "Inspirador",
  "Educativo",
  "Vendedor",
] as const;

const GenerateInput = z.object({
  topic: z.string().trim().min(3).max(500),
  channel: z.string().trim().min(1).max(40),
  tone: z.string().trim().min(1).max(40),
  variations: z.number().int().min(1).max(3),
});

export type GeneratedIdea = {
  title: string;
  body: string;
  hashtags: string[];
};

export const generateContent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data }): Promise<{ ideas: GeneratedIdea[] }> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("A chave da IA não está configurada.");

    const gateway = createLovableAiGatewayProvider(key, { structuredOutputs: true });

    const prompt = [
      `Crie ${data.variations} variação(ões) de conteúdo para ${data.channel}.`,
      `Tema: ${data.topic}`,
      `Tom de voz: ${data.tone}`,
      "Escreva em português do Brasil.",
      "Cada variação precisa de: um título curto (até 70 caracteres), um corpo pronto para publicar (até 900 caracteres, com quebras de linha quando fizer sentido) e de 3 a 6 hashtags relevantes sem o símbolo #.",
    ].join("\n");

    try {
      const { output } = await generateText({
        model: gateway("google/gemini-3.6-flash"),
        output: Output.object({
          schema: z.object({
            ideas: z.array(
              z.object({
                title: z.string(),
                body: z.string(),
                hashtags: z.array(z.string()),
              }),
            ),
          }),
        }),
        prompt,
      });

      return { ideas: normalize(output.ideas, data.variations) };
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        const fallback = parseFallback(error.text);
        if (fallback.length > 0) return { ideas: normalize(fallback, data.variations) };
      }
      const message = error instanceof Error ? error.message : String(error);
      console.error("generateContent failed:", message);
      if (message.includes("429")) {
        throw new Error("Muitas solicitações agora. Tente novamente em instantes.");
      }
      if (message.includes("402")) {
        throw new Error("Os créditos de IA acabaram. Adicione créditos para continuar.");
      }
      throw new Error("Não foi possível gerar o conteúdo. Tente novamente.");
    }
  });

function normalize(ideas: GeneratedIdea[], max: number): GeneratedIdea[] {
  return ideas
    .filter((idea) => idea && typeof idea.title === "string" && typeof idea.body === "string")
    .slice(0, max)
    .map((idea) => ({
      title: idea.title.slice(0, 120),
      body: idea.body.slice(0, 1200),
      hashtags: (Array.isArray(idea.hashtags) ? idea.hashtags : [])
        .map((tag) => String(tag).replace(/^#/, "").trim())
        .filter(Boolean)
        .slice(0, 6),
    }));
}

function parseFallback(text?: string): GeneratedIdea[] {
  if (!text) return [];
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return [];
  try {
    const parsed = JSON.parse(match[0]) as { ideas?: GeneratedIdea[] };
    return Array.isArray(parsed.ideas) ? parsed.ideas : [];
  } catch {
    return [];
  }
}

