import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  FileBarChart,
  Heart,
  ImageIcon,
  Instagram,
  Linkedin,
  MessageCircle,
  Facebook,
  Send,
  Sparkles,
  Star,
  Wand2,
  Workflow,
  Zap,
} from "lucide-react";

import heroDashboard from "@/assets/hero-dashboard.jpg";
import { Badge } from "@/components/ui/badge";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zaply — conteúdo com IA, do briefing à publicação" },
      {
        name: "description",
        content:
          "Gere posts com IA para Instagram, LinkedIn, Facebook e X, aprove com o cliente, agende o mês inteiro e publique automaticamente. Tudo em uma só plataforma.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Zaply — conteúdo com IA, do briefing à publicação" },
      {
        property: "og:description",
        content:
          "Crie, aprove, agende e publique conteúdo para todas as redes com inteligência artificial.",
      },
    ],
  }),
  component: LandingPage,
});

const features = [
  {
    icon: Sparkles,
    title: "Geração por IA",
    text: "Título, legenda, CTA, hashtags e emojis no tom de voz de cada marca — adaptados por rede social.",
    span: "lg:col-span-2",
  },
  {
    icon: Wand2,
    title: "Mês automático",
    text: "Diga o seu nicho e receba 30 ideias, 30 legendas e 30 imagens já distribuídas no calendário.",
    span: "lg:col-span-2",
  },
  {
    icon: ImageIcon,
    title: "Imagens sob medida",
    text: "Banners, mockups e fotos realistas geradas por IA, ou use templates e a sua biblioteca própria.",
    span: "",
  },
  {
    icon: BadgeCheck,
    title: "Aprovação do cliente",
    text: "Fluxo IA → revisão → publicação, com aprovação em um clique.",
    span: "",
  },
  {
    icon: CalendarDays,
    title: "Calendário e horários",
    text: "Grade fixa de horários que a IA sempre respeita, de segunda a domingo.",
    span: "",
  },
  {
    icon: Send,
    title: "Publicação multicanal",
    text: "Instagram, Facebook, LinkedIn e X a partir de uma fila única.",
    span: "",
  },
  {
    icon: MessageCircle,
    title: "Caixa de entrada com IA",
    text: "Comentários num lugar só, classificados por sentimento e com resposta sugerida.",
    span: "lg:col-span-2",
  },
  {
    icon: FileBarChart,
    title: "Relatórios prontos",
    text: "Alcance, curtidas, crescimento, melhor e pior post — exportáveis em PDF e Excel.",
    span: "lg:col-span-2",
  },
];

const steps = [
  {
    n: "01",
    title: "Cadastre a marca",
    text: "Nicho, objetivos, público, tom de voz, cores, fontes e palavras proibidas.",
  },
  {
    n: "02",
    title: "Deixe a IA criar",
    text: "Conteúdo e imagens para cada canal, respeitando a identidade do cliente.",
  },
  {
    n: "03",
    title: "Aprove e agende",
    text: "Revise em segundos e encaixe tudo na grade de horários da semana.",
  },
  {
    n: "04",
    title: "Publique e meça",
    text: "Publicação automática via n8n e relatórios mensais entregues prontos.",
  },
];

const stats = [
  { value: "30", label: "posts gerados por rodada" },
  { value: "4", label: "redes sociais integradas" },
  { value: "1 clique", label: "para aprovar e agendar" },
  { value: "24/7", label: "publicação automatizada" },
];

const channels = [
  { icon: Instagram, name: "Instagram" },
  { icon: Linkedin, name: "LinkedIn" },
  { icon: Facebook, name: "Facebook" },
  { icon: Zap, name: "X" },
  { icon: Workflow, name: "n8n" },
];

const testimonials = [
  {
    quote:
      "Fechei o mês inteiro de conteúdo de 6 clientes numa tarde. O que antes era uma semana de trabalho.",
    name: "Marina Alves",
    role: "Social media · agência própria",
  },
  {
    quote:
      "A aprovação em um clique acabou com o vai e vem no WhatsApp. O cliente entra, revisa e libera.",
    name: "Rafael Duarte",
    role: "Dono de agência · 12 marcas",
  },
  {
    quote:
      "As legendas saem no tom da marca de verdade. Eu só ajusto detalhe e mando publicar.",
    name: "Carla Menezes",
    role: "Consultora de marketing",
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-black/60 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <BrandMark className="size-9 shadow-lg shadow-primary/20" />
            <span className="font-display text-lg font-bold tracking-tight text-white">Zaply</span>
          </Link>

          <nav className="ml-8 hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#recursos" className="transition-colors hover:text-foreground">
              Recursos
            </a>
            <a href="#como-funciona" className="transition-colors hover:text-foreground">
              Como funciona
            </a>
            <Link to="/planos" className="transition-colors hover:text-foreground">
              Planos
            </Link>
            <Link to="/tutorial" className="transition-colors hover:text-foreground">
              Tutorial
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth" search={{ mode: "entrar" }}>
                Entrar
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/auth" search={{ mode: "criar" }}>
                Criar conta grátis
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero — split screen */}
        <section className="relative overflow-hidden border-b border-border/40 bg-[#02040a]">
          <div className="pointer-events-none absolute -left-40 top-0 size-[32rem] rounded-full bg-primary/10 blur-[120px]" />
          <div className="pointer-events-none absolute -right-32 top-32 size-[28rem] rounded-full bg-accent/10 blur-[120px]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 min-h-screen w-full -translate-x-1/2 -translate-y-1/2 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />

          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:pb-32 lg:pt-28">
            <div className="flex flex-col items-start">
              <Badge variant="outline" className="animate-in fade-in slide-in-from-bottom-4 duration-700 gap-1.5 border-primary/30 bg-primary/5 py-1.5 text-primary backdrop-blur-md">
                <Sparkles className="size-3.5" />
                Plataforma Viral de Conteúdo com IA
              </Badge>
              <h1 className="animate-in fade-in slide-in-from-bottom-6 duration-1000 mt-6 text-balance text-[2.8rem] font-bold leading-[1.05] tracking-tight sm:text-7xl">
                Crie conteúdo que
                <br />
                <span className="bg-gradient-to-r from-primary via-blue-400 to-accent bg-clip-text text-transparent">domina o feed</span>
              </h1>
              <p className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 mt-6 max-w-lg text-base leading-relaxed text-gray-400 sm:text-lg">
                O Zaply transforma suas ideias em posts virais. Gere, agende e publique em todas as suas redes com um clique — a inteligência que escala sua marca.
              </p>

              <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 mt-10 flex flex-wrap items-center gap-4">
                <Button asChild size="lg" className="h-14 px-8 text-base shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] transition-all hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.6)] hover:scale-[1.02] active:scale-[0.98]">
                  <Link to="/auth" search={{ mode: "criar" }}>
                    <Zap className="mr-2 size-5 fill-current" />
                    Começar agora — é grátis
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-14 border-white/10 bg-white/5 px-8 text-base backdrop-blur-md transition-all hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]">
                  <Link to="/auth" search={{ mode: "entrar" }}>
                    Acessar minha conta
                  </Link>
                </Button>
              </div>

              <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                {["Sem cartão para testar", "Português nativo", "Integração com n8n"].map((i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-success" />
                    {i}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-border/60 pt-6">
                <div className="flex items-center gap-1 text-warning">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Usado por social medias e agências que publicam todos os dias
                </p>
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="panel glow overflow-hidden p-1.5">
                <img
                  src={heroDashboard}
                  alt="Painel do Zaply com calendário editorial e métricas de desempenho"
                  width={1600}
                  height={1008}
                  className="w-full rounded-[calc(var(--radius-xl)-6px)]"
                />
              </div>

              {/* Floating card — post gerado */}
              <div className="panel absolute -bottom-8 -left-4 hidden w-64 gap-3 p-4 backdrop-blur-xl sm:flex sm:flex-col lg:-left-10">
                <div className="flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-lg bg-primary/15 text-primary">
                    <Instagram className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold">Post gerado por IA</p>
                    <p className="truncate text-[0.68rem] text-muted-foreground">
                      Instagram · Feed
                    </p>
                  </div>
                </div>
                <p className="text-[0.72rem] leading-relaxed text-muted-foreground">
                  ✨ Seu sorriso merece cuidado o ano inteiro. Agende a sua avaliação!
                </p>
                <div className="flex items-center gap-3 text-[0.68rem] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="size-3 text-destructive" /> 1,2 mil
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="size-3" /> 86
                  </span>
                  <span className="ml-auto flex items-center gap-1 text-success">
                    <CheckCircle2 className="size-3" /> Aprovado
                  </span>
                </div>
              </div>

              {/* Floating card — agendamento */}
              <div className="panel absolute -right-4 -top-6 hidden items-center gap-2.5 p-3 backdrop-blur-xl md:flex lg:-right-8">
                <span className="grid size-8 place-items-center rounded-lg bg-accent/15 text-accent">
                  <CalendarDays className="size-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold">30 posts agendados</p>
                  <p className="text-[0.68rem] text-muted-foreground">Seg 09:00 · Qua 14:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Channels strip */}
          <div className="relative border-t border-border/60 bg-background/40">
            <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 py-6 sm:px-6">
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Publica em
              </span>
              {channels.map((c) => (
                <span
                  key={c.name}
                  className="flex items-center gap-2 text-sm text-muted-foreground/80"
                >
                  <c.icon className="size-4" />
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-border/60 bg-surface/20">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 divide-border/60 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:divide-x">
            {stats.map((s) => (
              <div key={s.label} className="px-4 py-4 text-center lg:text-left">
                <p className="font-display text-3xl font-semibold tabular-nums sm:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features — bento */}
        <section id="recursos" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <p className="section-title text-xs uppercase tracking-[0.18em] text-primary">
              Recursos
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Uma operação de conteúdo inteira, em um único lugar
            </h2>
            <p className="mt-3 text-muted-foreground">
              Cada módulo cobre uma etapa do fluxo — agora com editor integrado para revisar cada detalhe antes da publicação.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <article
                key={f.title}
                className={`panel panel-hover flex flex-col gap-3 p-6 ${f.span}`}
              >
                <span className="grid size-10 place-items-center rounded-xl bg-primary/12 text-primary">
                  <f.icon className="size-4.5" />
                </span>
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="como-funciona" className="border-y border-border/60 bg-surface/30 py-20 sm:py-24">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="section-title text-xs uppercase tracking-[0.18em] text-primary">
                Como funciona
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Quatro passos entre a ideia e o post no ar
              </h2>
            </div>

            <ol className="mt-10 grid gap-4 md:grid-cols-4">
              {steps.map((s) => (
                <li key={s.n} className="panel panel-hover relative p-6">
                  <span className="font-display text-4xl font-semibold text-primary/25">{s.n}</span>
                  <h3 className="mt-3 text-base font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </li>
              ))}
            </ol>

            <div className="panel mt-8 flex flex-wrap items-center gap-4 p-6">
              <span className="grid size-10 place-items-center rounded-xl bg-accent/15 text-accent">
                <Workflow className="size-4.5" />
              </span>
              <p className="min-w-60 flex-1 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Automação com n8n:</span> cron busca o
                post agendado, gera a imagem, salva, publica em todas as redes, guarda os links e
                envia o relatório.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link to="/n8n">Ver o fluxo</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <p className="section-title text-xs uppercase tracking-[0.18em] text-primary">
              Quem usa
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Feito para quem entrega conteúdo todo dia
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="panel panel-hover flex h-full flex-col gap-4 p-6">
                <div className="flex items-center gap-1 text-warning">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-current" />
                  ))}
                </div>
                <blockquote className="flex-1 text-sm leading-relaxed text-foreground/90">
                  “{t.quote}”
                </blockquote>
                <figcaption className="border-t border-border/60 pt-4">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
          <div className="panel glow relative overflow-hidden px-6 py-16 text-center sm:px-12">
            <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-primary/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-accent/12 blur-3xl" />
            <div className="relative mx-auto max-w-2xl">
              <BrandMark className="mx-auto size-12" />
              <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
                Comece hoje o seu <span className="gradient-text">próximo mês de conteúdo</span>
              </h2>
              <p className="mt-3 text-muted-foreground">
                Crie a sua conta, cadastre a primeira marca e deixe a IA preencher o calendário.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg">
                  <Link to="/auth" search={{ mode: "criar" }}>
                    Criar conta grátis
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/planos">Ver planos</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-4 px-4 py-8 text-xs text-muted-foreground sm:px-6">
          <div className="flex items-center gap-2">
            <BrandMark className="size-7 rounded-lg" />
            <span className="font-display text-sm font-semibold text-foreground">Zaply</span>
          </div>
          <nav className="flex flex-wrap gap-4">
            <Link to="/painel" className="transition-colors hover:text-foreground">
              Painel
            </Link>
            <Link to="/planos" className="transition-colors hover:text-foreground">
              Planos
            </Link>
            <Link to="/tutorial" className="transition-colors hover:text-foreground">
              Tutorial
            </Link>
            <Link to="/auth" className="transition-colors hover:text-foreground">
              Entrar
            </Link>
          </nav>
          <p className="ml-auto">© {new Date().getFullYear()} Zaply. Conteúdo com IA.</p>
        </div>
      </footer>
    </div>
  );
}
