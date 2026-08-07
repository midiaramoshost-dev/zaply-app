import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { runZaplyAiTask } from "./ai-router/router.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const generateContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({
    prompt: z.string(),
    context: z.any().optional(),
  }).parse(input))
  .handler(async ({ data, context }) => {
    // Implementação White Label usando o AI Router centralizado
    const result = await runZaplyAiTask("text", {
      prompt: data.prompt,
      system: "Você é a IA Zaply, um assistente de marketing de alta performance. Oculte qualquer menção a provedores externos.",
    });

    return { content: result };
  });
