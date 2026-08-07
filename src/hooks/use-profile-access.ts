import { useCallback, useEffect, useState } from "react";
import { useRole } from "@/hooks/use-role";
import { profileRepository } from "@/repository/profile.repository";
import { Profile } from "@/types/enterprise";

export const TRIAL_HOURS = 3;

export function formatTrialLeft(ms: number) {
  const total = Math.max(0, Math.floor(ms / 60000));
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (hours <= 0) return `${minutes}min`;
  return `${hours}h ${String(minutes).padStart(2, "0")}min`;
}



export function useProfileAccess() {
  const { user, isAdmin, loading: roleLoading, role: rbacRole } = useRole();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await profileRepository.getById(user.id);
      setProfile(data);
    } catch (error) {
      console.error("Error loading profile access:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (roleLoading) return;
    void load();
  }, [roleLoading, load]);

  const subscriptionStatus = (profile as any)?.tenants?.subscription_status || null;
  const approved = isAdmin || (profile?.is_active && (subscriptionStatus === 'active' || subscriptionStatus === 'trialing'));

  return {
    user,
    isAdmin,
    role: rbacRole,
    profile,
    loading: roleLoading || loading,
    approved,
    reload: load,
    blocked: profile?.is_active === false,
    trialActive: subscriptionStatus === 'trialing',
    trialExpired: subscriptionStatus === 'past_due',
    trialMsLeft: 0,
  };
}



