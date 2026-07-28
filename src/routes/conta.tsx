import { createFileRoute, Link } from "@tanstack/react-router";
import { CreditCard, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";

import { DashboardMetricsGrid } from "@/components/dashboard-metrics";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useRole } from "@/hooks/use-role";
import { useClients } from "@/lib/clients-store";
import { usePosts } from "@/lib/posts-store";

export const Route = createFileRoute("/conta")({
  head: () => ({
    meta: [
      { title: "Meu painel — ContentFlow" },
      {
        name: "description",
        content: "Seu painel pessoal no ContentFlow: dados da conta, plano, clientes e desempenho do seu conteúdo.",
      },
      { property: "og:title", content: "Meu painel — ContentFlow" },
      {
        property: "og:description",
        content: "Seu painel pessoal no ContentFlow: dados da conta, plano, clientes e desempenho do seu conteúdo.",
      },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, signOut } = useAuth();
  const { isAdmin } = useRole();
  const { posts, ready } = usePosts();
  const { clients } = useClients();

  if (!user) {
    return (
      <Card className="panel mx-auto mt-10 max-w-md">
        <CardHeader>
          <CardTitle>Entre na sua conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>Faça login para ver o seu painel pessoal.</p>
          <Button asChild size="sm">
            <Link to="/auth">Entrar</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const name = (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "Usuário";

  return (
    <div className="space-y-6">
      <header className="panel flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <span className="grid size-12 place-items-center rounded-2xl bg-primary/12 text-primary">
            <UserRound className="size-5" />
          </span>
          <div className="space-y-1">
            <h1 className="font-display text-2xl font-semibold">{name}</h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>{user.email}</span>
              <Badge variant={isAdmin ? "default" : "secondary"} className="gap-1">
                {isAdmin ? <ShieldCheck className="size-3" /> : null}
                {isAdmin ? "Admin master" : "Usuário"}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Button asChild size="sm" variant="outline">
              <Link to="/admin">Painel do administrador</Link>
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={async () => {
              await signOut();
              toast.success("Você saiu da conta.");
            }}
          >
            <LogOut className="size-3.5" /> Sair
          </Button>
        </div>
      </header>

      <DashboardMetricsGrid posts={posts} ready={ready} clientsCount={clients.length} />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="panel">
          <CardHeader>
            <CardTitle className="text-base">Seu conteúdo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>{posts.length} posts na sua biblioteca.</p>
            <p>{clients.length} clientes cadastrados no seu perfil.</p>
            <Button asChild size="sm" variant="outline" className="mt-2">
              <Link to="/biblioteca">Abrir biblioteca</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="size-4 text-primary" /> Plano
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Compare os planos Starter, Pro e Agency e faça upgrade quando precisar.</p>
            <Button asChild size="sm" variant="outline" className="mt-2">
              <Link to="/planos">Ver planos</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
