import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { runZaplyAiTask } from "@/lib/ai-router/router.server";

const promptSchema = z.object({
  task: z.enum(["text", "image", "video", "seo"]),
  prompt: z.string(),
  brandContext: z.string().optional(),
});

export const generateZaplyContent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => promptSchema.parse(data))
  .handler(async ({ data }) => {
    // Aqui injetaríamos o contexto da marca/empresa recuperado do tenant
    const systemPrompt = `Você é a IA Zaply, uma inteligência artificial enterprise. 
    Aja como um especialista em marketing estratégico.
    Contexto da Marca: ${data.brandContext || 'Conteúdo geral para redes sociais'}`;

    return runZaplyAiTask(data.task, {
      prompt: data.prompt,
      system: systemPrompt,
    });
  });
