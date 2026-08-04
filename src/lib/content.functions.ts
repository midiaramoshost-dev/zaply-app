import { createServerFn } from "@tanstack/react-start";
import { generateText, NoObjectGeneratedError, Output } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";

export const CHANNELS = [
  "Instagram",
  "TikTok",
  "LinkedIn",
  "Facebook",
  "YouTube",
  "X (Twitter)",
  "Blog",
  "Newsletter",
] as const;

export const CHANNEL_GUIDELINES: Record<string, string> = {
  Instagram:
    "Legenda visual e envolvente, abertura com gancho forte, frases curtas, 1 a 3 emojis bem colocados e chamada para ação. Até 600 caracteres. Ex.: \"Descubra como pequenas mudanças podem aumentar seus resultados. 🚀\"",
  TikTok:
    "Texto curto e dinâmico, uso de ganchos rápidos para reter atenção, hashtags de tendência, tom informal e autêntico. Até 300 caracteres.",
  LinkedIn:
    "Mais profissional: contexto de negócio, aprendizado concreto, dados ou insight, sem emojis excessivos. Parágrafos curtos, até 900 caracteres.",
  Facebook:
    "Mais conversacional: fale como se estivesse conversando com a comunidade, faça uma pergunta ao final, tom próximo e simples. Até 500 caracteres.",
  YouTube:
    "Título chamativo (clickbait saudável), descrição com resumo do vídeo, capítulos implícitos e CTAs para inscrição e comentários. Até 800 caracteres.",
  "X (Twitter)":
    "Texto curto e direto, no máximo 260 caracteres, uma ideia só, sem enrolação, no máximo 2 hashtags.",
  Blog: "Introdução de artigo com subtítulo implícito, tom informativo e escaneável, até 900 caracteres.",
  Newsletter:
    "Tom de e-mail pessoal para a base, abertura direta ao leitor, um destaque principal e um convite ao final. Até 900 caracteres.",
};

export const TONES = [
  "Profissional",
  "Descontraído",
  "Inspirador",
  "Educativo",
  "Vendedor",
] as const;

const GenerateInput = z.object({
  topic: z.string().trim().min(3).max(500),
  channels: z.array(z.string().trim().min(1).max(40)).min(1).max(6),
  tone: z.string().trim().min(1).max(40),
  variations: z.number().int().min(1).max(3),
});

export type GeneratedIdea = {
  title: string;
  body: string;
  cta: string;
  emojis: string[];
  hashtags: string[];
  channel: string;
};

export const generateContent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data }): Promise<{ ideas: GeneratedIdea[] }> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("A chave da IA não está configurada.");

    const gateway = createLovableAiGatewayProvider(key, { structuredOutputs: true });

    const total = data.channels.length * data.variations;
    const prompt = [
      `Crie ${data.variations} variação(ões) de conteúdo para CADA um destes canais: ${data.channels.join(", ")}.`,
      `Total de itens: ${total}.`,
      `Tema: ${data.topic}`,
      `Tom de voz base: ${data.tone}`,
      "Adapte a linguagem ao formato de cada canal seguindo estas regras:",
      ...data.channels.map(
        (c) => `- ${c}: ${CHANNEL_GUIDELINES[c] ?? "Adapte ao formato usual do canal."}`,
      ),
      "Escreva em português do Brasil.",
      'Cada item precisa de: "channel" (exatamente o nome do canal), "title" (título curto, até 70 caracteres), "body" (a legenda pronta para publicar, com quebras de linha quando fizer sentido e emojis já aplicados quando o canal pedir), "cta" (uma chamada para ação curta e direta, até 90 caracteres), "emojis" (de 2 a 5 emojis avulsos que combinam com o post) e "hashtags" (3 a 6 hashtags relevantes sem o símbolo #).',
      "No X (Twitter) use no máximo 1 emoji e mantenha o texto curto; no LinkedIn evite excesso de emojis.",
    ].join("\n");


    try {
      const { output } = await generateText({
        model: gateway("google/gemini-3.6-flash"),
        output: Output.object({
          schema: z.object({
            ideas: z.array(
              z.object({
                channel: z.string(),
                title: z.string(),
                body: z.string(),
                cta: z.string(),
                emojis: z.array(z.string()),
                hashtags: z.array(z.string()),
              }),
            ),
          }),
        }),
        prompt,
      });

      return { ideas: normalize(output.ideas, total, data.channels) };
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        const fallback = parseFallback(error.text);
        if (fallback.length > 0) return { ideas: normalize(fallback, total, data.channels) };
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

function normalize(
  ideas: Partial<GeneratedIdea>[],
  max: number,
  channels: string[],
): GeneratedIdea[] {
  return ideas
    .filter((idea) => idea && typeof idea.title === "string" && typeof idea.body === "string")
    .slice(0, max)
    .map((idea) => ({
      channel:
        channels.find((c) => c.toLowerCase() === String(idea.channel ?? "").toLowerCase()) ??
        channels[0],
      title: String(idea.title).slice(0, 120),
      body: String(idea.body).slice(0, 1200),
      cta: String(idea.cta ?? "").slice(0, 140),
      emojis: (Array.isArray(idea.emojis) ? idea.emojis : [])
        .map((e) => String(e).trim())
        .filter(Boolean)
        .slice(0, 6),

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

