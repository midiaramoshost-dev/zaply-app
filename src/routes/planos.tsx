import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Crown, Sparkles, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatLimit, formatPrice, usePlans } from "@/lib/plans-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/planos")({
  head: () => ({
    meta: [
      { title: "Planos e preços — Starter, Pro e Agency | ContentFlow" },
      {
        name: "description",
        content:
          "Compare os planos do ContentFlow: Starter com 1 cliente e 100 posts/mês, Pro com 5 clientes e IA ilimitada, Agency com clientes ilimitados e marca branca.",
      },
      { property: "og:title", content: "Planos e preços do ContentFlow" },
      {
        property: "og:description",
        content: "Starter, Pro e Agency: escolha o plano certo para produzir e publicar conteúdo com IA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlansPage,
});

const COMPARISON: { label: string; values: Record<string, string> }[] = [
  { label: "Clientes", values: { starter: "1", pro: "5", agency: "Ilimitados" } },
  { label: "Posts por mês", values: { starter: "100", pro: "Ilimitados", agency: "Ilimitados" } },
  { label: "Gerador de IA", values: { starter: "Incluído", pro: "Ilimitado", agency: "Ilimitado" } },
  { label: "Agendamento automático", values: { starter: "—", pro: "Sim", agency: "Sim" } },
  { label: "Múltiplos utilizadores", values: { starter: "—", pro: "—", agency: "Sim" } },
  { label: "Aprovação do cliente", values: { starter: "—", pro: "—", agency: "Sim" } },
  { label: "Relatórios PDF e Excel", values: { starter: "—", pro: "—", agency: "Sim" } },
  { label: "Marca branca", values: { starter: "—", pro: "—", agency: "Sim" } },
];

function PlansPage() {
  const { plans, loading } = usePlans();

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <Badge variant="outline" className="gap-1 border-primary/40 text-primary">
          <Sparkles className="size-3" /> Planos comerciais
        </Badge>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Escolha o plano do seu operação de conteúdo
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Do primeiro cliente à agência com equipe: todos os planos incluem o gerador de conteúdo por IA,
          biblioteca e calendário editorial.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.code}
            className={cn(
              "relative flex flex-col",
              plan.is_featured && "border-primary/60 shadow-[0_0_40px_-18px_hsl(var(--primary))]",
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
                <Badge variant="secondary">{formatLimit(plan.max_clients, "clientes")}</Badge>
                <Badge variant="secondary">{formatLimit(plan.max_posts, "posts/mês")}</Badge>
              </div>

              <ul className="flex-1 space-y-2 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button asChild variant={plan.is_featured ? "default" : "outline"} className="w-full">
                <Link to="/auth">Começar com {plan.name}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base">Comparativo de recursos</CardTitle>
            <CardDescription>
              {loading ? "Carregando planos…" : "O que muda entre Starter, Pro e Agency."}
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-6 py-3 font-medium">Recurso</th>
                  <th className="px-6 py-3 font-medium">Starter</th>
                  <th className="px-6 py-3 font-medium">Pro</th>
                  <th className="px-6 py-3 font-medium">Agency</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.label} className="border-b border-border/60 last:border-0">
                    <td className="px-6 py-3 text-muted-foreground">{row.label}</td>
                    <td className="px-6 py-3">{row.values.starter}</td>
                    <td className="px-6 py-3">{row.values.pro}</td>
                    <td className="px-6 py-3">{row.values.agency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
