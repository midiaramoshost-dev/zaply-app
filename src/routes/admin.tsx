import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ShieldCheck, Users, Building2, FileText, CalendarClock, Send, MessageCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { listPlatformUsers, type PlatformUser } from "@/lib/admin.functions";
import { useRole } from "@/hooks/use-role";
import { CreditsDialog } from "@/components/credits-dialog";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel do administrador — Zaply" },
      {
        name: "description",
        content: "Painel master: usuários, empresas, posts e comentários de toda a plataforma Zaply.",
      },
      { property: "og:title", content: "Painel do administrador — Zaply" },
      {
        property: "og:description",
        content: "Painel master: usuários, empresas, posts e comentários de toda a plataforma Zaply.",
      },
    ],
  }),
  component: AdminPage,
});

type Stats = {
  total_users: number;
  total_companies: number;
  total_posts: number;
  scheduled_posts: number;
  published_posts: number;
  total_comments: number;
};

type Member = {
  id: string;
  full_name: string | null;
  email: string | null;
  approved: boolean;
  requested_plan: string | null;
  created_at: string;
  role: "admin" | "user";
  companies: number;
  posts: number;
  credits: number;
};

function AdminPage() {
  const { isAdmin, loading, user } = useRole();
  const [stats, setStats] = useState<Stats | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [busy, setBusy] = useState(false);
  const fetchUsers = useServerFn(listPlatformUsers);

  const load = useCallback(async () => {
    setBusy(true);
    const [statsRes, usersRes, companiesRes, postsRes, creditsRes] = await Promise.all([
      supabase.rpc("admin_platform_stats"),
      fetchUsers().catch((e: unknown) => {
        console.error(e);
        toast.error("Não foi possível carregar os usuários cadastrados.");
        return [] as PlatformUser[];
      }),
      supabase.from("companies").select("owner_id"),
      supabase.from("posts").select("user_id"),
      supabase.from("user_credits").select("user_id, balance"),
    ]);

    const creditMap = new Map(
      (creditsRes.data ?? []).map((c) => [c.user_id, Number(c.balance)]),
    );

    const row = (statsRes.data as Stats[] | null)?.[0];
    if (row) {
      setStats({
        total_users: Number(row.total_users),
        total_companies: Number(row.total_companies),
        total_posts: Number(row.total_posts),
        scheduled_posts: Number(row.scheduled_posts),
        published_posts: Number(row.published_posts),
        total_comments: Number(row.total_comments),
      });
    }

    const countBy = (rows: { [k: string]: unknown }[] | null, key: string) => {
      const m = new Map<string, number>();
      for (const r of rows ?? []) {
        const id = r[key] as string | null;
        if (!id) continue;
        m.set(id, (m.get(id) ?? 0) + 1);
      }
      return m;
    };
    const companyCount = countBy(companiesRes.data as never, "owner_id");
    const postCount = countBy(postsRes.data as never, "user_id");

    setMembers(
      (usersRes ?? []).map((p) => ({
        id: p.id,
        full_name: p.full_name,
        email: p.email,
        approved: p.approved,
        requested_plan: p.requested_plan,
        created_at: p.created_at,
        role: p.role,
        companies: companyCount.get(p.id) ?? 0,
        posts: postCount.get(p.id) ?? 0,
        credits: creditMap.get(p.id) ?? 0,
      })),
    );
    setBusy(false);
  }, [fetchUsers]);

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin, load]);

  async function toggleApproval(member: Member) {
    const next = !member.approved;
    const { error } = await supabase
      .from("profiles")
      .update({
        approved: next,
        approved_at: next ? new Date().toISOString() : null,
        approved_by: next ? (user?.id ?? null) : null,
      })
      .eq("id", member.id);
    if (error) return toast.error("Não foi possível atualizar a liberação.");
    toast.success(next ? "Acesso liberado." : "Acesso bloqueado.");
    void load();
  }

  async function toggleAdmin(member: Member) {
    if (member.id === user?.id) {
      toast.error("Você não pode alterar o seu próprio papel.");
      return;
    }
    if (member.role === "admin") {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", member.id)
        .eq("role", "admin");
      if (error) return toast.error("Não foi possível remover o acesso.");
      toast.success("Acesso de administrador removido.");
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: member.id, role: "admin" });
      if (error) return toast.error("Não foi possível conceder o acesso.");
      toast.success("Usuário promovido a administrador.");
    }
    void load();
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-8 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Verificando permissões…
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="panel mx-auto mt-10 max-w-md">
        <CardHeader>
          <CardTitle>Entre para continuar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>Este painel é exclusivo do administrador master.</p>
          <Button asChild size="sm">
            <Link to="/auth">Entrar</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!isAdmin) {
    return (
      <Card className="panel mx-auto mt-10 max-w-md">
        <CardHeader>
          <CardTitle>Acesso restrito</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>Sua conta não tem permissão de administrador master.</p>
          <Button asChild size="sm" variant="outline">
            <Link to="/conta">Ir para o meu painel</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const pending = members.filter((m) => !m.approved).length;

  const cards = [
    { label: "Usuários", value: stats?.total_users ?? 0, icon: Users },
    { label: "Empresas/clientes", value: stats?.total_companies ?? 0, icon: Building2 },
    { label: "Posts criados", value: stats?.total_posts ?? 0, icon: FileText },
    { label: "Agendados", value: stats?.scheduled_posts ?? 0, icon: CalendarClock },
    { label: "Publicados", value: stats?.published_posts ?? 0, icon: Send },
    { label: "Comentários", value: stats?.total_comments ?? 0, icon: MessageCircle },
  ];

  return (
    <div className="space-y-6">
      <header className="panel flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6">
        <div className="space-y-1">
          <Badge variant="outline" className="gap-1 text-primary">
            <ShieldCheck className="size-3" /> Administrador master
          </Badge>
          <h1 className="font-display text-2xl font-semibold">Painel da plataforma</h1>
          <p className="text-sm text-muted-foreground">
            Visão consolidada de todas as contas, empresas e conteúdos do Zaply.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => void load()} disabled={busy}>
          {busy ? <Loader2 className="size-3.5 animate-spin" /> : null} Atualizar
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label} className="panel">
            <CardContent className="flex items-center gap-4 p-5">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/12 text-primary">
                <c.icon className="size-4" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{c.label}</p>
                <p className="font-display text-2xl font-semibold">{c.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="panel">
        <CardHeader>
          <CardTitle className="text-base">
            Usuários da plataforma
            {pending > 0 && (
              <Badge variant="outline" className="ml-2 border-primary/50 text-primary">
                {pending} aguardando liberação
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plano pedido</TableHead>
                <TableHead>Papel</TableHead>
                <TableHead className="text-right">Clientes</TableHead>
                <TableHead className="text-right">Posts</TableHead>
                <TableHead className="text-right">Créditos</TableHead>
                <TableHead>Desde</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="max-w-[220px]">
                    <span className="block truncate">
                      {m.full_name || m.email || m.id.slice(0, 8)}
                      {m.id === user.id && (
                        <span className="ml-2 text-xs text-muted-foreground">(você)</span>
                      )}
                    </span>
                    {m.email && (
                      <span className="block truncate text-xs text-muted-foreground">{m.email}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={m.approved ? "default" : "outline"}>
                      {m.approved ? "Liberado" : "Aguardando"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs uppercase text-muted-foreground">
                    {m.requested_plan || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={m.role === "admin" ? "default" : "secondary"}>
                      {m.role === "admin" ? "Admin master" : "Usuário"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{m.companies}</TableCell>
                  <TableCell className="text-right">{m.posts}</TableCell>
                  <TableCell className="text-right font-medium text-primary">{m.credits}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(m.created_at).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant={m.approved ? "outline" : "default"}
                        disabled={m.id === user.id}
                        onClick={() => void toggleApproval(m)}
                      >
                        {m.approved ? "Bloquear" : "Liberar"}
                      </Button>
                      <CreditsDialog
                        userId={m.id}
                        name={m.full_name || m.email || m.id.slice(0, 8)}
                        balance={m.credits}
                        onDone={() => void load()}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={m.id === user.id}
                        onClick={() => void toggleAdmin(m)}
                      >
                        {m.role === "admin" ? "Remover admin" : "Tornar admin"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!members.length && (
                <TableRow>
                  <TableCell colSpan={9} className="py-8 text-center text-sm text-muted-foreground">
                    Nenhum usuário cadastrado ainda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
