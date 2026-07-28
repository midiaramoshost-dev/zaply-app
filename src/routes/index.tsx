import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, CalendarDays, Sparkles, Wand2 } from "lucide-react";

import { DashboardMetricsGrid } from "@/components/dashboard-metrics";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClients } from "@/lib/clients-store";
import { statusLabel, usePosts } from "@/lib/posts-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Painel — ContentFlow, conteúdo com IA" },
      {
        name: "description",
        content:
          "Acompanhe rascunhos, agendamentos e publicações da sua operação de conteúdo em um único painel.",
      },
      { property: "og:title", content: "Painel — ContentFlow, conteúdo com IA" },
      {
        property: "og:description",
        content: "Acompanhe rascunhos, agendamentos e publicações da sua operação de conteúdo em um único painel.",
      },
    ],
  }),
  component: Dashboard,
});

const quickActions = [
  {
    to: "/criar" as const,
    icon: Sparkles,
    title: "Gerar conteúdo",
    text: "Título, legenda, CTA e hashtags por rede.",
  },
  {
    to: "/automatico" as const,
    icon: Wand2,
    title: "Mês automático",
    text: "30 ideias + legendas agendadas de uma vez.",
  },
  {
    to: "/aprovacao" as const,
    icon: BadgeCheck,
    title: "Aprovar posts",
    text: "Revise e libere o que está na fila.",
  },
  {
    to: "/calendario" as const,
    icon: CalendarDays,
    title: "Ver calendário",
    text: "Mês inteiro de segunda a domingo.",
  },
];

function Dashboard() {
  const { posts, ready } = usePosts();
  const { clients } = useClients();

  const scheduled = posts
    .filter((p) => p.status === "agendado")
    .sort((a, b) => (a.scheduledAt ?? "").localeCompare(b.scheduledAt ?? ""));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <section className="panel relative overflow-hidden px-6 py-8 sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -right-28 -top-28 size-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative">
          <Badge variant="outline" className="border-primary/40 text-primary">
            Plataforma de conteúdo com IA
          </Badge>
          <h1 className="mt-4 max-w-2xl text-3xl font-semibold sm:text-[2.6rem] sm:leading-[1.1]">
            Crie, organize e publique <span className="gradient-text">no piloto automático</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Gere variações de conteúdo para cada canal, aprove em segundos e deixe o calendário
            cuidar da publicação.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/criar">
                <Sparkles className="size-4" />
                Gerar conteúdo
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/tutorial">
                Como usar o app
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="section-title mb-3 text-sm uppercase tracking-[0.12em] text-muted-foreground">
          Ações rápidas
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="panel panel-hover group flex flex-col gap-2 p-4"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-primary/12 text-primary">
                <action.icon className="size-4" />
              </span>
              <span className="mt-1 flex items-center gap-1.5 text-sm font-medium">
                {action.title}
                <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="text-xs text-muted-foreground">{action.text}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="section-title mb-3 text-sm uppercase tracking-[0.12em] text-muted-foreground">
          Desempenho
        </h2>
        <DashboardMetricsGrid posts={posts} ready={ready} clientsCount={clients.length} />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="panel">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Próximas publicações</CardTitle>
            <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
              <Link to="/calendario">Ver tudo</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {scheduled.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nada agendado ainda. Gere um conteúdo e escolha uma data.
              </p>
            )}
            {scheduled.slice(0, 4).map((post) => (
              <div
                key={post.id}
                className="rounded-xl border border-border/70 bg-surface/60 p-3 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary">{post.channel}</Badge>
                  {post.scheduledAt &&
                    new Date(post.scheduledAt).toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                </div>
                <p className="mt-2 line-clamp-2 text-sm font-medium">{post.title}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="panel">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Atividade recente</CardTitle>
            <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
              <Link to="/biblioteca">Biblioteca</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {posts.length === 0 && (
              <p className="text-sm text-muted-foreground">Sua biblioteca está vazia.</p>
            )}
            {posts.slice(0, 5).map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-2/60"
              >
                <p className="line-clamp-1 text-sm">{post.title}</p>
                <Badge variant="outline" className="shrink-0 text-[11px]">
                  {statusLabel[post.status]}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
