import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type AppRole = "master_admin" | "org_admin" | "member";

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
  }, [user, authLoading]);

  return { 
    role, 
    isAdmin: role === "master_admin", 
    isOrgAdmin: role === "org_admin" || role === "master_admin",
    loading: loading || authLoading, 
    user 
  };
}

