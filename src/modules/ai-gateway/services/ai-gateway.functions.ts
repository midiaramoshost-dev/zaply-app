// src/modules/ai-gateway/services/ai-gateway.functions.ts
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { AIModel, AIProvider } from "@/types/enterprise";

// Schema para entrada de geração de conteúdo
const generateContentSchema = z.object({
  prompt: z.string(),
  taskType: z.enum(["text", "image", "video"]),
  tenantId: z.string(),
  agentId: z.string().optional(),
  config: z.record(z.any()).optional(),
});

/**
 * Zaply AI Gateway - Roteador Inteligente
 * Abstrai provedores (OpenAI, Gemini, Anthropic) sob a marca "IA Zaply"
 */
export const zaplyAIRouter = createServerFn({ method: "POST" })
  .inputValidator((data) => generateContentSchema.parse(data))
  .handler(async ({ data }) => {
    const { prompt, taskType, tenantId, agentId, config } = data;

    // 1. Log da Auditoria (Enterprise Rule)
    await supabaseAdmin.from("audit_logs").insert({
      tenant_id: tenantId,
      action: "ai_generation_request",
      resource_type: "ai_gateway",
      payload: { taskType, agentId } as any,
    });

    // 2. Buscar Provedores Ativos para o Tenant ou Globais
    const { data: providers, error: pError } = await supabaseAdmin
      .from("ai_providers")
      .select("*, ai_models(*)")
      .or(`tenant_id.eq.${tenantId},tenant_id.is.null`)
      .eq("is_active", true)
      .eq("ai_models.task_type", taskType)
      .eq("ai_models.is_active", true)
      .order("priority", { ascending: false });

    if (pError || !providers || providers.length === 0) {
      // Fallback para provedor padrão do sistema se nenhum for configurado
      return {
        success: false,
        error: "Nenhum provedor de IA configurado para este tipo de tarefa.",
        fallback: true
      };
    }

    // 3. Lógica de Fallback & Balanceamento
    // Tentamos cada provedor em ordem de prioridade até obter sucesso
    for (const provider of providers) {
      try {
        const model = provider.ai_models[0]; // Pega o primeiro modelo compatível do provedor
        
        // Aqui chamamos o adaptador específico (OpenAI, Gemini, etc.)
        // No momento, simulamos a integração com o motor Zaply unificado
        const result = await callInternalAIProvider(provider, model, prompt, config);
        
        if (result.success) {
          return {
            success: true,
            content: result.content,
            provider: "IA Zaply", // White Label branding
            modelId: model.id,
          };
        }
      } catch (err) {
        console.error(`Falha no provedor ${provider.name}, tentando próximo...`, err);
        continue;
      }
    }

    throw new Error("Todos os provedores de IA falharam. Por favor, tente novamente em instantes.");
  });

// Adaptador interno (Simulado para o prompt)
async function callInternalAIProvider(provider: any, model: any, prompt: string, config: any) {
  // Em uma implementação real, aqui carregaríamos a API Key do Lovable Secrets
  // e faríamos o fetch para OpenAI/Gemini/etc.
  
  // Exemplo de integração Gemini (já existente no projeto)
  if (provider.provider_type === 'google') {
    // Import dinâmico para evitar problemas de bundler no server
    const { generateContent } = await import("@/lib/ai-gateway.server");
    const content = await generateContent(prompt);
    return { success: true, content };
  }

  // Mock de resposta para outros provedores por enquanto
  return { 
    success: true, 
    content: `[IA Zaply - Processado via ${provider.name}] Resposta simulada para: ${prompt.substring(0, 50)}...` 
  };
}
