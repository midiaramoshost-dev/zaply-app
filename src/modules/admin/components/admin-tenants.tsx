import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { getTenantsList, updateTenantStatus } from "../services/admin-management.functions";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export function AdminTenants() {
  const queryClient = useQueryClient();
  const { data: tenants, isLoading } = useQuery({
    queryKey: ["admin", "tenants"],
    queryFn: () => getTenantsList(),
  });

  const updateStatus = useMutation({
    mutationFn: (vars: { id: string; status: string }) => 
      updateTenantStatus({ data: { tenantId: vars.id, status: vars.status } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "tenants"] });
      toast.success("Status do tenant atualizado");
    }
  });

  if (isLoading) return <Loader2 className="animate-spin mx-auto mt-10" />;

  return (
    <Card className="panel border-border/50 bg-surface/30">
      <CardHeader>
        <CardTitle>Gestão de Clientes (Tenants)</CardTitle>
        <CardDescription>Administre todas as organizações e seus status de assinatura.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organização</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants?.map((tenant: any) => (
              <TableRow key={tenant.id}>
                <TableCell className="font-medium">{tenant.name}</TableCell>
                <TableCell className="text-muted-foreground">{tenant.slug}</TableCell>
                <TableCell>
                  <Badge variant={tenant.subscription_status === 'active' ? 'default' : 'secondary'} className="gap-1">
                    {tenant.subscription_status === 'active' ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
                    {tenant.subscription_status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(tenant.created_at).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateStatus.mutate({ 
                      id: tenant.id, 
                      status: tenant.subscription_status === 'active' ? 'past_due' : 'active' 
                    })}
                  >
                    {tenant.subscription_status === 'active' ? 'Suspender' : 'Ativar'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
