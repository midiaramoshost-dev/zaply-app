
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { getUsersList, updateUserStatus, adjustCredits } from "../services/admin.functions";
import { Loader2, User, Coins, Search, ShieldCheck, ShieldAlert, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AdminUsersCredits() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin", "users-list"],
    queryFn: () => getUsersList(),
  });

  const toggleStatus = useMutation({
    mutationFn: (vars: { id: string; active: boolean }) => 
      updateUserStatus({ data: { userId: vars.id, isActive: vars.active } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users-list"] });
      toast.success("Status do usuário atualizado");
    }
  });

  const updateCredits = useMutation({
    mutationFn: (vars: { id: string; amount: number }) => 
      adjustCredits({ data: { userId: vars.id, amount: vars.amount } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users-list"] });
      toast.success("Créditos atualizados");
    }
  });

  if (isLoading) return <Loader2 className="animate-spin mx-auto mt-10" />;

  const filteredUsers = users?.filter((u: any) => 
    u.email?.toLowerCase().includes(search.toLowerCase()) || 
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nome ou email..." 
            className="pl-10 bg-surface/30 border-border/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card className="panel border-border/50 bg-surface/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-5 text-primary" /> Gestão de Usuários & Créditos
          </CardTitle>
          <CardDescription>Gerencie o acesso e o saldo de tokens de todos os usuários da plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Créditos</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers?.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-white">{user.full_name || 'Usuário sem nome'}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tight">
                      {user.tenants?.name || 'Individual'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={user.is_active} 
                        onCheckedChange={(val) => toggleStatus.mutate({ id: user.id, active: val })}
                      />
                      {user.is_active ? (
                        <ShieldCheck className="size-3 text-emerald-500" />
                      ) : (
                        <ShieldAlert className="size-3 text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 text-primary font-mono text-sm border border-primary/20">
                        <Coins className="size-3" />
                        {user.user_credits?.[0]?.balance || 0}
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="size-7 border-border/50"
                          onClick={() => updateCredits.mutate({ id: user.id, amount: 50 })}
                        >
                          <Plus className="size-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="size-7 border-border/50"
                          onClick={() => updateCredits.mutate({ id: user.id, amount: -50 })}
                        >
                          <Minus className="size-3" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-xs h-8">Detalhes</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
