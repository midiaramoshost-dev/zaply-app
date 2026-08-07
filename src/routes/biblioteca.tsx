import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Copy, FolderOpen, Pencil, Trash2 } from "lucide-react";
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
import {
  POST_CATEGORIES,
  categoryLabel,
  inferCategory,
  statusLabel,
  usePosts,
  type Post,
  type PostCategory,
  type PostStatus,
} from "@/lib/posts-store";
import { PostEditorDialog } from "@/components/post-editor-dialog";

export const Route = createFileRoute("/biblioteca")({
  head: () => ({
    meta: [
      { title: "Biblioteca de conteúdo — Zaply" },
      {
        name: "description",
        content:
          "Conteúdo organizado por produtos, promoções, datas, vídeos, logos, stories e reels — com filtros por canal e status.",
      },
      { property: "og:title", content: "Biblioteca de conteúdo — Zaply" },
      {
        property: "og:description",
        content: "Pastas por produtos, promoções, datas, vídeos, logos, stories e reels.",
      },
    ],
  }),
  component: LibraryPage,
});

const statuses: (PostStatus | "todos")[] = ["todos", "rascunho", "agendado", "publicado"];

function categoryOf(post: Post): PostCategory {
  return post.category ?? inferCategory(post);
}

function LibraryPage() {
  const { posts, ready, updatePost, removePost } = usePosts();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<PostStatus | "todos">("todos");
  const [category, setCategory] = useState<PostCategory | "todas">("todas");
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const filtered = useMemo(
    () =>
      posts.filter((p) => {
        const matchStatus = status === "todos" || p.status === status;
        const matchCategory = category === "todas" || categoryOf(p) === category;
        const q = query.trim().toLowerCase();
        const matchQuery =
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.body.toLowerCase().includes(q) ||
          p.channel.toLowerCase().includes(q);
        return matchStatus && matchCategory && matchQuery;
      }),
    [posts, status, category, query],
  );

  const counts = useMemo(() => {
    const map = new Map<PostCategory, number>();
    posts.forEach((p) => {
      const key = categoryOf(p);
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return map;
  }, [posts]);

  const groups = useMemo(
    () =>
      POST_CATEGORIES.map((c) => ({
        ...c,
        items: filtered.filter((p) => categoryOf(p) === c.id),
      })).filter((g) => g.items.length > 0),
    [filtered],
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

      <div className="mb-8 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={category === "todas" ? "default" : "outline"}
          onClick={() => setCategory("todas")}
        >
          Todas
          <Badge variant="secondary" className="ml-1.5">
            {posts.length}
          </Badge>
        </Button>
        {POST_CATEGORIES.map((c) => (
          <Button
            key={c.id}
            size="sm"
            variant={category === c.id ? "default" : "outline"}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
            <Badge variant="secondary" className="ml-1.5">
              {counts.get(c.id) ?? 0}
            </Badge>
          </Button>
        ))}
      </div>

      {ready && filtered.length === 0 && (
        <Card className="panel">
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            Nenhum conteúdo encontrado com esses filtros.
          </CardContent>
        </Card>
      )}

      <div className="space-y-10">
        {groups.map((group) => (
          <section key={group.id} className="space-y-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="size-4 text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-wide">{group.label}</h2>
              <Badge variant="secondary">{group.items.length}</Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {group.items.map((post) => (
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
                      <Badge variant="outline">{categoryLabel[categoryOf(post)]}</Badge>
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
                    <div className="flex flex-wrap items-center gap-2">
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
                      <Select
                        value={categoryOf(post)}
                        onValueChange={(v) => {
                          updatePost(post.id, { category: v as PostCategory });
                          toast.success("Pasta atualizada.");
                        }}
                      >
                        <SelectTrigger className="h-8 w-[140px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {POST_CATEGORIES.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingPost(post)}
                      >
                        <Pencil className="size-4" />
                        Editar
                      </Button>
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
          </section>
        ))}
      </div>

      <PostEditorDialog
        open={!!editingPost}
        onOpenChange={(open) => !open && setEditingPost(null)}
        post={editingPost}
        onSave={(id, updates) => {
          updatePost(id, updates);
          toast.success("Conteúdo atualizado com sucesso.");
          setEditingPost(null);
        }}
      />
    </div>
  );
}

