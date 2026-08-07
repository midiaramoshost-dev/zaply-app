import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { 
  Sparkles, 
  Video, 
  ImageIcon, 
  FileText, 
  Megaphone, 
  Globe, 
  Wand2,
  ArrowRight,
  Plus,
  Zap,
  LayoutDashboard,
  Timer,
  LayoutGrid,
  BarChart3,
  Search,
  Bot
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProfileAccess } from "@/hooks/use-profile-access";
import { KPIGrid } from "@/modules/dashboard/components/kpi-grid";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/painel")({
  head: () => ({
    meta: [
      { title: "Painel — Zaply" },
      { property: "og:title", content: "Painel — Zaply" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [mode, setMode] = useState<"simple" | "pro">("simple");
  const [idea, setIdea] = useState("");
  const navigate = useNavigate();
  const { isAdmin } = useProfileAccess();

  const handleGenerate = () => {
    if (!idea.trim()) return;
    navigate({ to: "/criar", search: (prev: any) => ({ ...prev, prompt: idea }) });
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      <header className="page-header p-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge variant="outline" className="mb-2 border-primary/20 bg-primary/10 text-primary font-bold">ZAPLY ENTERPRISE</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Estratégico</h1>
          <p className="text-sm text-muted-foreground mt-1">Bem-vindo ao centro de comando da sua operação de marketing.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-black/40 p-1 backdrop-blur-sm">
            <Button 
              variant={mode === "simple" ? "default" : "ghost"} 
              size="sm" 
              className={`h-8 rounded-lg text-[10px] font-bold tracking-widest ${mode === 'simple' ? 'bg-[#d9f99d] text-black hover:bg-[#bef264]' : 'text-muted-foreground'}`}
              onClick={() => setMode("simple")}
            >
              SIMPLES
            </Button>
            <Button 
              variant={mode === "pro" ? "default" : "ghost"} 
              size="sm" 
              className={`h-8 rounded-lg text-[10px] font-bold tracking-widest ${mode === 'pro' ? 'bg-[#d9f99d] text-black hover:bg-[#bef264]' : 'text-muted-foreground'}`}
              onClick={() => setMode("pro")}
            >
              PROFISSIONAL
            </Button>
          </div>
          <Button size="sm" className="h-10 rounded-xl bg-primary shadow-lg shadow-primary/20">
            <Plus className="size-4 mr-2" /> NOVA MARCA
          </Button>
        </div>
      </header>

      <KPIGrid />

      {mode === "simple" ? (
        <div className="mx-auto max-w-4xl space-y-12 py-8">
          <div className="relative max-w-2xl mx-auto mb-12">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Search className="size-5" />
            </div>
            <Input 
              placeholder="Pesquisar ativos, campanhas ou perguntar à IA..." 
              className="h-14 pl-14 pr-6 rounded-2xl bg-surface/50 border-white/5 focus:ring-primary/20 text-lg shadow-2xl"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Vídeos Virais", icon: Video, color: "text-[#d9f99d]", bg: "bg-[#d9f99d]/5", url: "/criar", desc: "Shorts, Reels e TikToks" },
              { title: "Design com IA", icon: ImageIcon, color: "text-[#a5f3fc]", bg: "bg-[#a5f3fc]/5", url: "/imagens", desc: "Imagens e artes profissionais" },
              { title: "Posts Sociais", icon: Sparkles, color: "text-[#fecaca]", bg: "bg-[#fecaca]/5", url: "/criar", desc: "Legendas e hashtags otimizadas" },
              { title: "Tráfego Pago", icon: Megaphone, color: "text-[#e9d5ff]", bg: "bg-[#e9d5ff]/5", url: "/criar", desc: "Criativos de alta conversão" },
              { title: "Agentes Zaply", icon: Bot, color: "text-[#fde047]", bg: "bg-[#fde047]/5", url: "/tutorial", desc: "Sua equipe de especialistas IA" },
              { title: "Automações", icon: Zap, color: "text-[#94a3b8]", bg: "bg-[#94a3b8]/5", url: "/n8n", desc: "Fluxos de trabalho inteligentes" },
            ].map((item) => (
              <Link key={item.title} to={item.url as any} className="block group">
                <Card className="panel panel-hover cursor-pointer border-none bg-surface/40 p-1 relative overflow-hidden">
                  <div className={`absolute top-0 right-0 size-24 -mr-8 -mt-8 rounded-full blur-3xl opacity-10 ${item.bg}`} />
                  <CardContent className="flex flex-col items-center gap-4 p-8 text-center relative z-10">
                    <div className={`grid size-16 place-items-center rounded-2xl ${item.bg} ${item.color} shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                      <item.icon className="size-8" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold tracking-tight text-white">{item.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <Card className="panel glow border-primary/20 bg-primary/[0.03]">
            <CardContent className="p-8">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/20 p-2 text-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                    <Zap className="size-6 fill-current" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">Gerar e Publicar com IA Zaply</h2>
                    <p className="text-sm text-muted-foreground">Descreva sua ideia e a IA cuida de tudo: do roteiro à publicação.</p>
                  </div>
                </div>
                
                <div className="relative">
                  <textarea 
                    placeholder="Ex: Faça um vídeo anunciando minha pizzaria com foco em promoção de terça-feira."
                    className="min-h-[140px] w-full resize-none rounded-2xl border border-border/60 bg-surface/50 p-6 text-lg transition-all focus:border-primary/50 focus:bg-surface/80 focus:outline-none focus:ring-4 focus:ring-primary/5 shadow-inner"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                  />
                  <div className="absolute bottom-4 right-4">
                    <Button 
                      size="lg" 
                      className="h-12 gap-2 rounded-xl px-8 font-bold shadow-lg shadow-primary/20"
                      onClick={handleGenerate}
                    >
                      GERAR <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Badge variant="outline" className="h-5 rounded-md px-1.5 text-[10px] uppercase font-bold">1</Badge> Escreva a ideia</span>
                  <ArrowRight className="size-3 opacity-30" />
                  <span className="flex items-center gap-1.5"><Badge variant="outline" className="h-5 rounded-md px-1.5 text-[10px] uppercase font-bold">2</Badge> IA gera e otimiza</span>
                  <ArrowRight className="size-3 opacity-30" />
                  <span className="flex items-center gap-1.5"><Badge variant="outline" className="h-5 rounded-md px-1.5 text-[10px] uppercase font-bold">3</Badge> Publica em todas as redes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="panel overflow-hidden border-primary/20 bg-primary/[0.02]">
              <CardContent className="flex items-center justify-between p-8">
                <div className="space-y-2">
                  <Badge className="bg-primary/20 text-primary border-primary/30 font-bold tracking-wider">MODO PROFISSIONAL ATIVO</Badge>
                  <h2 className="text-3xl font-bold tracking-tight">Editor Multimídia Completo</h2>
                  <p className="text-muted-foreground">Timeline, camadas, transições e biblioteca de ativos.</p>
                </div>
                <div className="rounded-2xl bg-primary p-4 shadow-xl shadow-primary/20">
                  <Wand2 className="size-10 text-white" />
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: "Editor de Vídeo", desc: "Timeline, legendas e músicas", icon: Video, url: "/criar" },
                { title: "Editor de Imagem", desc: "Remover fundo, filtros e IA", icon: ImageIcon, url: "/imagens" },
                { title: "Automação n8n", desc: "Fluxos de publicação real", icon: Zap, url: "/n8n" },
                { title: "Biblioteca Pro", desc: "Seus ativos e templates", icon: LayoutDashboard, url: "/biblioteca" },
              ].map((tool) => (
                <Link key={tool.title} to={tool.url as any}>
                  <Card className="panel panel-hover h-full bg-surface/30">
                    <CardContent className="flex items-center gap-4 p-6">
                      <div className="rounded-xl bg-primary/10 p-3 text-primary">
                        <tool.icon className="size-6" />
                      </div>
                      <div>
                        <h3 className="font-bold">{tool.title}</h3>
                        <p className="text-xs text-muted-foreground">{tool.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <Card className="panel border-dashed bg-card/20">
              <CardContent className="p-6">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Próximas Publicações</h3>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="panel-quiet flex items-center gap-3 p-3">
                      <div className="size-10 rounded-lg bg-surface flex items-center justify-center">
                        <Timer className="size-5 text-muted-foreground/50" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold">Post de exemplo #{i}</p>
                        <p className="text-[10px] text-muted-foreground">Amanhã, 09:00</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full text-xs font-bold text-primary" asChild>
                    <Link to="/agendamento">Ver calendário completo</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="panel bg-primary/[0.02] border-primary/10">
              <CardContent className="p-6 space-y-4 text-center">
                <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
                  <Plus className="size-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Nova Campanha</h3>
                  <p className="text-xs text-muted-foreground">Inicie um fluxo de 30 dias com IA.</p>
                </div>
                <Button className="w-full h-9 text-xs font-bold" asChild>
                  <Link to="/automatico">CRIAR AGORA</Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      )}
    </div>
  );
}
