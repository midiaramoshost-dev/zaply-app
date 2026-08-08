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
  ShieldCheck,
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
    title: "IA Zaply (Texto, Imagem e Vídeo)",
    text: "Motor proprietário que gera legendas, hashtags, roteiros de 6s e imagens realistas de forma integrada.",
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
  { value: "30", label: "Posts gerados por rodada" },
  { value: "100%", label: "White Label para sua agência" },
  { value: "8", label: "Canais integrados Zaply" },
  { value: "24/7", label: "Automação total via n8n" },
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
            <span className="font-display text-xl font-bold tracking-tighter text-white">zaply.</span>
          </Link>

          <nav className="ml-12 hidden items-center gap-8 text-sm font-medium text-muted-foreground/80 md:flex">
            <a href="#produto" className="transition-colors hover:text-foreground">
              Produto
            </a>
            <a href="#como-funciona" className="transition-colors hover:text-foreground">
              Como funciona
            </a>
            <a href="#recursos" className="transition-colors hover:text-foreground">
              Recursos
            </a>
            <a href="#clientes" className="transition-colors hover:text-foreground">
              Clientes
            </a>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="text-sm font-medium text-white/90">
              <Link to="/painel">
                Entrar
              </Link>
            </Button>
            <Button asChild size="sm" className="h-10 rounded-full bg-[#d9f99d] px-5 text-sm font-bold text-black hover:bg-[#bef264]">
              <Link to="/painel" className="flex items-center gap-1.5">
                Começar grátis
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
              <Badge variant="outline" className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex items-center gap-2 rounded-full border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-gray-400 backdrop-blur-md">
                <span className="size-1.5 rounded-full bg-[#d9f99d]" />
                O cockpit de conteúdo para times que fazem acontecer
              </Badge>
              <h1 className="animate-in fade-in slide-in-from-bottom-6 duration-1000 mt-8 text-balance text-6xl font-bold leading-[1.05] tracking-tighter sm:text-8xl">
                Sua próxima
                <br />
                <span className="text-white">ideia em</span>
                <br />
                <span className="text-[#d9f99d]">escala.</span>
              </h1>
              <p className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 mt-8 max-w-lg text-lg leading-relaxed text-gray-400">
                Do briefing ao post publicado: o Zaply transforma estratégia em um mês inteiro de conteúdo consistente, no ritmo da sua equipe.
              </p>

              <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 mt-10 flex flex-wrap items-center gap-4">
                <Button asChild size="lg" className="h-14 rounded-full bg-[#d9f99d] px-8 text-base font-bold text-black shadow-[0_0_30px_-5px_rgba(217,249,157,0.3)] transition-all hover:bg-[#bef264] hover:scale-[1.02] active:scale-[0.98]">
                  <Link to="/painel" className="flex items-center gap-2">
                    Criar meu primeiro mês
                    <ArrowRight className="size-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="h-14 rounded-full px-8 text-base font-bold text-white transition-all hover:bg-white/5 hover:scale-[1.02] active:scale-[0.98]">
                  <Link to="/painel" className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-full bg-white/10">
                      <Zap className="size-4 fill-white text-white" />
                    </span>
                    Ver em 90 segundos
                  </Link>
                </Button>
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500 mt-10 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['LM', 'CA', 'BR', 'JS'].map((initial, i) => (
                    <div key={i} className={`flex size-8 items-center justify-center rounded-full border-2 border-[#02040a] text-[10px] font-bold text-black ${
                      i === 0 ? 'bg-[#d9f99d]' : i === 1 ? 'bg-[#a5f3fc]' : i === 2 ? 'bg-[#fecaca]' : 'bg-[#e9d5ff]'
                    }`}>
                      {initial}
                    </div>
                  ))}
                </div>
                <p className="text-xs font-medium text-gray-500">
                  + 2.400 equipes já criam com mais clareza
                </p>
              </div>
            </div>

            {/* Visual */}
            <div className="relative lg:pl-10">
              <div className="panel overflow-hidden border-white/5 bg-[#0a0c14] p-2 shadow-2xl">
                <div className="relative overflow-hidden rounded-[calc(var(--radius-xl)-8px)] border border-white/5">
                  <img
                    src={heroDashboard}
                    alt="Painel do Zaply"
                    width={1600}
                    height={1008}
                    className="w-full opacity-90"
                  />
                  {/* Overlay for "Calendário editorial" look */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-transparent to-transparent opacity-40" />
                </div>
              </div>

              {/* Floating card — 12 oportunidades */}
              <div className="panel absolute left-0 top-1/4 -translate-x-1/2 w-48 gap-3 p-4 backdrop-blur-2xl border-white/10 bg-white/5 animate-bounce-slow">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Esta semana</p>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-base font-bold text-white">12 oportunidades</p>
                  <ArrowRight className="size-4 -rotate-45 text-[#d9f99d]" />
                </div>
              </div>

              {/* Floating card — Editorial Calendar snippet */}
              <div className="panel absolute bottom-12 right-0 translate-x-1/4 w-72 p-5 backdrop-blur-2xl border-white/10 bg-[#0a0c14]/80 shadow-2xl hidden md:block">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold text-white">Calendário editorial</p>
                    <p className="text-[10px] text-gray-500">04 — 10 de maio</p>
                  </div>
                  <p className="text-[10px] font-bold text-gray-600">68 peças</p>
                </div>
                <div className="space-y-3">
                  {[
                    { date: '04', text: 'O bastidor que ninguém vê', status: 'Pronto', color: 'bg-rose-500' },
                    { date: '05', text: '3 sinais de que sua marca evoluiu', status: 'Pronto', color: 'bg-emerald-500' },
                    { date: '06', text: 'Ideias que viram movimento', status: 'Pronto', color: 'bg-indigo-500' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 border-b border-white/5 pb-2 last:border-0 last:pb-0">
                      <p className="text-[10px] font-bold text-gray-600">{item.date}</p>
                      <div className={`w-0.5 h-3 ${item.color}`} />
                      <p className="flex-1 truncate text-[10px] font-medium text-gray-300">{item.text}</p>
                      <span className="text-[9px] font-bold text-[#d9f99d]">Pronto</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logo badge */}
              <div className="absolute top-6 right-6 z-10 size-10 rounded-xl bg-[#d9f99d] grid place-items-center shadow-lg shadow-[#d9f99d]/20">
                <Zap className="size-5 fill-black text-black" />
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

        {/* Workspace Vision Section */}
        <section id="produto" className="relative border-y border-white/5 bg-[#02040a] py-24 overflow-hidden">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d9f99d]">Uma visão do workspace</p>
                <h2 className="mt-4 text-4xl font-bold tracking-tighter text-white sm:text-5xl">
                  Tudo em foco. Nada perdido.
                </h2>
              </div>
              <p className="text-sm font-medium text-gray-500 max-w-xs md:text-right">
                Produto real, rotina mais leve
              </p>
            </div>
            
            <div className="panel overflow-hidden border-white/5 bg-[#0a0c14] shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-6 py-3">
                <div className="flex gap-1.5">
                  <div className="size-2 rounded-full bg-rose-500/50" />
                  <div className="size-2 rounded-full bg-amber-500/50" />
                  <div className="size-2 rounded-full bg-emerald-500/50" />
                </div>
                <div className="flex items-center gap-2 rounded-md bg-black/40 px-3 py-1 text-[10px] font-medium text-gray-500 border border-white/5">
                  <Zap className="size-3" /> zaply / workspace / maio
                </div>
                <p className="text-[10px] font-medium text-gray-600">Atualizado agora</p>
              </div>
              <div className="h-[400px] bg-gradient-to-b from-[#0a0c14] to-[#02040a] p-8 flex flex-col items-center justify-center text-center opacity-40">
                <Zap className="size-12 text-[#d9f99d] mb-4" />
                <p className="text-sm font-medium text-gray-400">Visualização do workspace em construção</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-black py-16">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-8 px-4 sm:px-6 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center lg:text-left">
                <p className="font-display text-4xl font-bold tracking-tighter text-white sm:text-5xl">
                  {s.value}
                </p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
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
                  <Link to="/painel">
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
            <Link to="/painel" className="transition-colors hover:text-foreground">
              Entrar
            </Link>
          </nav>
          <p className="ml-auto flex items-center gap-4">
            <Link to="/admin" className="opacity-0 hover:opacity-100 transition-opacity">
              <ShieldCheck className="size-3" />
            </Link>
            <span>© {new Date().getFullYear()} Zaply. Conteúdo com IA.</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
