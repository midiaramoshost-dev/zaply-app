import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { useRole } from "@/hooks/use-role";

export type ProfileAccess = {
  approved: boolean;
  requestedPlan: string | null;
  fullName: string | null;
  email: string | null;
};

/** Sabe se a conta do usuário já foi liberada pelo administrador master. */
export function useProfileAccess() {
  const { user, isAdmin, loading: roleLoading } = useRole();
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
      .select("approved, requested_plan, full_name, email")
      .eq("id", user.id)
      .maybeSingle();
    setProfile(
      data
        ? {
            approved: Boolean(data.approved),
            requestedPlan: data.requested_plan,
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

  const busy = roleLoading || loading;

  return {
    user,
    isAdmin,
    profile,
    loading: busy,
    /** Admin sempre tem acesso; usuário precisa da liberação. */
    approved: isAdmin || Boolean(profile?.approved),
    blocked: !busy && Boolean(user) && !isAdmin && !profile?.approved,
    reload: load,
  };
}
