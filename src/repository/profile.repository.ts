import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/enterprise";

export class ProfileRepository {
  async getById(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        *,
        tenants (
          subscription_status,
          plan_id
        )
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data as any;
  }

  async update(id: string, updates: Partial<Profile>): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update(updates as any)
      .eq("id", id);

    if (error) throw error;
  }
}

export const profileRepository = new ProfileRepository();
