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

    const gateway = createLovableAiGatewayProvider(key);

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

      return { ideas: output.ideas.slice(0, data.variations) };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("429")) {
        throw new Error("Muitas solicitações agora. Tente novamente em instantes.");
      }
      if (message.includes("402")) {
        throw new Error("Os créditos de IA acabaram. Adicione créditos para continuar.");
      }
      throw new Error("Não foi possível gerar o conteúdo. Tente novamente.");
    }
  });
