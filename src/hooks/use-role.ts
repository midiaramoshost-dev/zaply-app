import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type AppRole = "admin" | "user";

export function useRole() {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (authLoading) return;
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error("Erro ao carregar papel do usuário:", error);
          // Em caso de erro de RLS/rede, tentamos assumir 'user' para não quebrar a UI,
          // mas o useProfileAccess já lida com isAdmin separadamente se necessário.
          setRole("user");
          setLoading(false);
          return;
        }
        const roles = (data ?? []).map((r) => r.role as AppRole);
        setRole(roles.includes("admin") ? "admin" : "user");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user, authLoading]);

  return { role, isAdmin: role === "admin", loading: loading || authLoading, user };
}
