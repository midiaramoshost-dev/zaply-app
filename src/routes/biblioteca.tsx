import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Copy, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statusLabel, usePosts, type PostStatus } from "@/lib/posts-store";

export const Route = createFileRoute("/biblioteca")({
  head: () => ({
    meta: [
      { title: "Biblioteca de conteúdo — ContentFlow" },
      {
        name: "description",
        content:
          "Todos os rascunhos, agendamentos e publicações da sua marca organizados por canal e status.",
      },
      { property: "og:title", content: "Biblioteca de conteúdo — ContentFlow" },
      {
        property: "og:description",
        content: "Filtre por canal e status, edite o status e publique com um clique.",
      },
    ],
  }),
  component: LibraryPage,
});

const statuses: (PostStatus | "todos")[] = ["todos", "rascunho", "agendado", "publicado"];

function LibraryPage() {
  const { posts, ready, updatePost, removePost } = usePosts();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<PostStatus | "todos">("todos");

  const filtered = useMemo(
    () =>
      posts.filter((p) => {
        const matchStatus = status === "todos" || p.status === status;
        const q = query.trim().toLowerCase();
        const matchQuery =
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.body.toLowerCase().includes(q) ||
          p.channel.toLowerCase().includes(q);
        return matchStatus && matchQuery;
      }),
    [posts, status, query],
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold sm:text-3xl">Biblioteca</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Todo o conteúdo da operação em um só lugar.
        </p>
      </header>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Buscar por título, texto ou canal"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-sm"
        />
        <Select value={status} onValueChange={(v) => setStatus(v as PostStatus | "todos")}>
          <SelectTrigger className="sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "todos" ? "Todos os status" : statusLabel[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {ready && filtered.length === 0 && (
        <Card className="panel">
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            Nenhum conteúdo encontrado com esses filtros.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((post) => (
          <Card key={post.id} className="panel">
            <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
              <CardTitle className="text-base leading-snug">{post.title}</CardTitle>
              <Badge
                variant={post.status === "publicado" ? "default" : "secondary"}
                className="shrink-0"
              >
                {statusLabel[post.status]}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline">{post.channel}</Badge>
                <span>{post.tone}</span>
                {post.scheduledAt && (
                  <span>
                    ·{" "}
                    {new Date(post.scheduledAt).toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                )}
              </div>
              <p className="line-clamp-4 whitespace-pre-line text-sm text-muted-foreground">
                {post.body}
              </p>
              <div className="flex flex-wrap gap-2">
                {post.status !== "publicado" && (
                  <Button
                    size="sm"
                    onClick={() => {
                      updatePost(post.id, { status: "publicado" });
                      toast.success("Conteúdo marcado como publicado.");
                    }}
                  >
                    <CheckCircle2 className="size-4" />
                    Publicar agora
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    void navigator.clipboard.writeText(`${post.title}\n\n${post.body}`);
                    toast.success("Copiado.");
                  }}
                >
                  <Copy className="size-4" />
                  Copiar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => {
                    removePost(post.id);
                    toast.success("Conteúdo removido.");
                  }}
                >
                  <Trash2 className="size-4" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
