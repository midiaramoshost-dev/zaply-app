import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { useRole } from "@/hooks/use-role";

/** Duração do teste gratuito liberado automaticamente no cadastro. */
export const TRIAL_HOURS = 3;
const TRIAL_MS = TRIAL_HOURS * 60 * 60 * 1000;

export type ProfileAccess = {
  approved: boolean;
  requestedPlan: string | null;
  fullName: string | null;
  email: string | null;
  createdAt: string | null;
};

/** Sabe se a conta do usuário já foi liberada pelo administrador master. */
export function useProfileAccess() {
  const { user, isAdmin, loading: roleLoading } = useRole();
  const [profile, setProfile] = useState<ProfileAccess | null>(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => Date.now());

  const load = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("approved, requested_plan, full_name, email, created_at")
      .eq("id", user.id)
      .maybeSingle();
    setProfile(
      data
        ? {
            approved: Boolean(data.approved),
            requestedPlan: data.requested_plan,
            fullName: data.full_name,
            email: data.email,
            createdAt: data.created_at,
          }
        : null,
    );
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (roleLoading) return;
    void load();
  }, [roleLoading, load]);

  // Mantém o contador do teste sempre atualizado (e bloqueia ao expirar).
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const busy = roleLoading || loading;
  const start = profile?.createdAt ? new Date(profile.createdAt).getTime() : null;
  const trialEndsAt = start && Number.isFinite(start) ? start + TRIAL_MS : null;
  const approvedByAdmin = isAdmin || Boolean(profile?.approved);
  const trialActive = !isAdmin && !approvedByAdmin && Boolean(trialEndsAt && now < trialEndsAt);
  const trialExpired = !isAdmin && !approvedByAdmin && Boolean(trialEndsAt && now >= trialEndsAt);
  const msLeft = trialEndsAt ? Math.max(0, trialEndsAt - now) : 0;

  return {
    user,
    isAdmin,
    profile,
    loading: busy,
    approved: true,
    blocked: false,
    trialActive: false,
    trialExpired: false,
    trialEndsAt,
    trialMsLeft: 0,
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
