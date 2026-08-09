
import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { z } from "zod";

export const getAdminStats = createServerFn({ method: "GET" })
  .handler(async () => {
    const { count: tenantsCount } = await supabaseAdmin
      .from("tenants")
      .select("*", { count: "exact", head: true });

    const { count: usersCount } = await supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true });

    return {
      tenants: tenantsCount || 0,
      users: usersCount || 0,
      tokens: "1.2M",
      revenue: "R$ 45.2k"
    };
  });

export const getRecentTenants = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data } = await supabaseAdmin
      .from("tenants")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);
    return data || [];
  });

export const getPendingApprovals = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data } = await supabaseAdmin
      .from("profiles")
      .select("*, tenants(name)")
      .eq("approved", false)
      .limit(10);
    return data || [];
  });

export const approveUser = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ userId: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ approved: true, is_active: true } as any)
      .eq("id", data.userId);
    
    if (error) throw error;

    // Log action using existing audit_logs structure
    await supabaseAdmin.from("audit_logs").insert({
      action: "Usuário Aprovado",
      entity_type: "user",
      entity_id: data.userId,
      payload: { timestamp: new Date().toISOString() }
    });

    return { success: true };
  });

export const getUsersList = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*, user_credits(balance, daily_post_limit, daily_media_limit, max_social_accounts), tenants(name)")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  });

export const updateUserStatus = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ 
    userId: z.string(), 
    isActive: z.boolean() 
  }).parse(data))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ is_active: data.isActive } as any)
      .eq("id", data.userId);
    
    if (error) throw error;

    await supabaseAdmin.from("audit_logs").insert({
      action: data.isActive ? "Usuário Ativado" : "Usuário Suspenso",
      entity_type: "user",
      entity_id: data.userId
    });

    return { success: true };
  });

export const adjustCredits = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ 
    userId: z.string(), 
    amount: z.number().optional(),
    dailyPostLimit: z.number().optional(),
    dailyMediaLimit: z.number().optional(),
    maxSocialAccounts: z.number().optional(),
    reason: z.string().optional()
  }).parse(data))
  .handler(async ({ data }) => {
    if (data.amount !== undefined) {
      const { error } = await supabaseAdmin
        .rpc("grant_user_credits", {
          _user_id: data.userId,
          _amount: data.amount,
          _reason: data.reason || "Ajuste manual administrativo"
        });
      
      if (error) {
        const { data: profile } = await supabaseAdmin.from("profiles").select("tenant_id").eq("id", data.userId).single();
        if (profile) {
            await supabaseAdmin.from("user_credits").upsert({
                user_id: data.userId,
                balance: data.amount > 0 ? data.amount : 0
            } as any, { onConflict: 'user_id' });
        }
      }
    }

    const updates: any = {};
    if (data.dailyPostLimit !== undefined) updates.daily_post_limit = data.dailyPostLimit;
    if (data.dailyMediaLimit !== undefined) updates.daily_media_limit = data.dailyMediaLimit;
    if (data.maxSocialAccounts !== undefined) updates.max_social_accounts = data.maxSocialAccounts;

    if (Object.keys(updates).length > 0) {
      const { error } = await supabaseAdmin
        .from("user_credits")
        .update(updates)
        .eq("user_id", data.userId);
      
      if (error) throw error;
    }

    await supabaseAdmin.from("audit_logs").insert({
      action: "Ajuste de Créditos/Quotas",
      entity_type: "user",
      entity_id: data.userId,
      payload: { ...updates, amount: data.amount }
    });

    return { success: true };
  });

export const getAuditLogs = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    
    if (error) throw error;
    return data || [];
  });

export const getMarketplaceItems = createServerFn({ method: "GET" })
  .handler(async () => {
    // We use a generic type here because prompt_marketplace might not be in types.ts yet
    const { data, error } = await (supabaseAdmin.from("prompt_marketplace" as any) as any)
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  });

export const createMarketplaceItem = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({
    title: z.string(),
    description: z.string(),
    prompt_text: z.string(),
    category: z.string()
  }).parse(data))
  .handler(async ({ data }) => {
    const { error } = await (supabaseAdmin.from("prompt_marketplace" as any) as any)
      .insert(data);
    
    if (error) throw error;

    await supabaseAdmin.from("audit_logs").insert({
      action: "Novo Prompt Marketplace",
      entity_type: "platform_setting",
      payload: { title: data.title }
    });

    return { success: true };
  });

export const deleteMarketplaceItem = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const { error } = await (supabaseAdmin.from("prompt_marketplace" as any) as any)
      .delete()
      .eq("id", data.id);
    
    if (error) throw error;
    return { success: true };
  });
