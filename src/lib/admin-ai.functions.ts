import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { DEFAULT_ROUTER_CONFIG, AIRouterConfig } from "./ai-router/config";

// Em um sistema real, isso buscaria de uma tabela 'system_settings' ou similar.
// Como não temos a tabela, usamos o estado do módulo (volátil ao reinício do worker).
let currentConfig = { ...DEFAULT_ROUTER_CONFIG };

export const getAiRouterConfig = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AIRouterConfig> => {
    const { data: adminRole } = await context.supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!adminRole) throw new Response("Forbidden", { status: 403 });

    return currentConfig;
  });

export const updateAiRouterConfig = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: AIRouterConfig) => input)
  .handler(async ({ data, context }) => {
    const { data: adminRole } = await context.supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!adminRole) throw new Response("Forbidden", { status: 403 });

    currentConfig = data;
    return { success: true };
  });
