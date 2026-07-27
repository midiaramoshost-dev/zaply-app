import { createServerFn } from "@tanstack/react-start";
import { generateText, NoObjectGeneratedError, Output } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const IdeasInput = z.object({
  profile: z.string().trim().min(3).max(400),
  count: z.number().int().min(1).max(30),
  channel: z.string().trim().min(1).max(40),
  tone: z.string().trim().min(1).max(40),
});

const CaptionsInput = z.object({
  profile: z.string().trim().min(3).max(400),
  channel: z.string().trim().min(1).max(40),
  tone: z.string().trim().min(1).max(40),
  titles: z.array(z.string().trim().min(1).max(200)).min(1).max(10),
});

export type PlanCaption = {
  title: string;
  body: string;
  cta: string;
  hashtags: string[];
  imagePrompt: string;
};

function gateway() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("A chave da IA não está configurada.");
  return createLovableAiGatewayProvider(key, { structuredOutputs: true });
}

function friendlyError(error: unknown): Error {
  const message = error instanceof Error ? error.message : String(error);
  console.error("plan generation failed:", message);
  if (message.includes("429")) {
    return new Error("Muitas solicitações agora. Tente novamente em instantes.");
  }
  if (message.includes("402")) {
    return new Error("Os créditos de IA acabaram. Adicione créditos para continuar.");
  }
  return new Error("Não foi possível gerar agora. Tente novamente.");
}

function extractJson<T>(text?: string): T | null {
  if (!text) return null;
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as T;
  } catch {
    return null;
  }
}

export const generateIdeas = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => IdeasInput.parse(input))
  .handler(async ({ data }): Promise<{ ideas: string[] }> => {
    const provider = gateway();
    const prompt = [
      `O usuário descreveu o próprio negócio assim: "${data.profile}".`,
      `Gere exatamente ${data.count} ideias de pauta diferentes para um mês de conteúdo no ${data.channel}.`,
      `Tom de voz: ${data.tone}. Escreva em português do Brasil.`,
      "Cada ideia é apenas um título curto e específico (até 70 caracteres), sem numeração e sem hashtags.",
      "Varie os formatos: dicas, mitos e verdades, bastidores, antes e depois, dúvidas frequentes, prova social, educativo e promocional.",
      "Não repita temas.",
    ].join("\n");

    try {
      const { output } = await generateText({
        model: provider("google/gemini-3.6-flash"),
        output: Output.object({ schema: z.object({ ideas: z.array(z.string()) }) }),
        prompt,
      });
      return { ideas: cleanIdeas(output.ideas, data.count) };
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        const fallback = extractJson<{ ideas?: string[] }>(error.text);
        if (fallback?.ideas?.length) return { ideas: cleanIdeas(fallback.ideas, data.count) };
      }
      throw friendlyError(error);
    }
  });

export const generateCaptions = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => CaptionsInput.parse(input))
  .handler(async ({ data }): Promise<{ captions: PlanCaption[] }> => {
    const provider = gateway();
    const prompt = [
      `Negócio do usuário: "${data.profile}".`,
      `Canal: ${data.channel}. Tom de voz: ${data.tone}. Escreva em português do Brasil.`,
      "Para CADA título abaixo, escreva a publicação pronta:",
      ...data.titles.map((t, i) => `${i + 1}. ${t}`),
      'Cada item precisa de: "title" (repita o título recebido), "body" (legenda pronta, até 600 caracteres, com quebras de linha e emojis quando o canal pedir), "cta" (chamada para ação curta, até 90 caracteres), "hashtags" (3 a 6 hashtags sem #) e "imagePrompt" (descrição em inglês, até 200 caracteres, da imagem ideal para esse post, sem texto na imagem).',
      "Mantenha a mesma ordem e a mesma quantidade de itens.",
    ].join("\n");

    try {
      const { output } = await generateText({
        model: provider("google/gemini-3.6-flash"),
        output: Output.object({
          schema: z.object({
            captions: z.array(
              z.object({
                title: z.string(),
                body: z.string(),
                cta: z.string(),
                hashtags: z.array(z.string()),
                imagePrompt: z.string(),
              }),
            ),
          }),
        }),
        prompt,
      });
      return { captions: normalizeCaptions(output.captions, data.titles) };
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        const fallback = extractJson<{ captions?: Partial<PlanCaption>[] }>(error.text);
        if (fallback?.captions?.length) {
          return { captions: normalizeCaptions(fallback.captions, data.titles) };
        }
      }
      throw friendlyError(error);
    }
  });

function cleanIdeas(ideas: unknown[], count: number): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of ideas) {
    const title = String(raw ?? "")
      .replace(/^\s*\d+[).\-\s]+/, "")
      .trim()
      .slice(0, 120);
    const key = title.toLowerCase();
    if (!title || seen.has(key)) continue;
    seen.add(key);
    out.push(title);
    if (out.length === count) break;
  }
  return out;
}

function normalizeCaptions(captions: Partial<PlanCaption>[], titles: string[]): PlanCaption[] {
  return titles.map((title, index) => {
    const item = captions[index] ?? {};
    return {
      title: String(item.title || title).slice(0, 120),
      body: String(item.body || "").slice(0, 1200),
      cta: String(item.cta || "").slice(0, 140),
      hashtags: (Array.isArray(item.hashtags) ? item.hashtags : [])
        .map((tag) => String(tag).replace(/^#/, "").trim())
        .filter(Boolean)
        .slice(0, 6),
      imagePrompt: String(item.imagePrompt || title).slice(0, 300),
    };
  });
}
