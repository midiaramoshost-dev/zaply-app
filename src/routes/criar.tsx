import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { CalendarPlus, Copy, Loader2, Save, Sparkles } from "lucide-react";
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
import { CHANNELS, TONES, generateContent, type GeneratedIdea } from "@/lib/content.functions";
import { usePosts } from "@/lib/posts-store";

export const Route = createFileRoute("/criar")({
  head: () => ({
    meta: [
      { title: "Criar com IA — ContentFlow" },
      {
        name: "description",
        content:
          "Gere variações de posts prontos para Instagram, LinkedIn, X, blog e newsletter com IA.",
      },
      { property: "og:title", content: "Criar com IA — ContentFlow" },
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
      toast.success("Conteúdo gerado com sucesso.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function save(idea: GeneratedIdea, schedule: boolean) {
    if (schedule && !scheduleAt) {
      toast.error("Escolha data e hora para agendar.");
      return;
    }
    addPost({
      title: idea.title,
      body: idea.body,
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
                <Label>Variações</Label>
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
              onClick={() => mutation.mutate()}
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
                Escrevendo variações para {channel}...
              </CardContent>
            </Card>
          )}

          {ideas.map((idea, i) => (
            <Card key={`${idea.title}-${i}`} className="panel">
              <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                <CardTitle className="text-base leading-snug">{idea.title}</CardTitle>
                <Badge variant="secondary" className="shrink-0">
                  {channel}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="whitespace-pre-line text-sm text-muted-foreground">{idea.body}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(idea.hashtags ?? []).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[11px]">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => save(idea, false)}>
                    <Save className="size-4" />
                    Salvar rascunho
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => save(idea, true)}>
                    <CalendarPlus className="size-4" />
                    Agendar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      void navigator.clipboard.writeText(
                        `${idea.title}\n\n${idea.body}\n\n${(idea.hashtags ?? [])
                          .map((t) => `#${t}`)
                          .join(" ")}`,
                      );
                      toast.success("Copiado.");
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
