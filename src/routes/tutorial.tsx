import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  CalendarClock,
  CalendarDays,
  FileBarChart,
  ImageIcon,
  Library,
  MessageCircle,
  Rocket,
  Send,
  Sparkles,
  Users,
  Wand2,
  Workflow,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/tutorial")({
  head: () => ({
    meta: [
      { title: "Como usar — Tutorial do Zaply" },
      {
        name: "description",
        content:
          "Passo a passo completo do Zaply: cadastre o cliente, gere conteúdo com IA, aprove, agende e publique nas redes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Como usar — Tutorial do Zaply" },
      {
        property: "og:description",
        content:
          "Guia rápido em 8 passos para criar, aprovar, agendar e publicar conteúdo com IA no Zaply.",
      },
      { name: "twitter:title", content: "Como usar — Tutorial do Zaply" },
      {
        name: "twitter:description",
        content:
          "Guia rápido em 8 passos para criar, aprovar, agendar e publicar conteúdo com IA no Zaply.",
      },
    ],
  }),
  component: TutorialPage,
  errorComponent: () => (
    <div className="grid min-h-[60vh] place-items-center px-4 text-center text-sm text-muted-foreground">
      Não foi possível carregar o tutorial. Recarregue a página.
    </div>
  ),
});

const steps = [
  {
    icon: Users,
    title: "1. Cadastre o cliente (marca)",
    to: "/clientes" as const,
    action: "Abrir Clientes",
    text: "Comece criando o perfil da marca: nome, logo, nicho, objetivos, público-alvo, tom de voz, palavras proibidas, cores e fontes. Tudo que a IA escrever depois segue esse perfil.",
    tips: [
      "Preencha o endereço e o contato — a IA usa esses dados para responder comentários do tipo “onde fica?”.",
      "As palavras proibidas evitam termos que a marca não pode usar.",
    ],
  },
  {
    icon: CalendarClock,
    title: "2. Defina os horários de publicação",
    to: "/agendamento" as const,
    action: "Abrir Agendamento",
    text: "Configure a grade fixa de horários (ex.: Segunda 09:00, Quarta 14:00, Sexta 18:00). Todo agendamento automático respeita esses horários.",
    tips: ["Você pode ativar e desativar cada horário sem apagar a configuração."],
  },
  {
    icon: Sparkles,
    title: "3. Gere conteúdo com IA",
    to: "/criar" as const,
    action: "Abrir Criar com IA",
    text: "Descreva o tema e escolha a rede. A IA devolve título, legenda, CTA, hashtags e emojis já adaptados para Instagram, LinkedIn, Facebook ou X.",
    tips: [
      "Gere variações do mesmo tema para cada rede em vez de repetir o mesmo texto.",
      "Edite o texto antes de salvar — a IA é o rascunho, você dá o acabamento.",
    ],
  },
  {
    icon: ImageIcon,
    title: "4. Crie ou escolha a imagem",
    to: "/imagens" as const,
    action: "Abrir Imagens",
    text: "Gere imagens por IA (banners, mockups, ilustrações, fotos realistas), use templates ou envie da sua biblioteca própria. Depois é só vincular a imagem ao post.",
    tips: ["Descreva estilo, cores e enquadramento no prompt para resultados mais fiéis à marca."],
  },
  {
    icon: Library,
    title: "5. Organize na biblioteca",
    to: "/biblioteca" as const,
    action: "Abrir Biblioteca",
    text: "Todos os posts ficam guardados por pasta: Produtos, Promoções, Datas, Vídeos, Logos, Stories e Reels. Filtre por status para achar o que falta terminar.",
    tips: ["A categoria é sugerida automaticamente pelo conteúdo, mas você pode trocar."],
  },
  {
    icon: BadgeCheck,
    title: "6. Envie para aprovação",
    to: "/aprovacao" as const,
    action: "Abrir Aprovação",
    text: "O fluxo é IA gerou → cliente aprova → publicar. Arraste o post pelas colunas ou ative a publicação automática para pular a etapa de aprovação.",
    tips: ["Com a publicação automática ligada, todo post aprovado entra direto na fila."],
  },
  {
    icon: CalendarDays,
    title: "7. Agende no calendário",
    to: "/calendario" as const,
    action: "Abrir Calendário",
    text: "Veja o mês inteiro de segunda a domingo. Clique em um dia para editar o post, trocar a imagem, aprovar, cancelar ou reagendar.",
    tips: [
      "Quer um mês inteiro pronto? Use o Calendário automático: informe o nicho e a IA gera 30 ideias, 30 legendas e agenda tudo.",
    ],
  },
  {
    icon: Send,
    title: "8. Publique e acompanhe",
    to: "/publicacao" as const,
    action: "Abrir Publicação",
    text: "Conecte as contas e escolha o formato por rede (Feed, Carrossel, Reels, Página, Perfil ou Empresa). Depois acompanhe alcance, curtidas e crescimento nos relatórios.",
    tips: ["Enquanto as redes não estão conectadas, a publicação roda em modo simulado."],
  },
] as const;

const extras = [
  {
    icon: Wand2,
    title: "Calendário automático",
    to: "/automatico" as const,
    text: "Informe o nicho (“sou dentista”) e a IA monta 30 ideias, escreve as legendas e agenda tudo nos seus horários.",
  },
  {
    icon: MessageCircle,
    title: "Comentários",
    to: "/comentarios" as const,
    text: "Caixa de entrada única com filtros por não respondidos, positivos, negativos e spam, com respostas sugeridas pela IA.",
  },
  {
    icon: FileBarChart,
    title: "Relatórios",
    to: "/relatorios" as const,
    text: "Relatório mensal com alcance, seguidores, curtidas, crescimento, melhor e pior post — exportável em PDF e Excel.",
  },
  {
    icon: Workflow,
    title: "Fluxo n8n",
    to: "/n8n" as const,
    text: "Conecte o webhook do n8n para rodar o pipeline completo: buscar post, gerar imagem, publicar, salvar links e enviar relatório.",
  },
] as const;

const faq = [
  {
    q: "Preciso de conta para usar?",
    a: "Sim. Entre com e-mail e senha ou com o Google. A conta guarda seus clientes, posts, imagens e agendamentos na nuvem.",
  },
  {
    q: "Sou administrador master. O fluxo é diferente?",
    a: "O passo a passo é o mesmo. A diferença é o alcance: o administrador enxerga e gerencia todos os clientes da conta, cuida dos planos e da aprovação final antes da publicação.",
  },
  {
    q: "Posso publicar de verdade nas redes?",
    a: "Conecte as contas em Publicação. Sem contas conectadas, o app roda em modo simulado para você testar o fluxo inteiro sem risco.",
  },
  {
    q: "Como a IA sabe o tom da marca?",
    a: "Ela lê o perfil cadastrado em Clientes: nicho, objetivos, público, tom de voz e palavras proibidas. Quanto mais completo o perfil, melhor o texto.",
  },
  {
    q: "Qual plano devo escolher?",
    a: "Starter para 1 cliente e 100 posts por mês, Pro para até 5 clientes com IA ilimitada e agendamento, Agency para clientes ilimitados, múltiplos utilizadores, aprovação, relatórios e marca branca.",
  },
] as const;

function TutorialPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <section className="panel relative overflow-hidden px-6 py-10 sm:px-10">
        <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-primary/20 blur-3xl" />
        <Badge variant="outline" className="border-primary/40 text-primary">
          Guia de uso
        </Badge>
        <h1 className="mt-4 max-w-2xl text-3xl font-semibold sm:text-4xl">
          Como usar o <span className="gradient-text">Zaply</span> em 8 passos
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          Do cadastro da marca até a publicação automática. Siga na ordem na primeira vez — depois
          é só repetir os passos 3 a 8 toda semana.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/clientes">
              <Rocket className="size-4" />
              Começar pelo passo 1
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/criar">
              <Sparkles className="size-4" />
              Já quero gerar conteúdo
            </Link>
          </Button>
        </div>
      </section>

      <section className="mt-6 space-y-4">
        {steps.map((step) => (
          <Card key={step.title} className="panel">
            <CardHeader className="flex-row items-start gap-3 space-y-0">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                <step.icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base">{step.title}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pl-[4.25rem]">
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {step.tips.map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/70" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" size="sm">
                <Link to={step.to}>{step.action}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold">Recursos que aceleram o trabalho</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {extras.map((extra) => (
            <Card key={extra.title} className="panel">
              <CardHeader className="flex-row items-center gap-3 space-y-0">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent/15 text-primary">
                  <extra.icon className="size-4" />
                </span>
                <CardTitle className="text-base">{extra.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{extra.text}</p>
                <Button asChild variant="ghost" size="sm">
                  <Link to={extra.to}>Abrir</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold">Perguntas frequentes</h2>
        <Card className="panel mt-4">
          <CardContent className="pt-6">
            <Accordion type="single" collapsible>
              {faq.map((item, i) => (
                <AccordionItem key={item.q} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-sm">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
