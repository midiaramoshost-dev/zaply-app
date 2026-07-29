import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  FileBarChart,
  ImageIcon,
  MessageCircle,
  Send,
  Sparkles,
  Wand2,
  Workflow,
  Zap,
} from "lucide-react";

import heroDashboard from "@/assets/hero-dashboard.jpg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ContentFlow — conteúdo com IA, do briefing à publicação" },
      {
        name: "description",
        content:
          "Gere posts com IA para Instagram, LinkedIn, Facebook e X, aprove com o cliente, agende o mês inteiro e publique automaticamente. Tudo em uma só plataforma.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "ContentFlow — conteúdo com IA, do briefing à publicação" },
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
  },
  {
    icon: Wand2,
    title: "Mês automático",
    text: "Diga o seu nicho e receba 30 ideias, 30 legendas e 30 imagens já distribuídas no calendário.",
  },
  {
    icon: ImageIcon,
    title: "Imagens sob medida",
    text: "Banners, mockups e fotos realistas geradas por IA, ou use templates e a sua biblioteca própria.",
  },
  {
    icon: BadgeCheck,
    title: "Aprovação do cliente",
    text: "Fluxo IA → revisão → publicação, com aprovação em um clique ou publicação 100% automática.",
  },
  {
    icon: CalendarDays,
    title: "Calendário e horários",
    text: "Visual mensal de segunda a domingo com grade de horários fixos que a IA sempre respeita.",
  },
  {
    icon: Send,
    title: "Publicação multicanal",
    text: "Instagram (feed, carrossel e reels), Facebook, LinkedIn e X a partir de uma fila única.",
  },
  {
    icon: MessageCircle,
    title: "Caixa de entrada com IA",
    text: "Todos os comentários num lugar só, classificados por sentimento e com resposta sugerida.",
  },
  {
    icon: FileBarChart,
    title: "Relatórios prontos",
    text: "Alcance, curtidas, crescimento, melhor e pior post — exportáveis em PDF e Excel.",
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

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary glow">
              <Zap className="size-4" />
            </span>
            <span className="font-display text-base font-semibold tracking-tight">ContentFlow</span>
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
        {/* Hero */}
        <section className="grid-backdrop relative overflow-hidden border-b border-border/60">
          <div className="pointer-events-none absolute -left-40 top-0 size-[32rem] rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-32 top-40 size-[26rem] rounded-full bg-accent/10 blur-3xl" />
          <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24">
            <div className="max-w-3xl">
              <Badge variant="outline" className="border-primary/40 text-primary">
                Plataforma de conteúdo com inteligência artificial
              </Badge>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                Do briefing à publicação
                <br />
                <span className="gradient-text">sem tirar o pé do estúdio</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                O ContentFlow gera, organiza, aprova, agenda e publica o conteúdo das suas marcas em
                todas as redes — com a consistência de uma agência e a velocidade de um robô.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link to="/auth" search={{ mode: "criar" }}>
                    <Sparkles className="size-4" />
                    Criar conta grátis
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/auth" search={{ mode: "entrar" }}>
                    Já tenho conta — entrar
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                {["Sem cartão para testar", "Português nativo", "Integração com n8n"].map((i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-success" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>

            <div className="panel glow mt-14 overflow-hidden p-1.5">
              <img
                src={heroDashboard}
                alt="Painel do ContentFlow com calendário editorial e métricas de desempenho"
                width={1600}
                height={1008}
                className="w-full rounded-[calc(var(--radius-xl)-6px)]"
              />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-border/60">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-px overflow-hidden px-4 py-10 sm:px-6 lg:grid-cols-4">
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

        {/* Features */}
        <section id="recursos" className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <p className="section-title text-xs uppercase tracking-[0.18em] text-primary">
              Recursos
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Uma operação de conteúdo inteira, em um único lugar
            </h2>
            <p className="mt-3 text-muted-foreground">
              Cada módulo cobre uma etapa do fluxo — e todos conversam entre si.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <article key={f.title} className="panel panel-hover flex flex-col gap-3 p-5">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/12 text-primary">
                  <f.icon className="size-4.5" />
                </span>
                <h3 className="text-sm font-semibold">{f.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{f.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section
          id="como-funciona"
          className="border-y border-border/60 bg-surface/30 py-20"
        >
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
                <li key={s.n} className="panel relative p-5">
                  <span className="font-display text-4xl font-semibold text-primary/25">{s.n}</span>
                  <h3 className="mt-3 text-sm font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{s.text}</p>
                </li>
              ))}
            </ol>

            <div className="panel mt-8 flex flex-wrap items-center gap-4 p-5">
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

        {/* CTA */}
        <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <div className="panel relative overflow-hidden px-6 py-14 text-center sm:px-12">
            <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-primary/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-accent/10 blur-3xl" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Comece hoje o seu <span className="gradient-text">próximo mês de conteúdo</span>
              </h2>
              <p className="mt-3 text-muted-foreground">
                Crie a sua conta, cadastre a primeira marca e deixe a IA preencher o calendário.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg">
                  <Link to="/auth">
                    Criar conta grátis
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/tutorial">Ver o passo a passo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-4 px-4 py-8 text-xs text-muted-foreground sm:px-6">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-primary/15 text-primary">
              <Zap className="size-3.5" />
            </span>
            <span className="font-display text-sm font-semibold text-foreground">ContentFlow</span>
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
          <p className="ml-auto">© {new Date().getFullYear()} ContentFlow. Conteúdo com IA.</p>
        </div>
      </footer>
    </div>
  );
}
