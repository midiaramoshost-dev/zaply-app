import { createFileRoute } from "@tanstack/react-router";
import { Ban, CheckCircle2, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { usePosts, type Post } from "@/lib/posts-store";
import {
  PUBLISH_TARGETS,
  targetForChannel,
  useChannelConnections,
} from "@/lib/publishing";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/publicacao")({
  head: () => ({
    meta: [
      { title: "Publicação nas redes — Zaply" },
      {
        name: "description",
        content:
          "Publique no Instagram (feed, carrossel, reels), página do Facebook, perfil e empresa no LinkedIn e tweets no X.",
      },
      { property: "og:title", content: "Publicação nas redes — Zaply" },
      {
        property: "og:description",
        content: "Escolha o destino e o formato de cada post antes de publicar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PublishPage,
});

function PublishPage() {
  const { posts, ready, updatePost } = usePosts();
  const { connections, toggleConnection } = useChannelConnections();

  const queue = useMemo(
    () =>
      posts.filter(
        (p) => p.status !== "publicado" && p.status !== "cancelado" && targetForChannel(p.channel),
      ),
    [posts],
  );

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Publicação</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Cada rede tem seus destinos e formatos. Ative a conexão, escolha o formato e publique.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {PUBLISH_TARGETS.map((target) => {
          const connected = !!connections[target.channel];
          return (
            <Card key={target.channel} className="glass-panel">
              <CardHeader className="space-y-1 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{target.channel}</CardTitle>
                  <Switch
                    checked={connected}
                    onCheckedChange={(v) => {
                      toggleConnection(target.channel, v);
                      toast(v ? `${target.channel} conectado` : `${target.channel} desconectado`);
                    }}
                    aria-label={`Conectar ${target.channel}`}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{target.destination}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {target.formats.map((f) => (
                  <div
                    key={f.id}
                    className={cn(
                      "rounded-lg border border-border/60 bg-background/40 p-2.5",
                      !f.supported && "opacity-60",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{f.label}</span>
                      {f.supported ? (
                        <Badge variant="secondary" className="text-[10px]">
                          Disponível
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 text-[10px]">
                          <Ban className="size-3" /> Em breve
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{f.hint}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-base">Fila de publicação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ready && queue.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nada na fila. Gere conteúdo em “Criar com IA” e aprove em “Aprovação”.
            </p>
          )}
          {queue.map((post) => (
            <QueueRow
              key={post.id}
              post={post}
              connected={!!connections[post.channel]}
              onChange={(patch) => updatePost(post.id, patch)}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function QueueRow({
  post,
  connected,
  onChange,
}: {
  post: Post;
  connected: boolean;
  onChange: (patch: Partial<Post>) => void;
}) {
  const target = targetForChannel(post.channel)!;
  const [format, setFormat] = useState(
    post.format ?? target.formats.find((f) => f.supported)?.id ?? target.formats[0].id,
  );
  const selected = target.formats.find((f) => f.id === format);
  const blocked = !connected || !post.approved || !selected?.supported;

  const publish = () => {
    onChange({ format, status: "publicado" });
    toast.success(`Publicado no ${post.channel} · ${selected?.label}`);
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-background/40 p-3 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-[10px]">
            {post.channel}
          </Badge>
          <span className="text-[11px] text-muted-foreground">{target.destination}</span>
          {post.approved ? (
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
              <CheckCircle2 className="size-3" /> aprovado
            </span>
          ) : (
            <span className="text-[11px] text-amber-400">aguardando aprovação</span>
          )}
        </div>
        <p className="truncate text-sm font-medium">{post.title}</p>
      </div>

      <div className="flex items-center gap-2">
        <Label className="sr-only" htmlFor={`fmt-${post.id}`}>
          Formato
        </Label>
        <Select value={format} onValueChange={setFormat}>
          <SelectTrigger id={`fmt-${post.id}`} className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {target.formats.map((f) => (
              <SelectItem key={f.id} value={f.id} disabled={!f.supported}>
                {f.label}
                {!f.supported ? " (em breve)" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="sm" disabled={blocked} onClick={publish}>
          <Send className="mr-1.5 size-4" /> Publicar
        </Button>
      </div>
    </div>
  );
}
