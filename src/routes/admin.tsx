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

        </Suspense>
      </Tabs>
    </div>
  );
}

