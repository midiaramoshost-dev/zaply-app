import { useState } from "react";
import { Check, Clock, Crown, LogOut, Sparkles, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandMark } from "@/components/brand-mark";
import { PlanCheckoutDialog } from "@/components/plan-checkout-dialog";
import { useAuth } from "@/hooks/use-auth";
import { formatLimit, formatPrice, usePlans, type Plan } from "@/lib/plans-store";
import { cn } from "@/lib/utils";

type Props = {
  requestedPlan: string | null;
  trialExpired?: boolean;
  onRequested: () => void;
};

export function PendingApprovalScreen({ requestedPlan, trialExpired, onRequested }: Props) {
  const { signOut } = useAuth();
  const { plans, loading } = usePlans();
  const [selected, setSelected] = useState<Plan | null>(null);


  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 sm:px-6">
      <header className="panel space-y-3 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <BrandMark className="size-9" />
          <Badge variant="outline" className="gap-1 border-primary/40 text-primary">
            <Clock className="size-3" />{" "}
            {trialExpired ? "Teste de 3h encerrado" : "Aguardando liberação"}
          </Badge>
        </div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          {trialExpired
            ? "Seu teste gratuito de 3 horas terminou"
            : "Sua conta foi criada e está em análise"}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          {trialExpired ? "Para continuar usando o Zaply, escolha abaixo o plano desejado" : "Escolha abaixo o plano desejado"} e fale com o administrador master pelo menu flutuante para
          concluir o pagamento. Assim que a liberação for feita, o painel completo abre
          automaticamente.
        </p>
        {requestedPlan && (
          <p className="text-xs text-primary">
            Plano solicitado: <strong className="uppercase">{requestedPlan}</strong> — aguardando
            confirmação do pagamento.
          </p>
        )}
        <div>
          <Button size="sm" variant="ghost" onClick={() => void signOut()}>
            <LogOut className="size-3.5" /> Sair da conta
          </Button>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        {loading && <p className="text-sm text-muted-foreground">Carregando planos…</p>}
        {plans.map((plan) => (
          <Card
            key={plan.code}
            className={cn(
              "relative flex flex-col",
              (plan.is_featured || plan.code === requestedPlan) &&
                "border-primary/60 shadow-[0_0_40px_-18px_hsl(var(--primary))]",
            )}
          >
            {plan.is_featured && (
              <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground">
                Mais escolhido
              </span>
            )}
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-lg">
                {plan.code === "agency" ? (
                  <Crown className="size-4 text-primary" />
                ) : plan.code === "pro" ? (
                  <Sparkles className="size-4 text-primary" />
                ) : (
                  <Users className="size-4 text-primary" />
                )}
                {plan.name}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-5">
              <div className="flex items-end gap-1">
                <span className="font-display text-3xl font-semibold tracking-tight">
                  {formatPrice(plan.price_cents, plan.currency)}
                </span>
                <span className="pb-1 text-xs text-muted-foreground">/mês</span>
              </div>

              <div className="flex flex-wrap gap-2 text-[11px]">
                <Badge variant="secondary">{formatLimit(plan.max_clients, "cliente")}</Badge>
                <Badge variant="secondary">
                  {formatLimit(plan.max_posts, "post/mês", "posts/mês")}
                </Badge>
              </div>

              <ul className="flex-1 space-y-2 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.is_featured ? "default" : "outline"}
                className="w-full"
                onClick={() => setSelected(plan)}
              >
                {plan.code === requestedPlan ? "Retomar contratação" : `Contratar ${plan.name}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <PlanCheckoutDialog
        plan={selected}
        open={Boolean(selected)}
        onOpenChange={(next) => !next && setSelected(null)}
        onContracted={onRequested}
      />
    </div>

  );
}
