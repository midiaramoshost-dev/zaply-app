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
  Sparkles,
  Zap,
  Instagram,
  Facebook,
  Linkedin,
  Zap as ZapIcon,
  Workflow,
  Music2,
  Youtube,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { AdminTour } from "@/components/admin-tour";


import { z } from "zod";

const adminSearchSchema = z.object({
  tab: z.enum(["usuarios", "sistema"]).optional().default("usuarios"),
});

export const Route = createFileRoute("/admin")({
  validateSearch: (search) => adminSearchSchema.parse(search),
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
  const search = Route.useSearch();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("todos");
  const fetchUsersFn = useServerFn(listPlatformUsers);
  const fetchStatsFn = useServerFn(getPlatformStats);

  const activeTab = search.tab;

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
      <AdminTour />
      <PageHeader
        eyebrow="Administrador master"
        title="Gestão da plataforma"
        description="Controle de usuários, liberação de acesso e distribuição de créditos de forma simples e rápida."
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
        <div className="flex flex-col gap-6">
          {pending > 0 && (
            <div className="flex items-center justify-between overflow-hidden rounded-xl border border-warning/30 bg-warning/5 backdrop-blur-sm">
              <div className="flex items-center gap-4 p-4">
                <div className="relative flex size-12 shrink-0 items-center justify-center rounded-xl bg-warning/10 text-warning">
                  <div className="absolute inset-0 size-full animate-ping rounded-xl bg-warning/20 opacity-20" />
                  <Clock3 className="size-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight text-warning">Aprovações pendentes</h4>
                  <p className="text-xs text-warning/70">Há {pending} novos usuários aguardando sua validação para começar a usar a Zaply.</p>
                </div>
              </div>
              <div className="border-l border-warning/20 p-4">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-9 gap-2 text-warning hover:bg-warning/10 hover:text-warning"
                  onClick={() => {
                    setFilter("aguardando");
                    const el = document.querySelector(".user-table-card");
                    el?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                >
                  Ver todos <Zap className="size-3.5" />
                </Button>
              </div>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-4">
            <div className="kpi-grid grid gap-3 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3">
              {cards.map((c) => (
                <article key={c.label} className="panel-quiet group relative flex flex-col gap-1 overflow-hidden p-4 transition-all hover:bg-primary/[0.03]">
                  <div className="absolute -right-2 -top-2 size-12 opacity-[0.03] transition-transform group-hover:scale-110 group-hover:opacity-[0.05]">
                    <c.icon className="size-full" />
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
                      <c.icon className="size-3.5" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/80">
                      {c.label}
                    </p>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="font-display text-2xl font-bold tabular-nums leading-none tracking-tight">{c.value}</p>
                    <p className="text-[10px] font-medium text-muted-foreground/50">{c.hint}</p>
                  </div>
                </article>
              ))}
            </div>

            <Card className="panel border-primary/20 bg-primary/[0.02]">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-primary">Ação Rápida</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4 pt-0">
                <Button variant="outline" className="h-9 w-full justify-start gap-2 text-xs font-semibold" onClick={() => void load()}>
                  <Loader2 className={`size-3.5 ${busy ? "animate-spin" : ""}`} /> Sincronizar dados
                </Button>
                <Button variant="default" className="h-9 w-full justify-start gap-2 text-xs font-semibold" onClick={() => toast.info("Relatório sendo gerado...")}>
                  <FileText className="size-3.5" /> Exportar CSV
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageHeader>

      <Tabs value={activeTab} className="space-y-4">
        <TabsList className="hidden md:flex">
          <TabsTrigger value="usuarios" asChild>
            <Link from="/admin" search={{ tab: "usuarios" }} className="flex items-center gap-1.5">
              <UserCheck className="size-3.5" /> Usuários & Créditos
            </Link>
          </TabsTrigger>
          <TabsTrigger value="sistema" asChild>
            <Link from="/admin" search={{ tab: "sistema" }} className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5" /> Configuração do Sistema
            </Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="mt-0 space-y-4 focus-visible:outline-none">
          <Card className="panel user-table-card">
            <CardHeader className="border-b border-border/50 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Gestão de Base</CardTitle>
                  <CardDescription className="text-xs">Visualize e gerencie todos os perfis cadastrados na Zaply.</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-full max-w-xs">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Buscar por nome ou e-mail"
                      className="h-9 pl-9"
                    />
                  </div>
                  <Button size="sm" className="btn-new-user h-9 rounded-lg px-4 text-xs font-bold" onClick={() => toast.info("Funcionalidade em desenvolvimento.")}>
                    ADICIONAR CLIENTE
                  </Button>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {filters.map((f) => (
                  <Button
                    key={f.key}
                    size="sm"
                    variant={filter === f.key ? "default" : "outline"}
                    onClick={() => setFilter(f.key)}
                    className="h-8 text-[11px] font-semibold"
                  >
                    {f.label}
                    <span className="ml-1.5 tabular-nums opacity-60">{f.count}</span>
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
                          <CreditsDialog
                            className="btn-grant-credits"
                            userId={m.id}
                            name={displayName(m)}
                            balance={m.credits}
                            onDone={() => void load()}
                          />
                          {m.role !== "admin" && (
                            <Button
                              size="sm"
                              variant={m.approved ? "outline" : "default"}
                              disabled={m.id === user.id}
                              onClick={() => void toggleApproval(m)}
                            >
                              {m.approved ? "Bloquear" : "Liberar"}
                            </Button>
                          )}
                          {m.role === "admin" && m.id !== user.id && (
                            <Badge variant="secondary" className="h-8">Admin</Badge>
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

        <TabsContent value="sistema" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="size-4 text-primary" /> Integração de IA
                </CardTitle>
                <CardDescription>Configure os limites e modelos globais.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card/30 p-3">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Modelo Principal</p>
                    <p className="text-xs text-muted-foreground">Gemini 1.5 Flash (via Gateway)</p>
                  </div>
                  <Badge>Ativo</Badge>
                </div>
                <div className="space-y-2">
                  <Label>Limite de Créditos Iniciais</Label>
                  <Input type="number" defaultValue={10} className="bg-background/50" />
                  <p className="text-[10px] text-muted-foreground">Créditos concedidos automaticamente em novos cadastros aprovados.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="size-4 text-primary" /> Canais Sociais Ativos
                </CardTitle>
                <CardDescription>Habilite ou desabilite as redes integradas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Instagram", icon: Instagram, status: "online" },
                  { name: "Facebook", icon: Facebook, status: "online" },
                  { name: "LinkedIn", icon: Linkedin, status: "online" },
                  { name: "TikTok", icon: Music2, status: "online" },
                  { name: "YouTube", icon: Youtube, status: "online" },
                  { name: "X (Twitter)", icon: ZapIcon, status: "online" },
                ].map((social) => (
                  <div key={social.name} className="flex items-center justify-between rounded-lg border border-border/50 bg-card/30 p-2.5">
                    <div className="flex items-center gap-3">
                      <div className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                        <social.icon className="size-4" />
                      </div>
                      <span className="text-sm font-medium">{social.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full bg-success animate-pulse" />
                      <span className="text-[10px] uppercase font-bold text-success">Online</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="panel border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-4 grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
                <Workflow className="size-6" />
              </div>
              <CardTitle className="mb-2">Automação n8n</CardTitle>
              <CardDescription className="max-w-md">
                O motor de automação está rodando via cron. Os posts agendados são processados a cada 15 minutos seguindo a grade horária dos usuários.
              </CardDescription>
              <Button variant="outline" size="sm" className="mt-6" asChild>
                <Link to="/n8n">Visualizar Fluxo Técnico</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
