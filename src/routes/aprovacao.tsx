import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  RotateCcw,
  Send,
  Sparkles,
  XCircle,
  Pencil,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAutopilot } from "@/lib/autopilot-store";
import { usePosts, type Post } from "@/lib/posts-store";
import { PostEditorDialog } from "@/components/post-editor-dialog.tsx";

export const Route = createFileRoute("/aprovacao")({
  head: () => ({
    meta: [
      { title: "Aprovação de conteúdo — Zaply" },
      {
        name: "description",
        content:
          "Fluxo de aprovação: a IA gera, o cliente aprova e o post vai para publicação manual ou automática.",
      },
      { property: "og:title", content: "Aprovação de conteúdo — Zaply" },
      {
        property: "og:description",
        content: "Aprove, reprove e publique conteúdos gerados por IA em um fluxo único.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ApprovalPage,
});

function fmt(date: string | null) {
  if (!date) return "sem data";
  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ApprovalPage() {
  const { posts, ready, updatePost } = usePosts();
  const { autopilot, setAutopilot } = useAutopilot();
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const { generated, approved, published } = useMemo(() => {
    const active = posts.filter((p) => p.status !== "cancelado");
    return {
      generated: active.filter((p) => p.status !== "publicado" && !p.approved),
      approved: active.filter((p) => p.status !== "publicado" && p.approved),
      published: active.filter((p) => p.status === "publicado"),
    };
  }, [posts]);

  const approve = (post: Post) => {
    if (autopilot) {
      updatePost(post.id, { approved: true, status: "publicado" });
      toast.success("Aprovado e publicado automaticamente");
      return;
    }
    updatePost(post.id, { approved: true });
    toast.success("Aprovado pelo cliente");
  };

  const reject = (post: Post) => {
    updatePost(post.id, { approved: false, status: "rascunho" });
    toast("Devolvido para ajustes");
  };

  const publish = (post: Post) => {
    updatePost(post.id, { status: "publicado" });
    toast.success("Publicado");
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Aprovação</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          IA gera → cliente aprova → publicar. Com a publicação automática ligada, tudo que for
          aprovado sai no ar na hora.
        </p>
      </header>

      <Card className="glass-panel">
        <CardContent className="flex flex-wrap items-center gap-3 py-4 text-xs text-muted-foreground sm:text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-primary">
            <Sparkles className="size-3.5" /> IA gerou
          </span>
          <ArrowRight className="size-4" />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-accent">
            <BadgeCheck className="size-3.5" /> Cliente aprova
          </span>
          <ArrowRight className="size-4" />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-400">
            <Send className="size-3.5" /> Publicar
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Label htmlFor="autopilot-approval" className="text-sm text-foreground">
              Publicação automática
            </Label>
            <Switch id="autopilot-approval" checked={autopilot} onCheckedChange={setAutopilot} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Column
          title="Gerado pela IA"
          count={generated.length}
          empty="Nada aguardando aprovação."
          ready={ready}
        >
          {generated.map((post) => (
            <PostRow key={post.id} post={post}>
              <div className="flex w-full gap-2">
                <Button size="sm" className="flex-1" onClick={() => approve(post)}>
                  <CheckCircle2 className="mr-1.5 size-4" /> Aprovar
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditingPost(post)}>
                  <Pencil className="size-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => reject(post)}>
                  <XCircle className="size-4" />
                </Button>
              </div>
            </PostRow>
          ))}
        </Column>

        <Column
          title="Aprovado pelo cliente"
          count={approved.length}
          empty="Nenhum conteúdo aprovado no momento."
          ready={ready}
        >
          {approved.map((post) => (
            <PostRow key={post.id} post={post}>
              <Button size="sm" className="flex-1" onClick={() => publish(post)}>
                <Send className="mr-1.5 size-4" /> Publicar
              </Button>
              <Button size="sm" variant="outline" onClick={() => reject(post)}>
                <RotateCcw className="size-4" />
              </Button>
            </PostRow>
          ))}
        </Column>

        <Column
          title="Publicado"
          count={published.length}
          empty="Ainda sem publicações."
          ready={ready}
        >
          {published.map((post) => (
            <PostRow key={post.id} post={post}>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => updatePost(post.id, { status: "rascunho", approved: false })}
              >
                <RotateCcw className="mr-1.5 size-4" /> Voltar ao fluxo
              </Button>
            </PostRow>
          ))}
        </Column>
      </div>

      <PostEditorDialog
        post={editingPost}
        open={!!editingPost}
        onOpenChange={(open) => !open && setEditingPost(null)}
        onSave={(id, updates) => {
          updatePost(id, updates);
          toast.success("Conteúdo atualizado");
        }}
      />
    </div>
  );
}

function Column({
  title,
  count,
  empty,
  ready,
  children,
}: {
  title: string;
  count: number;
  empty: string;
  ready: boolean;
  children: React.ReactNode;
}) {
  return (
    <Card className="glass-panel">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">{title}</CardTitle>
        <Badge variant="secondary">{count}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {ready && count === 0 ? (
          <p className="text-sm text-muted-foreground">{empty}</p>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

function PostRow({ post, children }: { post: Post; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3">
      <div className="mb-1 flex items-center gap-2">
        <Badge variant="outline" className="text-[10px]">
          {post.channel}
        </Badge>
        <span className="text-[11px] text-muted-foreground">{fmt(post.scheduledAt)}</span>
      </div>
      <p className="line-clamp-2 text-sm font-medium">{post.title}</p>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{post.body}</p>
      <div className="mt-3 flex gap-2">{children}</div>
    </div>
  );
}
