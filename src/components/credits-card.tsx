import { useEffect, useState } from "react";
import { Coins } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

/** Mostra ao usuário o saldo de créditos liberado pelo administrador master. */
export function CreditsCard() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!user) return;
    void supabase
      .from("user_credits")
      .select("balance")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        setFailed(Boolean(error));
        setBalance(error ? null : Number(data?.balance ?? 0));
      });
  }, [user]);

  return (
    <Card className="panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Coins className="size-4 text-primary" /> Créditos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p className="font-display text-3xl font-semibold text-foreground">{balance ?? "—"}</p>
        {failed && (
          <p className="text-destructive">Não foi possível carregar o saldo. Atualize a página e tente novamente.</p>
        )}
        <p>
          Créditos disponíveis para geração de conteúdo e imagens. Solicite mais créditos ao
          administrador master pelo menu flutuante de contato.
        </p>
      </CardContent>
    </Card>
  );
}
