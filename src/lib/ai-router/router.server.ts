import { generateText, generateObject, generateImage, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "../ai-gateway.server";
import { DEFAULT_ROUTER_CONFIG, AITaskType } from "./config";

/**
 * Zaply AI Router - O cérebro da plataforma.
 * Roteia requisições para os provedores corretos, gerencia fallbacks
 * e garante que o usuário nunca veja a infraestrutura subjacente.
 */
export async function runZaplyAiTask<T = any>(
  task: AITaskType,
  params: {
    prompt: string;
    schema?: z.ZodType<T>;
    system?: string;
    quality?: "standard" | "high";
  }
) {
  // 1. Identificar o modelo primário para a tarefa
  const taskConfig = DEFAULT_ROUTER_CONFIG.tasks[task];
  const modelId = taskConfig.primaryModelId;
  const modelConfig = DEFAULT_ROUTER_CONFIG.models.find(m => m.id === modelId);

  if (!modelConfig) {
    throw new Error(`Configuração não encontrada para a tarefa: ${task}`);
  }


  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("API Key não configurada no servidor.");

  const provider = createLovableAiGatewayProvider(apiKey, { 
    structuredOutputs: !!params.schema 
  });

  try {
    // 2. Executar a tarefa com base no tipo
    if (task === "text" || task === "seo") {
      if (params.schema) {
        const { object } = await generateObject({
          model: provider(modelConfig.model),
          schema: params.schema,
          prompt: params.prompt,
          system: params.system,
        });
        return object as T;
      } else {
        const { text } = await generateText({
          model: provider(modelConfig.model),
          prompt: params.prompt,
          system: params.system,
        });
        return text as T;
      }
    }

    if (task === "image") {
      // Nota: A API Vercel AI SDK para imagens pode variar conforme o provider.
      // Aqui usamos o gateway da Lovable que abstrai isso.
      const { image } = await generateImage({
        model: provider.imageModel(modelConfig.model),
        prompt: params.prompt,
      });
      return image as T;
    }

    throw new Error(`Execução não implementada para o tipo: ${task}`);

  } catch (error) {
    console.error(`AI Router Error (${task}/${modelId}):`, error);
    
    // 3. Fallback Logic (Simplificado para o MVP)
    // Se o modelo primário falhar, poderíamos tentar o fallbackTo aqui.
    // Por enquanto, apenas reportamos o erro de forma limpa.
    
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("429")) throw new Error("Capacidade máxima atingida. Tente em breve.");
    if (message.includes("402")) throw new Error("Créditos insuficientes na plataforma.");
    
    throw new Error("A IA Zaply está processando muitas requisições. Tente novamente.");
  }
}
