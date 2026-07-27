import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Rocket } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PostDayCard } from "@/components/post-day-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { statusLabel, usePosts } from "@/lib/posts-store";


export const Route = createFileRoute("/calendario")({
  head: () => ({
    meta: [
      { title: "Calendário editorial — ContentFlow" },
      {
        name: "description",
        content:
          "Veja o calendário de publicações agendadas por dia e ative a publicação automática.",
      },
      { property: "og:title", content: "Calendário editorial — ContentFlow" },
      {
        property: "og:description",
        content: "Planeje o mês inteiro e deixe a publicação acontecer no horário certo.",
      },
    ],
  }),
  component: CalendarPage,
});

const WEEKDAYS = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"];

function sameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

function buildMonthGrid(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  // segunda = 0 ... domingo = 6
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - offset);

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function CalendarPage() {
  const { posts, updatePost } = usePosts();
  const [date, setDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [autopilot, setAutopilot] = useState(true);

  const scheduled = posts.filter((p) => p.scheduledAt);
  const days = useMemo(() => buildMonthGrid(month), [month]);
  const today = new Date();

  const postsByDay = useMemo(() => {
    const map = new Map<string, typeof scheduled>();
    for (const p of scheduled) {
      const d = new Date(p.scheduledAt as string);
      if (Number.isNaN(d.getTime())) continue;
      const key = d.toDateString();
      map.set(key, [...(map.get(key) ?? []), p]);
    }
    return map;
  }, [posts]);

  const dayPosts = (postsByDay.get(date.toDateString()) ?? []).slice().sort(
    (a, b) =>
      new Date(a.scheduledAt as string).getTime() -
      new Date(b.scheduledAt as string).getTime(),
  );

  const shiftMonth = (delta: number) =>
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Calendário editorial</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visual mensal das publicações — clique em um dia para ver os detalhes.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2.5">
          <Rocket className="size-4 text-accent" />
          <Label htmlFor="autopilot" className="text-sm">
            Publicação automática
          </Label>
          <Switch id="autopilot" checked={autopilot} onCheckedChange={setAutopilot} />
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <Card className="panel">
          <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
            <CardTitle className="text-base capitalize">
              {month.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="outline"
                aria-label="Mês anterior"
                onClick={() => shiftMonth(-1)}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const now = new Date();
                  setMonth(new Date(now.getFullYear(), now.getMonth(), 1));
                  setDate(now);
                }}
              >
                Hoje
              </Button>
              <Button
                size="icon"
                variant="outline"
                aria-label="Próximo mês"
                onClick={() => shiftMonth(1)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 border-b border-border/60 pb-2 text-center text-[11px] font-semibold tracking-wider text-muted-foreground">
              {WEEKDAYS.map((w) => (
                <div key={w}>{w}</div>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
              {days.map((d) => {
                const inMonth = d.getMonth() === month.getMonth();
                const items = postsByDay.get(d.toDateString()) ?? [];
                const selected = sameDay(d, date);
                return (
                  <button
                    key={d.toISOString()}
                    type="button"
                    onClick={() => setDate(d)}
                    className={cn(
                      "flex min-h-20 flex-col gap-1 rounded-lg border border-transparent p-1.5 text-left transition-colors hover:border-border hover:bg-surface/70",
                      !inMonth && "opacity-40",
                      selected && "border-primary/60 bg-primary/10",
                    )}
                  >
                    <span
                      className={cn(
                        "text-xs font-medium tabular-nums",
                        sameDay(d, today) && "text-accent",
                      )}
                    >
                      {String(d.getDate()).padStart(2, "0")}
                    </span>
                    <span className="flex flex-col gap-0.5">
                      {items.slice(0, 2).map((p) => (
                        <span
                          key={p.id}
                          className="truncate rounded bg-primary/15 px-1 py-0.5 text-[10px] text-primary"
                        >
                          {p.title}
                        </span>
                      ))}
                      {items.length > 2 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{items.length - 2}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>


        <Card className="panel">
          <CardHeader>
            <CardTitle className="text-base">
              {date
                ? date.toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                  })
                : "Selecione um dia"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dayPosts.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhuma publicação para este dia.
              </p>
            )}
            {dayPosts.map((post) => (
              <PostDayCard key={post.id} post={post} onUpdate={updatePost} />
            ))}

            {autopilot && dayPosts.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Com a publicação automática ativa, estes itens saem no horário definido.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
