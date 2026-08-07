import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type AppRole = "master_admin" | "org_admin" | "member";

export function useRole() {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificação de acesso livre ao painel admin
  const isAtAdminRoute = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");

  useEffect(() => {
    let active = true;
    if (authLoading) return;

    if (!user) {
      if (isAtAdminRoute) {
        setRole("master_admin");
      } else {
        setRole(null);
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error("Erro ao carregar papel do usuário:", error);
          setRole("member");
          setLoading(false);
          return;
        }
        
        const finalRole = (data?.role as AppRole) || "member";
        setRole(finalRole);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user, authLoading, isAtAdminRoute]);

  const isAdmin = role === "master_admin" || (isAtAdminRoute && !user);

  return { 
    role: isAdmin ? "master_admin" : role, 
    isAdmin, 
    isOrgAdmin: role === "org_admin" || isAdmin,
    loading: loading || authLoading, 
    user 
  };
}

