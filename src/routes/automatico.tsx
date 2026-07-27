import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  CalendarDays,
  Check,
  ImageIcon,
  Loader2,
  Sparkles,
  Type,
  Wand2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CHANNELS, TONES } from "@/lib/content.functions";
import { generateCaptions, generateIdeas, type PlanCaption } from "@/lib/plan.functions";
import { usePosts } from "@/lib/posts-store";
import { streamImage } from "@/lib/stream-image";

export const Route = createFileRoute("/automatico")({
  head: () => ({
    meta: [
      { title: "Calendário automático — ContentFlow" },
      {
        name: "description",
        content:
          "Diga o seu nicho e a IA gera 30 ideias, 30 legendas, 30 imagens e agenda o mês inteiro automaticamente.",
      },
      { property: "og:title", content: "Calendário automático — ContentFlow" },
      {
        property: "og:description",
        content: "Do nicho ao mês agendado em quatro etapas automáticas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AutoCalendarPage,
});

type PlanItem = PlanCaption & { imageUrl?: string };

const TOTAL = 30;
const BATCH = 10;

function AutoCalendarPage() {
  const ideasFn = useServerFn(generateIdeas);
  const captionsFn = useServerFn(generateCaptions);
  const { addPost } = usePosts();

  const [profile, setProfile] = useState("Sou dentista.");
  const [channel, setChannel] = useState<string>("Instagram");
  const [tone, setTone] = useState<string>("Educativo");
  const [startDate, setStartDate] = useState(() =>
    new Date(Date.now() + 86400000).toISOString().slice(0, 10),
  );
  const [time, setTime] = useState("09:00");
  const [imageCount, setImageCount] = useState("10");

  const [ideas, setIdeas] = useState<string[]>([]);
  const [items, setItems] = useState<PlanItem[]>([]);
  const [step, setStep] = useState<null | "ideias" | "legendas" | "imagens" | "agenda">(null);
  const [progress, setProgress] = useState(0);
  const [scheduled, setScheduled] = useState(0);

  const busy = step !== null;

  const runIdeas = async () => {
    if (profile.trim().length < 3) {
      toast.error("Conte o que você faz (ex.: Sou dentista).");
      return;
    }
    setStep("ideias");
    setProgress(0);
    setIdeas([]);
    setItems([]);
    setScheduled(0);
    try {
      const result = await ideasFn({
        data: { profile: profile.trim(), count: TOTAL, channel, tone },
      });
      setIdeas(result.ideas);
      setProgress(100);
      toast.success(`${result.ideas.length} ideias geradas.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao gerar as ideias.");
    } finally {
      setStep(null);
    }
  };

  const runCaptions = async () => {
    setStep("legendas");
    setProgress(0);
    const collected: PlanItem[] = [];
    try {
      for (let i = 0; i < ideas.length; i += BATCH) {
        const titles = ideas.slice(i, i + BATCH);
        const result = await captionsFn({
          data: { profile: profile.trim(), channel, tone, titles },
        });
        collected.push(...result.captions);
        setItems([...collected]);
        setProgress(Math.round((collected.length / ideas.length) * 100));
      }
      toast.success(`${collected.length} legendas prontas.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao gerar as legendas.");
    } finally {
      setStep(null);
    }
  };

  const runImages = async () => {
    const limit = Math.min(Number(imageCount) || 0, items.length);
    if (limit === 0) {
      toast.error("Escolha quantas imagens gerar.");
      return;
    }
    setStep("imagens");
    setProgress(0);
    let done = 0;
    for (let i = 0; i < limit; i++) {
      try {
        await streamImage(
          `${items[i].imagePrompt}. Clean professional social media image, no text.`,
          (dataUrl, isFinal) => {
            if (!isFinal) return;
            setItems((prev) =>
              prev.map((item, index) => (index === i ? { ...item, imageUrl: dataUrl } : item)),
            );
          },
        );
        done += 1;
      } catch {
        /* segue para a próxima imagem */
      }
      setProgress(Math.round(((i + 1) / limit) * 100));
    }
    setStep(null);
    toast[done > 0 ? "success" : "error"](
      done > 0 ? `${done} imagens geradas.` : "Não foi possível gerar as imagens agora.",
    );
  };

  const runSchedule = () => {
    setStep("agenda");
    const [hour, minute] = time.split(":").map(Number);
    let saved = 0;
    let droppedImages = false;

    items.forEach((item, index) => {
      const date = new Date(`${startDate}T00:00:00`);
      date.setDate(date.getDate() + index);
      date.setHours(hour || 9, minute || 0, 0, 0);

      const base = {
        title: item.title,
        body: item.cta ? `${item.body}\n\n${item.cta}` : item.body,
        hashtags: item.hashtags,
        channel,
        tone,
        status: "agendado" as const,
        scheduledAt: date.toISOString(),
        approved: false,
      };

      try {
        addPost({ ...base, imageUrl: item.imageUrl ?? null });
        saved += 1;
      } catch {
        try {
          addPost({ ...base, imageUrl: null });
          saved += 1;
          droppedImages = true;
        } catch {
          /* ignora */
        }
      }
    });

    setScheduled(saved);
    setStep(null);
    toast.success(
      droppedImages
        ? `${saved} posts agendados (imagens não couberam no armazenamento local).`
        : `${saved} posts agendados no calendário.`,
    );
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Calendário automático</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Você diz o que faz — a IA gera 30 ideias, 30 legendas, as imagens e agenda o mês inteiro.
        </p>
      </header>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-base">1. Conte o seu nicho</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="profile">Sobre o seu negócio</Label>
            <Textarea
              id="profile"
              rows={2}
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              placeholder="Sou dentista."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Canal</Label>
              <Select value={channel} onValueChange={setChannel}>
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
          <Button onClick={runIdeas} disabled={busy}>
            {step === "ideias" ? (
              <Loader2 className="mr-1.5 size-4 animate-spin" />
            ) : (
              <Wand2 className="mr-1.5 size-4" />
            )}
            Gerar 30 ideias
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <StepCard
          icon={Sparkles}
          title="2. 30 ideias"
          value={`${ideas.length}/30`}
          done={ideas.length > 0}
        />
        <StepCard
          icon={Type}
          title="3. 30 legendas"
          value={`${items.length}/${ideas.length || 30}`}
          done={items.length > 0 && items.length === ideas.length}
        />
        <StepCard
          icon={ImageIcon}
          title="4. Imagens"
          value={`${items.filter((i) => i.imageUrl).length}/${items.length || 30}`}
          done={items.some((i) => i.imageUrl)}
        />
      </div>

      {busy && <Progress value={progress} />}

      {ideas.length > 0 && (
        <Card className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Pautas do mês</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" onClick={runCaptions} disabled={busy}>
                {step === "legendas" ? (
                  <Loader2 className="mr-1.5 size-4 animate-spin" />
                ) : (
                  <Type className="mr-1.5 size-4" />
                )}
                Gerar legendas
              </Button>
              {items.length > 0 && (
                <>
                  <Select value={imageCount} onValueChange={setImageCount}>
                    <SelectTrigger className="h-9 w-[130px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["5", "10", "20", "30"].map((n) => (
                        <SelectItem key={n} value={n}>
                          {n} imagens
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="outline" onClick={runImages} disabled={busy}>
                    {step === "imagens" ? (
                      <Loader2 className="mr-1.5 size-4 animate-spin" />
                    ) : (
                      <ImageIcon className="mr-1.5 size-4" />
                    )}
                    Gerar imagens
                  </Button>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {ideas.map((idea, index) => {
              const item = items[index];
              return (
                <div
                  key={`${idea}-${index}`}
                  className="flex gap-3 rounded-xl border border-border/60 bg-background/40 p-3"
                >
                  <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-xs font-semibold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{item?.title ?? idea}</p>
                    {item?.body && (
                      <p className="mt-1 line-clamp-3 whitespace-pre-line text-xs text-muted-foreground">
                        {item.body}
                      </p>
                    )}
                    {item?.hashtags?.length ? (
                      <p className="mt-1 text-[11px] text-primary/80">
                        {item.hashtags.map((h) => `#${h}`).join(" ")}
                      </p>
                    ) : null}
                  </div>
                  {item?.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={`Imagem gerada para ${item.title}`}
                      className="size-14 shrink-0 rounded-lg object-cover"
                    />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {items.length > 0 && (
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-base">5. Agendar automaticamente</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="start">Começar em</Label>
              <Input
                id="start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="time">Horário</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <Button onClick={runSchedule} disabled={busy}>
              <CalendarDays className="mr-1.5 size-4" />
              Agendar {items.length} posts (1 por dia)
            </Button>
            {scheduled > 0 && (
              <Badge variant="secondary" className="h-9 px-3">
                <Check className="mr-1.5 size-3.5" /> {scheduled} agendados
              </Badge>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StepCard({
  icon: Icon,
  title,
  value,
  done,
}: {
  icon: typeof Sparkles;
  title: string;
  value: string;
  done: boolean;
}) {
  return (
    <Card className="glass-panel">
      <CardContent className="flex items-center gap-3 py-4">
        <span
          className={`grid size-10 place-items-center rounded-xl ${
            done ? "bg-primary/20 text-primary" : "bg-muted/40 text-muted-foreground"
          }`}
        >
          <Icon className="size-4" />
        </span>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
