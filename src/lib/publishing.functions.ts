import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { runZaplyAiTask } from "./ai-router/router.server";

const AutoPublishInput = z.object({
  topic: z.string().trim().min(3),
  channels: z.array(z.string()).min(1),
});

export const generateAndPublishAction = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AutoPublishInput.parse(input))
  .handler(async ({ data }) => {
    // 1. Geração otimizada por canal
    const content = await runZaplyAiTask("text", {
      prompt: `Gere conteúdo pronto para publicação imediata para: ${data.channels.join(", ")}. Tema: ${data.topic}`,
      system: "Você é o motor de publicação automática da Zaply. Gere títulos, legendas e hashtags perfeitos para cada rede.",
      schema: z.object({
        posts: z.array(z.object({
          channel: z.string(),
          content: z.string(),
          metadata: z.any()
        }))
      })
    });

    // 2. Simulação de publicação (integração n8n seria chamada aqui)
    console.log("Iniciando publicação automática Zaply:", content);

    return {
      success: true,
      report: content.posts.map(p => ({
        channel: p.channel,
        status: "publicado",
        link: "#"
      }))
    };
  });
