import { createFileRoute } from "@tanstack/react-router";
import { Rocket } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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

function sameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

function CalendarPage() {
  const { posts, updatePost } = usePosts();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [autopilot, setAutopilot] = useState(true);

  const scheduled = posts.filter((p) => p.scheduledAt);
  const scheduledDays = scheduled
    .map((p) => new Date(p.scheduledAt as string))
    .filter((d) => !Number.isNaN(d.getTime()));

  const dayPosts = date
    ? scheduled.filter((p) => sameDay(new Date(p.scheduledAt as string), date))
    : [];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Calendário editorial</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Planeje as datas e acompanhe o que sai em cada dia.
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

      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <Card className="panel w-fit">
          <CardContent className="p-3">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              modifiers={{ scheduled: scheduledDays }}
              modifiersClassNames={{
                scheduled: "relative font-semibold text-primary",
              }}
              className={cn("p-3 pointer-events-auto")}
            />
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
              <div
                key={post.id}
                className="rounded-xl border border-border/70 bg-surface/60 p-4"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary">{post.channel}</Badge>
                  <span>
                    {new Date(post.scheduledAt as string).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <Badge variant="outline">{statusLabel[post.status]}</Badge>
                </div>
                <p className="mt-2 text-sm font-medium">{post.title}</p>
                <p className="mt-1 line-clamp-2 whitespace-pre-line text-sm text-muted-foreground">
                  {post.body}
                </p>
                {post.status !== "publicado" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3"
                    onClick={() => {
                      updatePost(post.id, { status: "publicado" });
                      toast.success("Publicado.");
                    }}
                  >
                    Publicar agora
                  </Button>
                )}
              </div>
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
