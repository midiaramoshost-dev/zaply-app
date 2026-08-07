import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, Users, MessageSquare, CreditCard, Settings, Globe, Database, Bot } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const Route = createFileRoute("/admin")({
  component: AdminMasterPage,
});

function AdminMasterPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Central de Controle Master</h1>
          <p className="text-muted-foreground mt-1">Gestão global do ecossistema Zaply Enterprise.</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-surface/50 p-1 border border-border/50">
          <TabsTrigger value="overview" className="gap-2"><LayoutDashboard className="size-4" /> Geral</TabsTrigger>
          <TabsTrigger value="tenants" className="gap-2"><Globe className="size-4" /> Empresas (Tenants)</TabsTrigger>
          <TabsTrigger value="ai" className="gap-2"><Bot className="size-4" /> IA Gateway</TabsTrigger>
          <TabsTrigger value="billing" className="gap-2"><CreditCard className="size-4" /> Financeiro</TabsTrigger>
          <TabsTrigger value="settings" className="gap-2"><Settings className="size-4" /> Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Total de Tenants" value="124" description="+12 este mês" />
            <StatsCard title="Usuários Ativos" value="1,240" description="85% de retenção" />
            <StatsCard title="Tokens Consumidos" value="1.2M" description="Custo: $124.00" />
            <StatsCard title="Receita Mensal" value="R$ 45.2k" description="+15% vs mês anterior" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="panel border-border/50 bg-surface/30">
              <CardHeader>
                <CardTitle>Health Check Provedores IA</CardTitle>
                <CardDescription>Status em tempo real dos backends.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProviderStatus name="OpenAI (GPT-4o)" status="online" latency="120ms" />
                <ProviderStatus name="Anthropic (Claude 3.5)" status="online" latency="145ms" />
                <ProviderStatus name="Google Gemini" status="degraded" latency="850ms" />
                <ProviderStatus name="Groq (Llama 3)" status="online" latency="45ms" />
              </CardContent>
            </Card>

            <Card className="panel border-border/50 bg-surface/30">
              <CardHeader>
                <CardTitle>Últimos Tenants Criados</CardTitle>
                <CardDescription>Empresas recém-embarcadas no sistema.</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Tabela de tenants simplificada */}
                <div className="text-sm text-muted-foreground italic">Carregando lista de empresas...</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="ai">
          <Card className="panel border-border/50 bg-surface/30">
            <CardHeader>
              <CardTitle>Configuração Global do AI Router</CardTitle>
              <CardDescription>Gerencie o balanceamento e fallback entre LLMs.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="p-12 text-center border-2 border-dashed border-border/30 rounded-xl">
                 <Bot className="size-12 mx-auto mb-4 text-muted-foreground/30" />
                 <p className="text-muted-foreground">Módulo de IA Gateway Centralizado</p>
                 <p className="text-xs text-muted-foreground/50 mt-2">Funcionalidade Enterprise: Multi-API Key & Smart Balancing</p>
               </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatsCard({ title, value, description }: { title: string; value: string; description: string }) {
  return (
    <Card className="panel border-border/50 bg-surface/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

function ProviderStatus({ name, status, latency }: { name: string; status: 'online' | 'degraded' | 'offline'; latency: string }) {
  const colors = {
    online: 'bg-green-500',
    degraded: 'bg-amber-500',
    offline: 'bg-red-500'
  };

  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-border/20">
      <div className="flex items-center gap-3">
        <div className={`size-2 rounded-full ${colors[status]} shadow-lg shadow-${status}/50`} />
        <span className="text-sm font-medium">{name}</span>
      </div>
      <span className="text-xs text-muted-foreground font-mono">{latency}</span>
    </div>
  );
}
