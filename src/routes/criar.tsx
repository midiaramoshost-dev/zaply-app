import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { CalendarPlus, Copy, Loader2, Save, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { CHANNELS, CHANNEL_GUIDELINES, TONES, generateContent, type GeneratedIdea } from "@/lib/content.functions";
import { cn } from "@/lib/utils";
import { usePosts } from "@/lib/posts-store";

export const Route = createFileRoute("/criar")({
  head: () => ({
    meta: [
      { title: "Criar com IA — Zaply" },
      {
        name: "description",
        content:
          "Gere variações de posts prontos para Instagram, LinkedIn, X, blog e newsletter com IA.",
      },
      { property: "og:title", content: "Criar com IA — Zaply" },
      {
        property: "og:description",
        content: "Descreva o tema e receba conteúdo pronto para publicar em cada canal.",
      },
    ],
  }),
  component: CreatePage,
});

function CreatePage() {
  const generate = useServerFn(generateContent);
  const { addPost } = usePosts();

  const [topic, setTopic] = useState("");
  const [channels, setChannels] = useState<string[]>([CHANNELS[0]]);
  const [tone, setTone] = useState<string>(TONES[0]);
  const [variations, setVariations] = useState("1");
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [editingIdeas, setEditingIdeas] = useState<GeneratedIdea[]>([]);
  const [scheduleAt, setScheduleAt] = useState("");

  const toggleChannel = (c: string) =>
    setChannels((prev) =>
      prev.includes(c) ? (prev.length > 1 ? prev.filter((x) => x !== c) : prev) : [...prev, c],
    );

  const mutation = useMutation({
    mutationFn: () =>
      generate({
        data: { topic: topic.trim(), channels, tone, variations: Number(variations) },
      }),
    onSuccess: (result) => {
      setIdeas(result.ideas);
      setEditingIdeas(result.ideas);
      toast.success("Conteúdo gerado com sucesso.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function updateIdea(index: number, field: keyof GeneratedIdea, value: any) {
    setEditingIdeas((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }
  
  function removeIdea(index: number) {
    setEditingIdeas((prev) => prev.filter((_, i) => i !== index));
    setIdeas((prev) => prev.filter((_, i) => i !== index));
  }

  function save(idea: GeneratedIdea, schedule: boolean) {
    if (schedule && !scheduleAt) {
      toast.error("Escolha data e hora para agendar.");
      return;
    }
    addPost({
      title: idea.title,
      body: idea.cta ? `${idea.body}\n\n${idea.cta}` : idea.body,
      hashtags: idea.hashtags ?? [],
      channel: idea.channel,
      tone,
      status: schedule ? "agendado" : "rascunho",
      scheduledAt: schedule ? new Date(scheduleAt).toISOString() : null,
    });
    toast.success(schedule ? "Publicação agendada." : "Salvo na biblioteca.");
  }



  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold sm:text-3xl">Criar com IA</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Descreva o tema e o assistente escreve o conteúdo no formato de cada canal.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <Card className="panel h-fit">
          <CardHeader>
            <CardTitle className="text-base">Briefing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Tema ou objetivo</Label>
              <Textarea
                id="topic"
                rows={4}
                maxLength={500}
                placeholder="Ex.: lançamento do nosso plano anual com 20% de desconto"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Canais</Label>
              <div className="flex flex-wrap gap-2">
                {CHANNELS.map((c) => {
                  const active = channels.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleChannel(c)}
                      className={cn(
                        "rounded-full border border-border px-3 py-1.5 text-xs transition-colors",
                        active
                          ? "border-primary/60 bg-primary/15 text-primary"
                          : "text-muted-foreground hover:bg-surface",
                      )}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                {CHANNEL_GUIDELINES[channels[channels.length - 1]]}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tom de voz</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Variações por canal</Label>
                <Select value={variations} onValueChange={setVariations}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["1", "2", "3"].map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule">Agendar para</Label>
                <Input
                  id="schedule"
                  type="datetime-local"
                  value={scheduleAt}
                  onChange={(e) => setScheduleAt(e.target.value)}
                />
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={mutation.isPending || topic.trim().length < 3}
              onClick={() => {
                if (!topic.trim()) {
                  toast.error("Por favor, descreva um tema ou objetivo.");
                  return;
                }
                mutation.mutate();
              }}
            >
              {mutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              {mutation.isPending ? "Gerando..." : "Gerar conteúdo"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {ideas.length === 0 && !mutation.isPending && (
            <Card className="panel">
              <CardContent className="py-16 text-center text-sm text-muted-foreground">
                As variações geradas aparecem aqui.
              </CardContent>
            </Card>
          )}

          {mutation.isPending && (
            <Card className="panel">
              <CardContent className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Escrevendo variações para {channels.join(", ")}...
              </CardContent>
            </Card>
          )}

          {editingIdeas.map((idea, i) => (
            <Card key={`${idea.channel}-${i}`} className="panel">
              <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                <div className="flex-1 space-y-2">
                  <Input
                    value={idea.title}
                    onChange={(e) => updateIdea(i, "title", e.target.value)}
                    className="h-auto border-none bg-transparent p-0 text-base font-semibold focus-visible:ring-0"
                    placeholder="Título do post..."
                  />
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {idea.channel}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="size-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeIdea(i)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Legenda</Label>
                  <Textarea
                    value={idea.body}
                    onChange={(e) => updateIdea(i, "body", e.target.value)}
                    rows={6}
                    className="resize-none border-border/40 bg-surface/30 focus-visible:ring-primary/20"
                    placeholder="Escreva a legenda..."
                  />
                </div>

                {idea.cta !== undefined && (
                  <div className="rounded-lg border border-primary/40 bg-primary/5 p-3">
                    <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">CTA (Chamada para ação)</Label>
                    <Input
                      value={idea.cta}
                      onChange={(e) => updateIdea(i, "cta", e.target.value)}
                      className="mt-1 h-auto border-none bg-transparent p-0 text-sm font-medium focus-visible:ring-0"
                      placeholder="Ex: Clique no link da bio..."
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Hashtags</Label>
                  <Input
                    value={(idea.hashtags ?? []).join(" ")}
                    onChange={(e) => updateIdea(i, "hashtags", e.target.value.split(" ").filter(t => t.length > 0).map(t => t.replace("#", "")))}
                    className="h-auto border-none bg-transparent p-0 text-sm text-primary focus-visible:ring-0"
                    placeholder="hashtags separadas por espaço..."
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button size="sm" onClick={() => save(idea, false)} className="gap-2">
                    <Save className="size-4" />
                    Salvar rascunho
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => save(idea, true)} className="gap-2">
                    <CalendarPlus className="size-4" />
                    Agendar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-2"
                    onClick={() => {
                      void navigator.clipboard.writeText(
                        `${idea.title}\n\n${idea.body}${idea.cta ? `\n\n${idea.cta}` : ""}\n\n${(idea.hashtags ?? [])
                          .map((t) => `#${t}`)
                          .join(" ")}`,
                      );
                      toast.success("Copiado para a área de transferência.");
                    }}
                  >
                    <Copy className="size-4" />
                    Copiar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
