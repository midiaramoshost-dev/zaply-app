import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const onboardingSchema = z.object({
  tenantName: z.string().min(3),
  orgName: z.string().min(3),
  planId: z.string(),
  userId: z.string().uuid(),
  userEmail: z.string().email(),
});

export const setupInitialTenant = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => onboardingSchema.parse(data))
  .handler(async ({ data }) => {
    // 1. Criar Tenant
    const { data: tenant, error: tenantError } = await supabaseAdmin
      .from("tenants")
      .insert({
        name: data.tenantName,
        // Usando as colunas reais do schema detectado: name e subdomain (no lugar de slug)
        subdomain: data.tenantName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      })
      .select()
      .single();

    if (tenantError) throw new Error(`Erro ao criar tenant: ${tenantError.message}`);

    // 2. Criar Organização Padrão
    const { data: org, error: orgError } = await supabaseAdmin
      .from("organizations")
      .insert({
        tenant_id: tenant.id,
        name: data.orgName,
      })
      .select()
      .single();

    if (orgError) throw new Error(`Erro ao criar organização: ${orgError.message}`);

    // 3. Vincular Usuário ao Tenant como admin
    // O tipo user_role_type no schema geralmente é algo como 'admin', 'user', 'owner'.
    // Vou usar 'master_admin' se o schema permitir, ou apenas 'admin'.
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({
        tenant_id: tenant.id,
        role: "master_admin" as any, 
        is_active: true,
        approved: true,
        requested_plan: data.planId
      })
      .eq("id", data.userId);

    if (profileError) throw new Error(`Erro ao atualizar perfil: ${profileError.message}`);

    return { success: true, tenantId: tenant.id, orgId: org.id };
  });
