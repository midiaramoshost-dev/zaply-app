import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, Loader2, MessageCircle, Plus, Send, Sparkles, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useClients } from "@/lib/clients-store";
import { useComments, type Comment, type Sentiment } from "@/lib/comments-store";
import { generateCommentReply } from "@/lib/comments.functions";

export const Route = createFileRoute("/comentarios")({
  head: () => ({
    meta: [
      { title: "Comentários com IA — ContentFlow" },
      {
        name: "description",
        content:
          "A IA lê os comentários das suas redes e sugere respostas usando o tom de voz, o endereço e os dados cadastrados do cliente.",
      },
      { property: "og:title", content: "Comentários com IA — ContentFlow" },
      {
        property: "og:description",
        content: "Respostas automáticas para dúvidas de preço, localização e atendimento.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CommentsPage,
});

const CHANNELS = ["Instagram", "Facebook", "LinkedIn", "X"] as const;

type FilterKey = "todos" | "nao_respondidos" | "positivos" | "negativos" | "spam";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "nao_respondidos", label: "Não respondidos" },
  { key: "positivos", label: "Positivos" },
  { key: "negativos", label: "Negativos" },
  { key: "spam", label: "Spam" },
];

const SENTIMENT_STYLE: Record<string, string> = {
  positivo: "border-emerald-500/40 text-emerald-400",
  negativo: "border-rose-500/40 text-rose-400",
  spam: "border-amber-500/40 text-amber-400",
  neutro: "border-border text-muted-foreground",
};

function matchesFilter(comment: Comment, filter: FilterKey) {
  if (filter === "todos") return true;
  if (filter === "nao_respondidos") return !comment.replied;
  if (filter === "positivos") return comment.sentiment === "positivo";
  if (filter === "negativos") return comment.sentiment === "negativo";
  return comment.sentiment === "spam";
}

function CommentsPage() {
  const reply = useServerFn(generateCommentReply);
  const { comments, ready, addComment, updateComment, removeComment } = useComments();
  const { clients } = useClients();

  const [clientId, setClientId] = useState<string>("");
  const [autoReply, setAutoReply] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [newComment, setNewComment] = useState({
    author: "",
    text: "",
    channel: "Instagram",
    postTitle: "",
  });

  const client = useMemo(
    () => clients.find((c) => c.id === clientId) ?? clients[0],
    [clients, clientId],
  );

  const [filter, setFilter] = useState<FilterKey>("todos");

  const counts = useMemo(
    () => ({
      todos: comments.length,
      nao_respondidos: comments.filter((c) => !c.replied).length,
      positivos: comments.filter((c) => c.sentiment === "positivo").length,
      negativos: comments.filter((c) => c.sentiment === "negativo").length,
      spam: comments.filter((c) => c.sentiment === "spam").length,
    }),
    [comments],
  );

  const visible = useMemo(
    () => comments.filter((c) => matchesFilter(c, filter)),
    [comments, filter],
  );

  const pending = comments.filter((c) => !c.replied);

  const runAi = async (comment: Comment) => {
    setBusy(comment.id);
    try {
      const result = await reply({
        data: {
          comment: comment.text,
          author: comment.author,
          channel: comment.channel,
          postTitle: comment.postTitle,
          brandName: client?.name,
          tone: client?.tone,
          address: client?.address,
          contact: client?.contact,
          bannedWords: client?.bannedWords,
        },
      });
      updateComment(comment.id, {
        reply: result.reply,
        intent: result.intent,
        needsHuman: result.needsHuman,
        replied: autoReply && !result.needsHuman ? true : comment.replied,
      });
      toast.success(
        autoReply && !result.needsHuman ? "Resposta gerada e publicada" : "Resposta sugerida",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível gerar a resposta agora.",
      );
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Comentários com IA</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          A IA lê cada comentário e escreve a resposta no tom da marca — usando o endereço e o
          contato cadastrados no cliente.
        </p>
      </header>

      <Card className="glass-panel">
        <CardContent className="flex flex-wrap items-end gap-4 py-4">
          <div className="min-w-[220px] space-y-1.5">
            <Label>Responder como</Label>
            <Select value={client?.id ?? ""} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="min-w-[220px] flex-1 text-xs text-muted-foreground">
            {client?.address
              ? `Endereço usado nas respostas: ${client.address}`
              : "Cadastre o endereço do cliente para respostas de localização."}
          </p>
          <div className="flex items-center gap-2">
            <Label htmlFor="auto-reply" className="text-sm">
              Resposta automática
            </Label>
            <Switch id="auto-reply" checked={autoReply} onCheckedChange={setAutoReply} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Caixa de entrada</CardTitle>
            <Badge variant="secondary">{pending.length} sem resposta</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <Button
                  key={f.key}
                  size="sm"
                  variant={filter === f.key ? "default" : "outline"}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                  <span className="ml-1.5 text-[11px] opacity-70">{counts[f.key]}</span>
                </Button>
              ))}
            </div>

            {ready && visible.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhum comentário neste filtro.
              </p>
            )}
            {visible.map((comment) => (
              <div
                key={comment.id}
                className="rounded-xl border border-border/60 bg-background/40 p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <MessageCircle className="size-4 text-primary" />
                  <span className="text-sm font-medium">{comment.author || "Anônimo"}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {comment.channel}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${SENTIMENT_STYLE[comment.sentiment ?? "neutro"]}`}
                  >
                    {comment.sentiment ?? "neutro"}
                  </Badge>
                  {comment.intent && (
                    <Badge variant="secondary" className="text-[10px]">
                      {comment.intent}
                    </Badge>
                  )}
                  {comment.needsHuman && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-400">
                      <AlertTriangle className="size-3" /> revisar
                    </span>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="ml-auto"
                    aria-label="Remover comentário"
                    onClick={() => removeComment(comment.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                {comment.postTitle && (
                  <p className="mt-1 text-[11px] text-muted-foreground">em “{comment.postTitle}”</p>
                )}
                <p className="mt-2 text-sm">{comment.text}</p>

                {comment.reply && (
                  <div className="mt-3 rounded-lg border border-primary/30 bg-primary/5 p-2.5">
                    <p className="mb-1 text-[11px] font-medium text-primary">Resposta da IA</p>
                    <Textarea
                      rows={2}
                      value={comment.reply}
                      onChange={(e) => updateComment(comment.id, { reply: e.target.value })}
                    />
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={comment.reply ? "outline" : "default"}
                    disabled={busy === comment.id}
                    onClick={() => runAi(comment)}
                  >
                    {busy === comment.id ? (
                      <Loader2 className="mr-1.5 size-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-1.5 size-4" />
                    )}
                    {comment.reply ? "Gerar outra" : "Responder com IA"}
                  </Button>
                  {comment.reply && !comment.replied && (
                    <Button
                      size="sm"
                      onClick={() => {
                        updateComment(comment.id, { replied: true });
                        toast.success("Resposta publicada");
                      }}
                    >
                      <Send className="mr-1.5 size-4" /> Publicar resposta
                    </Button>
                  )}
                  {comment.replied && (
                    <Badge variant="secondary" className="self-center">
                      respondido
                    </Badge>
                  )}
                  <Select
                    value={comment.sentiment ?? "neutro"}
                    onValueChange={(value) =>
                      updateComment(comment.id, { sentiment: value as Sentiment })
                    }
                  >
                    <SelectTrigger className="ml-auto h-8 w-[130px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(["positivo", "negativo", "spam", "neutro"] as Sentiment[]).map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-panel h-fit">
          <CardHeader>
            <CardTitle className="text-base">Simular novo comentário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="c-author">Quem comentou</Label>
              <Input
                id="c-author"
                value={newComment.author}
                onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                placeholder="Nome do seguidor"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Canal</Label>
              <Select
                value={newComment.channel}
                onValueChange={(channel) => setNewComment({ ...newComment, channel })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHANNELS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-post">Post</Label>
              <Input
                id="c-post"
                value={newComment.postTitle}
                onChange={(e) => setNewComment({ ...newComment, postTitle: e.target.value })}
                placeholder="Título do post comentado"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-text">Comentário</Label>
              <Textarea
                id="c-text"
                rows={3}
                value={newComment.text}
                onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                placeholder="Quanto custa?"
              />
            </div>
            <Button
              className="w-full"
              onClick={() => {
                if (!newComment.text.trim()) {
                  toast.error("Escreva o comentário.");
                  return;
                }
                addComment({ ...newComment, text: newComment.text.trim() });
                setNewComment({ author: "", text: "", channel: newComment.channel, postTitle: "" });
                toast.success("Comentário adicionado à caixa.");
              }}
            >
              <Plus className="mr-1.5 size-4" /> Adicionar comentário
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
