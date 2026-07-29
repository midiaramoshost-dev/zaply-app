import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Zap } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Search = { next?: string; mode?: "entrar" | "criar" };

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    next: typeof search.next === "string" ? search.next : undefined,
    mode: search.mode === "criar" ? "criar" : search.mode === "entrar" ? "entrar" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Entrar — ContentFlow" },
      {
        name: "description",
        content:
          "Acesse sua conta ContentFlow para criar, aprovar e publicar conteúdo com inteligência artificial.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Entrar — ContentFlow" },
      {
        property: "og:description",
        content: "Acesse sua conta ContentFlow para criar, aprovar e publicar conteúdo com IA.",
      },
      { name: "twitter:title", content: "Entrar — ContentFlow" },
      {
        name: "twitter:description",
        content: "Acesse sua conta ContentFlow para criar, aprovar e publicar conteúdo com IA.",
      },
    ],
  }),
  component: AuthPage,
  errorComponent: () => (
    <div className="grid min-h-[60vh] place-items-center px-4 text-center text-sm text-muted-foreground">
      Não foi possível carregar a tela de acesso. Recarregue a página.
    </div>
  ),
});

function safeNext(next?: string) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

function AuthPage() {
  const { next, mode } = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: safeNext(next), replace: true });
  }, [loading, user, next, navigate]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Bem-vindo de volta!");
    navigate({ to: safeNext(next), replace: true });
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}${safeNext(next)}`,
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Conta criada! Confirme o e-mail para entrar.");
  }

  async function google() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      return toast.error("Não foi possível entrar com o Google.");
    }
    if (result.redirected) return;
    navigate({ to: safeNext(next), replace: true });
  }

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center px-4 py-10">
      <Card className="w-full max-w-md border-border/70 bg-surface/70 backdrop-blur">
        <CardHeader className="items-center text-center">
          <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary glow">
            <Zap className="size-5" />
          </span>
          <CardTitle className="font-display">Acessar o ContentFlow</CardTitle>
          <CardDescription>
            Entre para salvar seus clientes, posts e agendamentos na nuvem.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full" onClick={google} disabled={busy}>
            Continuar com Google
          </Button>

          <div className="flex items-center gap-3 text-[11px] uppercase tracking-wide text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" />
          </div>

          <Tabs defaultValue="entrar">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="entrar">Entrar</TabsTrigger>
              <TabsTrigger value="criar">Criar conta</TabsTrigger>
            </TabsList>

            <TabsContent value="entrar">
              <form className="space-y-3 pt-3" onSubmit={signIn}>
                <div className="space-y-1.5">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@empresa.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Entrar
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="criar">
              <form className="space-y-3 pt-3" onSubmit={signUp}>
                <div className="space-y-1.5">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email-novo">E-mail</Label>
                  <Input
                    id="email-novo"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@empresa.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="senha-nova">Senha</Label>
                  <Input
                    id="senha-nova"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="mínimo 6 caracteres"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Criar conta
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
