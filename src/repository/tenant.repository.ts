// src/repository/tenant.repository.ts
import { supabase } from "@/integrations/supabase/client";
import { Tenant } from "@/types/enterprise";

export const tenantRepository = {
  async getById(id: string): Promise<Tenant | null> {
    const { data, error } = await supabase
      .from("tenants")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return data as unknown as Tenant;
  },

  async getBySlug(slug: string): Promise<Tenant | null> {
    const { data, error } = await supabase
      .from("tenants")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return null;
    return data as unknown as Tenant;
  },

  async create(tenant: Partial<Tenant>): Promise<Tenant> {
    const { data, error } = await supabase
      .from("tenants")
      .insert(tenant)
      .select()
      .single();

    if (error) throw error;
    return data as unknown as Tenant;
  }
};
