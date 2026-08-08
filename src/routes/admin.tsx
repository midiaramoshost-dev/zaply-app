import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, Users, CreditCard, Settings, Globe, Bot, ShieldCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AdminOverview } from "@/modules/admin/components/admin-overview";
import { AdminTenants } from "@/modules/admin/components/admin-tenants";
import { AdminAiGateway } from "@/modules/admin/components/admin-ai-gateway";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminMasterPage,
});

function AdminMasterPage() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
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
        <TabsList className="bg-surface/50 p-1 border border-border/50 h-12">
          <TabsTrigger value="overview" className="gap-2 px-6"><LayoutDashboard className="size-4" /> Geral</TabsTrigger>
          <TabsTrigger value="tenants" className="gap-2 px-6"><Globe className="size-4" /> Tenants</TabsTrigger>
          <TabsTrigger value="ai" className="gap-2 px-6"><Bot className="size-4" /> IA Gateway</TabsTrigger>
          <TabsTrigger value="billing" className="gap-2 px-6"><CreditCard className="size-4" /> Financeiro</TabsTrigger>
          <TabsTrigger value="settings" className="gap-2 px-6"><Settings className="size-4" /> Sistema</TabsTrigger>
          <TabsTrigger value="site" className="gap-2 px-6"><Globe className="size-4" /> Gestão do Site</TabsTrigger>
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

          <TabsContent value="site" className="outline-none">
            <Card className="panel border-border/50 bg-surface/30">
              <CardHeader>
                <CardTitle>Editor Global do Site</CardTitle>
                <CardDescription>Altere textos, Headlines e configurações visuais da Landing Page.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-10 text-center border-2 border-dashed border-border/30 rounded-2xl bg-surface/20">
                    <Globe className="size-12 mx-auto mb-4 text-primary/40" />
                    <h3 className="text-lg font-bold mb-2">Interface de Edição Visual</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                      Você pode editar o conteúdo da página inicial diretamente. Esta funcionalidade está sendo conectada ao repositório de conteúdo.
                    </p>
                    <Button variant="outline" asChild>
                      <Link to="/">Ver Site Agora</Link>
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-background/50">
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm">Headline Principal</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <textarea className="w-full bg-surface/50 border border-border/50 rounded p-2 text-xs h-20" defaultValue="Sua próxima ideia em escala." />
                        <Button size="sm" className="w-full">Salvar Alteração</Button>
                      </CardContent>
                    </Card>
                    <Card className="bg-background/50">
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm">Configuração de Cores (Brand)</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="size-6 rounded bg-[#d9f99d] border border-white/10" />
                          <span className="text-xs font-mono">#d9f99d (Neon Green)</span>
                        </div>
                        <Button size="sm" variant="outline" className="w-full">Alterar Tema</Button>
                      </CardContent>
                    </Card>
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

