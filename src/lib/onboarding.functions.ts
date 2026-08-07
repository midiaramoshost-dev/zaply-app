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
  .inputValidator((data) => onboardingSchema.parse(data))
  .handler(async ({ data }) => {
    const slug = data.tenantName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    
    // 1. Criar Tenant
    const { data: tenant, error: tenantError } = await supabaseAdmin
      .from("tenants")
      .insert({
        name: data.tenantName,
        slug,
        is_active: true,
        custom_settings: { plan: data.planId }
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

    // 3. Vincular Usuário ao Tenant como master_admin
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({
        tenant_id: tenant.id,
        role: "master_admin",
        is_active: true
      })
      .eq("id", data.userId);

    if (profileError) throw new Error(`Erro ao atualizar perfil: ${profileError.message}`);

    return { success: true, tenantId: tenant.id, orgId: org.id };
  });
