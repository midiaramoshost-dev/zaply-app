import { createFileRoute, Link } from "@tanstack/react-router";
import { LayoutDashboard, Users, CreditCard, Settings, Globe, Bot, ShieldCheck, Loader2, Save, Palette, Type, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AdminOverview } from "@/modules/admin/components/admin-overview";
import { AdminTenants } from "@/modules/admin/components/admin-tenants";
import { AdminAiGateway } from "@/modules/admin/components/admin-ai-gateway";
import { Suspense, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useServerFn } from "@tanstack/react-start";
import { getPlatformSettings, updatePlatformSetting, getFinanceStats } from "@/modules/admin/services/platform-management.functions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminMasterPage,
});

function AdminMasterPage() {
  const queryClient = useQueryClient();
  const fetchSettings = useServerFn(getPlatformSettings);
  const saveSetting = useServerFn(updatePlatformSetting);
  const fetchFinance = useServerFn(getFinanceStats);

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ["platform-settings"],
    queryFn: () => fetchSettings(),
  });

  const { data: finance } = useQuery({
    queryKey: ["finance-stats"],
    queryFn: () => fetchFinance(),
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { key: string; value: any }) => saveSetting({ data: vars }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform-settings"] });
      toast.success("Configuração salva com sucesso!");
    },
    onError: () => toast.error("Erro ao salvar configuração."),
  });

  const [localLanding, setLocalLanding] = useState<any>(null);

  useEffect(() => {
    if (settings?.landing_page) {
      setLocalLanding(settings.landing_page);
    }
  }, [settings]);

  if (settingsLoading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="size-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/15 text-primary">
            <ShieldCheck className="size-6" />
          </div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Central de Controle Master</h1>
        </div>
        <p className="text-muted-foreground">Gestão global da infraestrutura Zaply Enterprise.</p>
      </header>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-surface/50 p-1 border border-border/50 h-12 inline-flex">
          <TabsTrigger value="overview" className="gap-2 px-6"><LayoutDashboard className="size-4" /> Geral</TabsTrigger>
          <TabsTrigger value="tenants" className="gap-2 px-6"><Users className="size-4" /> Tenants</TabsTrigger>
          <TabsTrigger value="ai" className="gap-2 px-6"><Bot className="size-4" /> IA Gateway</TabsTrigger>
          <TabsTrigger value="finance" className="gap-2 px-6"><CreditCard className="size-4" /> Financeiro</TabsTrigger>
          <TabsTrigger value="site" className="gap-2 px-6"><Globe className="size-4" /> Gestão do Site</TabsTrigger>
          <TabsTrigger value="settings" className="gap-2 px-6"><Settings className="size-4" /> Sistema</TabsTrigger>
        </TabsList>

        <Suspense fallback={
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary/40" />
          </div>
        }>
          <TabsContent value="overview" className="space-y-6 outline-none">
            <AdminOverview />
          </TabsContent>
          
          <TabsContent value="tenants" className="outline-none">
            <AdminTenants />
          </TabsContent>
          
          <TabsContent value="ai" className="outline-none">
            <AdminAiGateway />
          </TabsContent>

          <TabsContent value="finance" className="outline-none space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="panel border-border/50 bg-surface/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Receita Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{finance?.totalRevenue || "R$ 0,00"}</div>
                </CardContent>
              </Card>
              <Card className="panel border-border/50 bg-surface/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">MRR Estimado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{finance?.mrr || "R$ 0,00"}</div>
                </CardContent>
              </Card>
              <Card className="panel border-border/50 bg-surface/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Faturas Pagas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{finance?.invoiceCount || 0}</div>
                </CardContent>
              </Card>
            </div>
            <Card className="panel border-border/50 bg-surface/30">
              <CardHeader>
                <CardTitle>Histórico de Transações</CardTitle>
                <CardDescription>Fluxo de caixa global da plataforma.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border/30 rounded-2xl">
                  Integração Stripe Live solicitada. Exibindo dados de teste.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="site" className="outline-none space-y-6">
            <Card className="panel border-border/50 bg-surface/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Globe className="size-5 text-primary" /> Editor da Landing Page</CardTitle>
                <CardDescription>Edite o conteúdo público do Zaply em tempo real.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {localLanding && (
                  <>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-white flex items-center gap-2"><Type className="size-4" /> Headline Principal</label>
                        <Input 
                          value={localLanding.hero.headline} 
                          onChange={(e) => setLocalLanding({...localLanding, hero: {...localLanding.hero, headline: e.target.value}})}
                          className="bg-surface/50"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-white flex items-center gap-2"><Type className="size-4" /> Subheadline</label>
                        <Textarea 
                          value={localLanding.hero.subheadline} 
                          onChange={(e) => setLocalLanding({...localLanding, hero: {...localLanding.hero, subheadline: e.target.value}})}
                          className="bg-surface/50 h-24"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-white flex items-center gap-2"><Search className="size-4" /> SEO Title</label>
                        <Input 
                          value={localLanding.seo.title} 
                          onChange={(e) => setLocalLanding({...localLanding, seo: {...localLanding.seo, title: e.target.value}})}
                          className="bg-surface/50"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-white flex items-center gap-2"><Palette className="size-4" /> Cor Primária (Neon)</label>
                        <div className="flex gap-2">
                          <Input 
                            value={settings.branding.primary_color} 
                            onChange={(e) => updateMutation.mutate({ key: 'branding', value: {...settings.branding, primary_color: e.target.value} })}
                            className="bg-surface/50 font-mono"
                          />
                          <div className="size-10 rounded-lg border border-white/10" style={{ backgroundColor: settings.branding.primary_color }} />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" asChild>
                        <Link to="/">Visualizar Site</Link>
                      </Button>
                      <Button onClick={() => updateMutation.mutate({ key: 'landing_page', value: localLanding })} disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
                        Salvar Alterações
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="outline-none space-y-6">
            <Card className="panel border-border/50 bg-surface/30">
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>Parâmetros globais de operação do Zaply.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="panel p-4 bg-surface/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Modo de Manutenção</p>
                      <p className="text-xs text-muted-foreground">Bloqueia acesso de usuários comuns.</p>
                    </div>
                    <Button 
                      variant={settings.system_config.maintenance_mode ? "destructive" : "outline"}
                      onClick={() => updateMutation.mutate({ key: 'system_config', value: {...settings.system_config, maintenance_mode: !settings.system_config.maintenance_mode} })}
                    >
                      {settings.system_config.maintenance_mode ? "Desativar" : "Ativar"}
                    </Button>
                  </div>
                </div>
                <div className="panel p-4 bg-surface/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Trial Grátis</p>
                      <p className="text-xs text-muted-foreground">Duração do período de teste em horas.</p>
                    </div>
                    <Input 
                      type="number"
                      className="w-20 bg-background/50 text-center" 
                      defaultValue={settings.system_config.trial_duration_hours} 
                      onBlur={(e) => updateMutation.mutate({ key: 'system_config', value: {...settings.system_config, trial_duration_hours: parseInt(e.target.value)} })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Suspense>
      </Tabs>
    </div>
  );
}


