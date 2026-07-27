import {
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  Users,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Post } from "@/lib/posts-store";

/** Métricas simuladas e determinísticas, derivadas da biblioteca de posts. */
function hash(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) % 100000;
  return h;
}

export type DashboardMetrics = {
  published: number;
  scheduled: number;
  likes: number;
  comments: number;
  growth: number;
  reach: number;
  engagement: number;
  clients: number;
};

export function computeMetrics(posts: Post[]): DashboardMetrics {
  const published = posts.filter((p) => p.status === "publicado");
  const scheduled = posts.filter((p) => p.status === "agendado");

  const likes = published.reduce((sum, p) => sum + 120 + (hash(p.id) % 880), 0);
  const comments = published.reduce((sum, p) => sum + 8 + (hash(p.title) % 92), 0);
  const reach = published.reduce((sum, p) => sum + 1500 + (hash(p.channel + p.id) % 12000), 0);
  const engagement = reach > 0 ? ((likes + comments) / reach) * 100 : 0;
  const growth = published.length * 2.4 + scheduled.length * 0.8;
  const clients = new Set(posts.map((p) => p.channel)).size;

  return {
    published: published.length,
    scheduled: scheduled.length,
    likes,
    comments,
    growth,
    reach,
    engagement,
    clients,
  };
}

const nf = new Intl.NumberFormat("pt-BR");

export function DashboardMetricsGrid({
  posts,
  ready,
}: {
  posts: Post[];
  ready: boolean;
}) {
  const m = computeMetrics(posts);

  const cards = [
    { label: "Posts publicados", value: nf.format(m.published), icon: CheckCircle2, hint: "Total na biblioteca" },
    { label: "Posts agendados", value: nf.format(m.scheduled), icon: CalendarClock, hint: "Na fila do calendário" },
    { label: "Curtidas", value: nf.format(m.likes), icon: Heart, hint: "Somatório dos canais" },
    { label: "Comentários", value: nf.format(m.comments), icon: MessageCircle, hint: "Interações recebidas" },
    { label: "Crescimento", value: `+${m.growth.toFixed(1)}%`, icon: TrendingUp, hint: "Últimos 30 dias" },
    { label: "Alcance", value: nf.format(m.reach), icon: Eye, hint: "Contas alcançadas" },
    { label: "Engajamento", value: `${m.engagement.toFixed(1)}%`, icon: BarChart3, hint: "Interações / alcance" },
    { label: "Clientes", value: nf.format(m.clients), icon: Users, hint: "Perfis conectados" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.label} className="panel">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
            <c.icon className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl font-semibold">{ready ? c.value : "—"}</p>
            <p className="mt-1 text-xs text-muted-foreground">{c.hint}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
