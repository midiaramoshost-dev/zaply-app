import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { z } from "zod";

export const getTenantsList = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("tenants")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  });

export const updateTenantStatus = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ 
    tenantId: z.string(), 
    status: z.string() 
  }).parse(data))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("tenants")
      .update({ subscription_status: data.status } as any)
      .eq("id", data.tenantId);
    
    if (error) throw error;
    return { success: true };
  });

export const getAIProviders = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("ai_providers")
      .select("*, ai_models(*)");
    
    if (error) throw error;
    return data || [];
  });

export const toggleProvider = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ 
    providerId: z.string(), 
    isActive: z.boolean() 
  }).parse(data))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("ai_providers")
      .update({ is_active: data.isActive } as any)
      .eq("id", data.providerId);
    
    if (error) throw error;
    return { success: true };
  });
