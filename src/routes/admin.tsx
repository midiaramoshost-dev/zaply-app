import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  ShieldCheck,
  Users,
  Building2,
  FileText,
  CalendarClock,
  Send,
  MessageCircle,
  Loader2,
  Coins,
  Search,
  UserCheck,
  Clock3,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import {
  getPlatformStats,
  listPlatformUsers,
  grantUserCredits,
  type PlatformStats,
  type PlatformUser,
} from "@/lib/admin.functions";
import { useRole } from "@/hooks/use-role";
import { CreditsDialog } from "@/components/credits-dialog";
import { PageHeader } from "@/components/page-header";

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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

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

type Filter = "todos" | "aguardando" | "liberados" | "admins";

function displayName(member: Member) {
  return member.full_name || member.email || member.id.slice(0, 8);
}

function initials(member: Member) {
  const source = member.full_name || member.email || "U";
  return source
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function Avatar({ member }: { member: Member }) {
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/12 text-xs font-semibold text-primary ring-1 ring-primary/20">
      {initials(member)}
    </span>
  );
}

function AdminPage() {
  const { isAdmin, loading, user } = useRole();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("todos");
  const fetchUsersFn = useServerFn(listPlatformUsers);
  const fetchStatsFn = useServerFn(getPlatformStats);

  const load = useCallback(async () => {
    setBusy(true);
    const [statsRes, usersRes] = await Promise.all([
      fetchStatsFn().catch((e) => {
        console.error("Erro ao buscar estatísticas:", e);
        return null;
      }),
      fetchUsersFn().catch((e) => {
        console.error("Erro ao buscar usuários:", e);
        toast.error("Não foi possível carregar os usuários cadastrados.");
        return [] as PlatformUser[];
      }),
    ]);

    if (statsRes) {
      setStats({
        total_users: Number(statsRes.total_users),
        total_companies: Number(statsRes.total_companies),
        total_posts: Number(statsRes.total_posts),
        scheduled_posts: Number(statsRes.scheduled_posts),
        published_posts: Number(statsRes.published_posts),
        total_comments: Number(statsRes.total_comments),
      });
    }

    setMembers(
      (usersRes ?? []).map((p) => ({
        id: p.id,
        full_name: p.full_name,
        email: p.email,
        approved: p.approved,
        requested_plan: p.requested_plan,
        created_at: p.created_at,
        role: p.role,
        companies: p.companies,
        posts: p.posts,
        credits: p.credits,
      })),
    );
    setBusy(false);
  }, [fetchStatsFn, fetchUsersFn]);

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin, load]);

  const grantCreditsFn = useServerFn(grantUserCredits);

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
    
    // Se estiver liberando pela primeira vez e o usuário não tiver créditos, dá 10 de bônus inicial
    if (next && member.credits === 0) {
      try {
        await grantCreditsFn({
          data: { 
            userId: member.id, 
            amount: 10, 
            reason: "Bônus de ativação de conta" 
          }
        });
        toast.success("Acesso liberado com 10 créditos de bônus!");
      } catch (e) {
        console.error("Erro ao conceder bônus inicial:", e);
        toast.success("Acesso liberado (falha ao atribuir bônus inicial).");
      }
    } else {
      toast.success(next ? "Acesso liberado." : "Acesso bloqueado.");
    }
    
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

  const regularMembers = useMemo(() => members.filter((m) => m.role !== "admin"), [members]);
  const pending = regularMembers.filter((m) => !m.approved).length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      if (filter === "aguardando" && (m.role === "admin" || m.approved)) return false;
      if (filter === "liberados" && (m.role === "admin" || !m.approved)) return false;
      if (filter === "admins" && m.role !== "admin") return false;
      if (!q) return true;
      return `${m.full_name ?? ""} ${m.email ?? ""}`.toLowerCase().includes(q);
    });
  }, [members, filter, query]);

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

  const cards = [
    { label: "Usuários", value: stats?.total_users ?? 0, icon: Users, hint: "contas cadastradas" },
    { label: "Empresas/clientes", value: stats?.total_companies ?? 0, icon: Building2, hint: "marcas ativas" },
    { label: "Posts criados", value: stats?.total_posts ?? 0, icon: FileText, hint: "total na plataforma" },
    { label: "Agendados", value: stats?.scheduled_posts ?? 0, icon: CalendarClock, hint: "na fila" },
    { label: "Publicados", value: stats?.published_posts ?? 0, icon: Send, hint: "já no ar" },
    { label: "Comentários", value: stats?.total_comments ?? 0, icon: MessageCircle, hint: "recebidos" },
  ];

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: "todos", label: "Todos", count: members.length },
    { key: "aguardando", label: "Aguardando", count: pending },
    { key: "liberados", label: "Liberados", count: regularMembers.filter((m) => m.approved).length },
    { key: "admins", label: "Admins", count: members.length - regularMembers.length },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Administrador master"
        title="Central de controle"
        description="Acompanhe a operação da plataforma, crie novos usuários e libere acessos em um só lugar."
        icon={ShieldCheck}
        actions={
          <>
            {pending > 0 && (
              <Badge variant="outline" className="border-warning/50 text-warning">
                <Clock3 className="mr-1 size-3" /> {pending} aguardando
              </Badge>
            )}
            <Button size="sm" variant="outline" onClick={() => void load()} disabled={busy}>
              {busy ? <Loader2 className="mr-1.5 size-3.5 animate-spin" /> : null} Atualizar
            </Button>
          </>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((c) => (
            <article key={c.label} className="kpi-card flex items-center gap-4 p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/20">
                <c.icon className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  {c.label}
                </p>
                <p className="font-display text-2xl font-semibold tabular-nums leading-tight">{c.value}</p>
                <p className="truncate text-[11px] text-muted-foreground/80">{c.hint}</p>
              </div>
            </article>
          ))}
        </div>
      </PageHeader>

      <Tabs defaultValue="usuarios" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usuarios">
            <UserCheck className="mr-1.5 size-3.5" /> Usuários
          </TabsTrigger>
          <TabsTrigger value="creditos">
            <Coins className="mr-1.5 size-3.5" /> Créditos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="space-y-4">
          <Card className="panel">
            <CardHeader className="gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-base">Usuários da plataforma</CardTitle>
                  <Button size="sm" onClick={() => toast.info("Funcionalidade de criação de usuário pelo admin em desenvolvimento.")}>
                    Novo usuário
                  </Button>
                </div>
                <div className="relative w-full max-w-xs">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar por nome ou e-mail"
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.map((f) => (
                  <Button
                    key={f.key}
                    size="sm"
                    variant={filter === f.key ? "default" : "outline"}
                    onClick={() => setFilter(f.key)}
                  >
                    {f.label}
                    <span className="ml-1.5 tabular-nums opacity-70">{f.count}</span>
                  </Button>
                ))}
              </div>
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
                    <TableHead>Desde</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="max-w-[260px]">
                        <div className="flex items-center gap-3">
                          <Avatar member={m} />
                          <div className="min-w-0">
                            <span className="block truncate text-sm font-medium">
                              {displayName(m)}
                              {m.id === user.id && (
                                <span className="ml-2 text-xs text-muted-foreground">(você)</span>
                              )}
                            </span>
                            {m.email && (
                              <span className="block truncate text-xs text-muted-foreground">{m.email}</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={m.role === "admin" || m.approved ? "default" : "outline"}>
                          {m.role === "admin" ? "Acesso total" : m.approved ? "Liberado" : "Aguardando"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs uppercase text-muted-foreground">
                        {m.role === "admin" ? "—" : m.requested_plan || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={m.role === "admin" ? "default" : "secondary"}>
                          {m.role === "admin" ? "Admin master" : "Usuário"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{m.companies}</TableCell>
                      <TableCell className="text-right tabular-nums">{m.posts}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(m.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {m.role !== "admin" && (
                            <>
                              <CreditsDialog
                                userId={m.id}
                                name={displayName(m)}
                                balance={m.credits}
                                onDone={() => void load()}
                              />
                              <Button
                                size="sm"
                                variant={m.approved ? "outline" : "default"}
                                disabled={m.id === user.id}
                                onClick={() => void toggleApproval(m)}
                              >
                                {m.approved ? "Bloquear" : "Liberar"}
                              </Button>
                            </>
                          )}
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
                  {!filtered.length && (
                    <TableRow>
                      <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                        {busy ? "Carregando usuários…" : "Nenhum usuário encontrado com esse filtro."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creditos">
          <Card className="panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Coins className="size-4 text-primary" /> Gestão de créditos
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Gere ou retire créditos das contas de usuário. Administradores master têm acesso total e
                não usam créditos.
              </p>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {regularMembers.map((member) => (
                <div
                  key={member.id}
                  className="panel-quiet flex min-w-0 items-center justify-between gap-3 p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar member={member} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{displayName(member)}</p>
                      <p className="text-xs text-muted-foreground">
                        Saldo:{" "}
                        <span className="font-semibold tabular-nums text-primary">{member.credits}</span>
                      </p>
                    </div>
                  </div>
                  <CreditsDialog
                    userId={member.id}
                    name={displayName(member)}
                    balance={member.credits}
                    onDone={() => void load()}
                  />
                </div>
              ))}
              {!regularMembers.length && !busy && (
                <p className="text-sm text-muted-foreground">Nenhuma conta de usuário cadastrada.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
