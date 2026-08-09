import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAuditLogs } from "../services/admin.functions";
import { Loader2, Activity, History } from "lucide-react";

export function AdminAuditLogs() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["admin", "audit-logs"],
    queryFn: () => getAuditLogs(),
  });

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary size-8" /></div>;

  return (
    <Card className="panel border-border/50 bg-surface/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="size-5 text-primary" /> Auditoria & Logs
        </CardTitle>
        <CardDescription>Rastreabilidade completa de ações administrativas e mudanças no sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ação</TableHead>
              <TableHead>Entidade</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs?.map((log: any) => (
              <TableRow key={log.id} className="hover:bg-white/5 transition-colors">
                <TableCell>
                  <span className="font-bold text-white">{log.action}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px] uppercase font-mono">
                    {log.entity_type}:{log.entity_id?.substring(0, 8) || 'global'}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs font-mono">
                  {new Date(log.created_at).toLocaleString('pt-BR')}
                </TableCell>
                <TableCell>
                  {log.payload && (
                    <pre className="text-[10px] bg-black/30 p-2 rounded border border-white/5 max-w-xs truncate overflow-hidden">
                      {JSON.stringify(log.payload)}
                    </pre>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {logs?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                  Nenhum log registrado ainda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
