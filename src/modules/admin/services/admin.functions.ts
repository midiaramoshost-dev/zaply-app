
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

    // Mocking token usage and revenue for now
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
    return { success: true };
  });

export const getUsersList = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*, user_credits(balance), tenants(name)")
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
    // If amount is provided, use RPC for balance
    if (data.amount !== undefined) {
      const { data: result, error } = await supabaseAdmin
        .rpc("grant_user_credits", {
          _user_id: data.userId,
          _amount: data.amount,
          _reason: data.reason || "Ajuste manual administrativo"
        });
      
      if (error) {
        // Fallback: if user_credits record doesn't exist, create it
        const { data: profile } = await supabaseAdmin.from("profiles").select("tenant_id").eq("id", data.userId).single();
        if (profile) {
            await supabaseAdmin.from("user_credits").upsert({
                user_id: data.userId,
                tenant_id: (profile as any).tenant_id,
                balance: data.amount > 0 ? data.amount : 0
            } as any, { onConflict: 'user_id' });
        }
      }
    }

    // Update limits if provided
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

    return { success: true };
  });
