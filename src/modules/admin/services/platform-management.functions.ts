import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { z } from "zod";

export const getPlatformSettings = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("platform_settings")
      .select("*");
    
    if (error) throw error;
    
    // Transform array to a convenient object
    return (data || []).reduce((acc: any, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
  });

export const updatePlatformSetting = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ 
    key: z.string(), 
    value: z.any() 
  }).parse(data))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("platform_settings")
      .upsert({ 
        key: data.key, 
        value: data.value,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });
    
    if (error) throw error;
    return { success: true };
  });

export const getFinanceStats = createServerFn({ method: "GET" })
  .handler(async () => {
    // Basic revenue calculation from invoices
    const { data: invoices, error } = await supabaseAdmin
      .from("invoices")
      .select("amount_total, status, created_at")
      .eq("status", "paid");
    
    if (error) throw error;

    const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.amount_total), 0);
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const mrr = invoices
      .filter(inv => new Date(inv.created_at) > lastMonth)
      .reduce((sum, inv) => sum + Number(inv.amount_total), 0);

    return {
      totalRevenue: totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      mrr: mrr.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      invoiceCount: invoices.length,
    };
  });
