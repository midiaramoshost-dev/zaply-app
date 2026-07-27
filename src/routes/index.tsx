import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";

import { DashboardMetricsGrid } from "@/components/dashboard-metrics";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

function Dashboard() {
  const { posts, ready } = usePosts();

  const drafts = posts.filter((p) => p.status === "rascunho");
  const scheduled = posts
    .filter((p) => p.status === "agendado")
    .sort((a, b) => (a.scheduledAt ?? "").localeCompare(b.scheduledAt ?? ""));
  const published = posts.filter((p) => p.status === "publicado");

  const stats = [
    { label: "Rascunhos", value: drafts.length, icon: FileText },
    { label: "Agendados", value: scheduled.length, icon: CalendarDays },
    { label: "Publicados", value: published.length, icon: CheckCircle2 },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <section className="panel relative overflow-hidden px-6 py-10 sm:px-10">
        <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-primary/20 blur-3xl" />
        <Badge variant="outline" className="border-primary/40 text-primary">
          Plataforma de conteúdo com IA
        </Badge>
        <h1 className="mt-4 max-w-2xl text-3xl font-semibold sm:text-4xl">
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
            <Link to="/calendario">
              Ver calendário
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.label}
              </CardTitle>
              <s.icon className="size-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl font-semibold">{ready ? s.value : "—"}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="panel">
          <CardHeader>
            <CardTitle className="text-base">Próximas publicações</CardTitle>
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
                className="rounded-xl border border-border/70 bg-surface/60 p-3"
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
          <CardHeader>
            <CardTitle className="text-base">Atividade recente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {posts.length === 0 && (
              <p className="text-sm text-muted-foreground">Sua biblioteca está vazia.</p>
            )}
            {posts.slice(0, 5).map((post) => (
              <div key={post.id} className="flex items-center justify-between gap-3">
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
