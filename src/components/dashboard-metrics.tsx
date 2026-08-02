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

export function computeMetrics(posts: Post[], clientsCount: number): DashboardMetrics {
  const published = posts.filter((p) => p.status === "publicado");
  const scheduled = posts.filter((p) => p.status === "agendado");

  const likes = published.reduce((sum, p) => sum + 120 + (hash(p.id) % 880), 0);
  const comments = published.reduce((sum, p) => sum + 8 + (hash(p.title) % 92), 0);
  const reach = published.reduce((sum, p) => sum + 1500 + (hash(p.channel + p.id) % 12000), 0);
  const engagement = reach > 0 ? ((likes + comments) / reach) * 100 : 0;
  const growth = published.length * 2.4 + scheduled.length * 0.8;

  return {
    published: published.length,
    scheduled: scheduled.length,
    likes,
    comments,
    growth,
    reach,
    engagement,
    clients: clientsCount,
  };
}


const nf = new Intl.NumberFormat("pt-BR");

/** Barras determinísticas de tendência (visual, derivado do próprio valor). */
function spark(seed: string) {
  const h = hash(seed);
  return Array.from({ length: 7 }, (_, i) => 28 + ((h >> i) % 9) * 8);
}

export function DashboardMetricsGrid({
  posts,
  ready,
  clientsCount,
}: {
  posts: Post[];
  ready: boolean;
  clientsCount: number;
}) {
  const m = computeMetrics(posts, clientsCount);

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
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => (
        <article key={c.label} className="kpi-card p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              {c.label}
            </p>
            <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
              <c.icon className="size-3.5" />
            </span>
          </div>

          <p className="mt-3 font-display text-[30px] font-semibold leading-none tabular-nums">
            {ready ? c.value : "—"}
          </p>

          <div className="mt-3 flex items-end justify-between gap-3">
            <p className="min-w-0 truncate text-xs text-muted-foreground">{c.hint}</p>
            <div
              className="flex h-7 shrink-0 items-end gap-[3px]"
              aria-hidden="true"
            >
              {spark(c.label).map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${ready ? h : 12}%` }}
                  className="w-[3px] rounded-full bg-primary/45 transition-[height] duration-500"
                />
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

