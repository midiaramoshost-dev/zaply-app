import { createServerFn } from "@tanstack/react-start";
import { generateText, NoObjectGeneratedError, Output } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const ReplyInput = z.object({
  comment: z.string().trim().min(1).max(600),
  author: z.string().trim().max(80).optional(),
  channel: z.string().trim().max(40).optional(),
  postTitle: z.string().trim().max(200).optional(),
  brandName: z.string().trim().max(120).optional(),
  tone: z.string().trim().max(40).optional(),
  address: z.string().trim().max(300).optional(),
  contact: z.string().trim().max(200).optional(),
  bannedWords: z.array(z.string().trim().max(60)).max(30).optional(),
});

export type CommentReply = {
  reply: string;
  intent: string;
  needsHuman: boolean;
};

export const generateCommentReply = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ReplyInput.parse(input))
  .handler(async ({ data }): Promise<CommentReply> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY não configurada");

    const gateway = createLovableAiGatewayProvider(key);

    const prompt = [
      `Você responde comentários de redes sociais da marca ${data.brandName ?? "da empresa"}.`,
      data.channel ? `Canal: ${data.channel}.` : "",
      data.postTitle ? `Post comentado: "${data.postTitle}".` : "",
      data.tone ? `Tom de voz da marca: ${data.tone}.` : "",
      data.address ? `Endereço cadastrado da marca: ${data.address}.` : "",
      data.contact ? `Contato cadastrado: ${data.contact}.` : "",
      data.bannedWords?.length
        ? `Nunca use estas palavras: ${data.bannedWords.join(", ")}.`
        : "",
      `Comentário${data.author ? ` de ${data.author}` : ""}: "${data.comment}"`,
      "Regras: responda em português do Brasil, de forma cordial e curta (máximo 280 caracteres), citando o nome da pessoa quando fizer sentido.",
      'Se perguntarem preço/valores, não invente números: convide para a mensagem privada. Ex.: "Olá! Envie uma mensagem privada que teremos prazer em apresentar nossos planos."',
      "Se perguntarem onde fica/localização, responda usando exatamente o endereço cadastrado. Se não houver endereço cadastrado, peça desculpas e convide para o direct.",
      'Devolva "reply" (a resposta pronta), "intent" (uma palavra: preco, localizacao, duvida, elogio, reclamacao ou outro) e "needsHuman" (true quando for reclamação, crise ou algo que exija atendimento humano).',
    ]
      .filter(Boolean)
      .join("\n");

    const schema = z.object({
      reply: z.string(),
      intent: z.string(),
      needsHuman: z.boolean(),
    });

    try {
      const { output } = await generateText({
        model: gateway("google/gemini-3.6-flash"),
        output: Output.object({ schema }),
        prompt,
      });
      return {
        reply: output.reply.trim().slice(0, 400),
        intent: output.intent.trim().toLowerCase() || "outro",
        needsHuman: !!output.needsHuman,
      };
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        const raw = error.text ?? "";
        const match = raw.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            const parsed = schema.partial().parse(JSON.parse(match[0]));
            if (parsed.reply) {
              return {
                reply: parsed.reply.trim().slice(0, 400),
                intent: parsed.intent ?? "outro",
                needsHuman: !!parsed.needsHuman,
              };
            }
          } catch {
            // ignora e cai no fallback abaixo
          }
        }
      }
      throw error;
    }
  });
