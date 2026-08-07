import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { runZaplyAiTask } from "./ai-router/router.server";
import { AITaskType } from "./ai-router/config";

export const generateWhiteLabelContent = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        taskType: z.enum(["text", "image", "video", "audio", "seo"]),
        prompt: z.string(),
        context: z.record(z.any()).optional(),
        tenantId: z.string().optional(),
      })
      .parse(data)
  )
  .handler(async ({ data }) => {
    // Aqui chamamos o roteador que abstrai os provedores
    // O usuário verá apenas "IA Zaply"
    const result = await runZaplyAiTask(data.taskType as AITaskType, {
      prompt: data.prompt,
      system: data.context?.system,
    });

    return {
      success: true,
      data: result,
      provider: "IA Zaply", // Sempre White Label
    };
  });

