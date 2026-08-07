import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRole } from "@/hooks/use-role";

export type ProfileAccess = {
  approved: boolean;
  role: string | null;
  tenantId: string | null;
  fullName: string | null;
  email: string | null;
};

export function useProfileAccess() {
  const { user, isAdmin, loading: roleLoading, role } = useRole();
  const [profile, setProfile] = useState<ProfileAccess | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("role, tenant_id, full_name, email, is_active")
      .eq("id", user.id)
      .maybeSingle();

    setProfile(
      data
        ? {
            approved: Boolean(data.is_active),
            role: data.role,
            tenantId: data.tenant_id,
            fullName: data.full_name,
            email: data.email,
          }
        : null,
    );
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (roleLoading) return;
    void load();
  }, [roleLoading, load]);

  return {
    user,
    isAdmin,
    role,
    profile,
    loading: roleLoading || loading,
    approved: isAdmin || Boolean(profile?.approved),
    reload: load,
  };
}


/** Formata o tempo restante do teste (ex.: "3h 12min"). */
export function formatTrialLeft(ms: number) {
  const total = Math.max(0, Math.floor(ms / 60000));
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (hours <= 0) return `${minutes}min`;
  return `${hours}h ${String(minutes).padStart(2, "0")}min`;
}
