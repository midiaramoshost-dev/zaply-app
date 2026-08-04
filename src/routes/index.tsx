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
  Music2,
  Youtube,
} from "lucide-react";

import heroDashboard from "@/assets/hero-dashboard.jpg";
import { Badge } from "@/components/ui/badge";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Viral — conteúdo com IA para donas do lar" },
      {
        name: "description",
        content:
          "Gere posts com IA para Instagram, LinkedIn, Facebook e X, aprove com o cliente, agende o mês inteiro e publique automaticamente. Tudo em uma só plataforma.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Viral — conteúdo com IA para donas do lar" },
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
    title: "IA de Tarefas e Cronograma",
    text: "Listas de limpeza, compras e avisos automáticos. Tom de voz adaptado para cada profissional.",
    span: "lg:col-span-2",
  },
  {
    icon: Wand2,
    title: "Mês organizado",
    text: "Diga sua rotina e receba 30 dias de cronograma e listas já distribuídas no calendário.",
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
    title: "Controle na mão",
    text: "Fluxo IA → revisão → execução, com aprovação em um clique.",
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
    title: "Avisos multicanal",
    text: "WhatsApp, E-mail e notificações a partir de uma fila única.",
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
    title: "Defina sua necessidade",
    text: "Nicho, tarefas, horários, tom de voz para comunicação e regras da casa.",
  },
  {
    n: "02",
    title: "IA organiza tudo",
    text: "Cronograma de limpeza, lista de compras e orientações para profissionais.",
  },
  {
    n: "03",
    title: "Aprove e agende",
    text: "Revise o planejamento semanal e agende as visitas em um clique.",
  },
  {
    n: "04",
    title: "Lar impecável",
    text: "Execução automática, avisos via WhatsApp e relatórios de atividades prontos.",
  },
];

const stats = [
  { value: "30", label: "tarefas geradas por rodada" },
  { value: "8", label: "serviços integrados" },
  { value: "1 clique", label: "para aprovar e agendar" },
  { value: "24/7", label: "gestão automatizada" },
];

const channels = [
  { icon: Instagram, name: "Instagram" },
  { icon: Music2, name: "TikTok" },
  { icon: Linkedin, name: "LinkedIn" },
  { icon: Facebook, name: "Facebook" },
  { icon: Youtube, name: "YouTube" },
  { icon: MessageCircle, name: "WhatsApp" },
  { icon: Sparkles, name: "Pinterest" },
  { icon: Zap, name: "X" },
];

const testimonials = [
  {
    quote:
      "Organizei o mês inteiro da minha casa numa tarde. O que antes era uma confusão de mensagens.",
    name: "Marina Alves",
    role: "Social media · agência própria",
  },
  {
    quote:
      "A aprovação em um clique acabou com o vai e vem no WhatsApp com os prestadores. Tudo fica registrado.",
    name: "Rafael Duarte",
    role: "Gestor doméstico · 12 residências",
  },
  {
    quote:
      "As listas de tarefas saem perfeitas. Eu só ajusto um detalhe ou outro e libero o cronograma.",
    name: "Carla Menezes",
    role: "Dona de casa organizada",
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
            <span className="font-display text-lg font-bold tracking-tight text-white">Viral</span>
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
                Viral: IA para Donas do Lar e Serviços Domésticos
              </Badge>
              <h1 className="animate-in fade-in slide-in-from-bottom-6 duration-1000 mt-6 text-balance text-[2.8rem] font-bold leading-[1.05] tracking-tight sm:text-7xl">
                A plataforma para donas do lar
                <br />
                <span className="bg-gradient-to-r from-primary via-blue-400 to-accent bg-clip-text text-transparent">solicitarem serviços domésticos</span>
              </h1>
              <p className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 mt-6 max-w-lg text-base leading-relaxed text-gray-400 sm:text-lg">
                O Viral conecta donas do lar a profissionais qualificados. Solicite serviços, agende e gerencie tudo com um clique — a inteligência artificial que escala seu lar.
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
                  alt="Painel do Viral com calendário de serviços e métricas"
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
                    <p className="truncate text-xs font-semibold">Serviço solicitado</p>
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
                  <p className="text-xs font-semibold">Serviços agendados</p>
                  <p className="text-[0.68rem] text-muted-foreground">Seg 09:00 · Qua 14:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Channels strip */}
          <div className="relative border-t border-border/60 bg-background/40">
            <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 py-6 sm:px-6">
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Disponível em
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
              Serviços
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Uma gestão doméstica completa, em um único lugar
            </h2>
            <p className="mt-3 text-muted-foreground">
              Cada módulo cobre uma etapa da sua rotina — agora com IA integrada para gerenciar cada detalhe da sua casa.
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
                Quatro passos para transformar seu lar
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
