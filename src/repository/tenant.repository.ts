import { supabase } from "@/integrations/supabase/client";

export interface Tenant {
  id: string;
  name: string;
  slug: string | null;
  is_white_label: boolean | null;
}

export class TenantRepository {
  async getBySlug(slug: string): Promise<Tenant | null> {
    const { data, error } = await supabase
      .from("tenants")
      .select("*")
      .eq("slug" as any, slug)
      .maybeSingle();

    if (error) throw error;
    return data as any;
  }

  async getById(id: string): Promise<Tenant | null> {
    const { data, error } = await supabase
      .from("tenants")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data as any;
  }
}

export const tenantRepository = new TenantRepository();

