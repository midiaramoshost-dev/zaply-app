import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { getAIProviders, toggleProvider } from "../services/admin-management.functions";
import { Loader2, Cpu, Zap, Activity } from "lucide-react";
import { toast } from "sonner";

export function AdminAiGateway() {
  const queryClient = useQueryClient();
  const { data: providers, isLoading } = useQuery({
    queryKey: ["admin", "ai-providers"],
    queryFn: () => getAIProviders(),
  });

  const toggle = useMutation({
    mutationFn: (vars: { id: string; active: boolean }) => 
      toggleProvider({ data: { providerId: vars.id, isActive: vars.active } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "ai-providers"] });
      toast.success("Status do provedor atualizado");
    }
  });

  if (isLoading) return <Loader2 className="animate-spin mx-auto mt-10" />;

  return (
    <div className="space-y-6">
      <Card className="panel border-border/50 bg-surface/30">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="size-5 text-primary" />
                Zaply AI Router Enterprise
              </CardTitle>
              <CardDescription>
                Gerenciamento global de inteligência artificial e fallback de modelos.
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1">
              <Activity className="size-3" /> Operacional
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers?.map((provider: any) => (
          <Card key={provider.id} className="panel bg-surface/20 border-border/40">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Zap className="size-4 text-primary" />
                  </div>
                  <h3 className="font-bold capitalize">{provider.name}</h3>
                </div>
                <Switch 
                  checked={provider.is_active} 
                  onCheckedChange={(val) => toggle.mutate({ id: provider.id, active: val })}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Prioridade</span>
                  <span className="font-mono text-primary">{provider.priority}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Modelos Ativos</p>
                  <div className="flex flex-wrap gap-2">
                    {provider.ai_models?.filter((m: any) => m.is_active).map((model: any) => (
                      <Badge key={model.id} variant="secondary" className="bg-surface/40 text-[10px]">
                        {model.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
