import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { LayoutDashboard, Globe, Bot, CreditCard, Settings, Users, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { getAdminStats, getRecentTenants, getPendingApprovals, approveUser } from "../services/admin.functions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function AdminOverview() {
  const fetchStats = useServerFn(getAdminStats);
  const fetchTenants = useServerFn(getRecentTenants);
  const fetchPending = useServerFn(getPendingApprovals);
  const runApproval = useServerFn(approveUser);

  const { data: stats } = useSuspenseQuery({ 
    queryKey: ['admin-stats'], 
    queryFn: () => fetchStats() 
  });
  
  const { data: tenants } = useSuspenseQuery({ 
    queryKey: ['recent-tenants'], 
    queryFn: () => fetchTenants() 
  });

  const { data: pending, refetch: refetchPending } = useSuspenseQuery({
    queryKey: ['pending-approvals'],
    queryFn: () => fetchPending()
  });

  const handleApprove = async (userId: string) => {
    try {
      await runApproval({ data: { userId } });
      toast.success("Usuário aprovado com sucesso!");
      refetchPending();
    } catch (e) {
      toast.error("Erro ao aprovar usuário.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total de Tenants" value={stats.tenants.toString()} description="+12 este mês" />
        <StatsCard title="Usuários Ativos" value={stats.users.toString()} description="85% de retenção" />
        <StatsCard title="Tokens Consumidos" value={stats.tokens} description="Custo: $124.00" />
        <StatsCard title="Receita Mensal" value={stats.revenue} description="+15% vs mês anterior" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {pending.length > 0 && (
          <Card className="panel border-primary/20 bg-primary/[0.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-primary flex items-center gap-2">
                  <ShieldCheck className="size-4" /> Aprovações Pendentes
                </CardTitle>
                <CardDescription>Usuários aguardando liberação master.</CardDescription>
              </div>
              <Badge variant="secondary">{pending.length}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {pending.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-surface/50 border border-border/50">
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{p.full_name || p.email}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{p.tenants?.name || 'Sem empresa'}</p>
                  </div>
                  <Button size="sm" className="h-8 rounded-lg" onClick={() => handleApprove(p.id)}>
                    <CheckCircle2 className="size-3 mr-1" /> Liberar
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card className="panel border-border/50 bg-surface/30">
          <CardHeader>
            <CardTitle>Health Check Provedores IA</CardTitle>
            <CardDescription>Status em tempo real da "IA Zaply".</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProviderStatus name="Motor Principal (Google Gemini)" status="online" latency="120ms" />
            <ProviderStatus name="Motor Criativo (OpenAI)" status="online" latency="145ms" />
            <ProviderStatus name="Geração de Imagens" status="online" latency="850ms" />
          </CardContent>
        </Card>

        <Card className="panel border-border/50 bg-surface/30">
          <CardHeader>
            <CardTitle>Tenants Recentes</CardTitle>
            <CardDescription>Últimas empresas registradas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tenants.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/20">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    {t.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{t.name}</span>
                </div>
                <Badge variant="outline" className="text-[9px] uppercase">{t.subscription_status || 'Trial'}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
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
