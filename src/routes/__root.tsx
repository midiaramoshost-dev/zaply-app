import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Sparkles, Loader2, ShieldCheck } from "lucide-react";
import { useEffect, type ReactNode } from "react";

import { AppSidebar } from "../components/app-sidebar";
import { AccountButton } from "../components/account-button";
import { FloatingContact } from "../components/floating-contact";

import { PendingApprovalScreen } from "../components/pending-approval-screen";
import { useProfileAccess } from "../hooks/use-profile-access";
import { TrialBanner } from "../components/trial-banner";
import { Button } from "../components/ui/button";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { Toaster } from "../components/ui/sonner";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          O endereço que você tentou abrir não existe ou foi movido.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar ao painel
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Esta página não carregou
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo deu errado do nosso lado. Tente novamente ou volte ao início.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tentar de novo
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent/10"
          >
            Ir para o início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Painel — Zaply, conteúdo com IA" },
      {
        name: "description",
        content:
          "Acompanhe rascunhos, agendamentos e publicações da sua operação de conteúdo em um único painel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Painel — Zaply, conteúdo com IA" },
      { name: "twitter:title", content: "Painel — Zaply, conteúdo com IA" },
      { property: "og:description", content: "Acompanhe rascunhos, agendamentos e publicações da sua operação de conteúdo em um único painel." },
      { name: "twitter:description", content: "Acompanhe rascunhos, agendamentos e publicações da sua operação de conteúdo em um único painel." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d614c1e2-dfee-46e4-b091-42e1d55966a5/id-preview-7ab63993--2bc7c7cd-fdab-409c-a67d-231d61a13c6f.lovable.app-1785109986344.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d614c1e2-dfee-46e4-b091-42e1d55966a5/id-preview-7ab63993--2bc7c7cd-fdab-409c-a67d-231d61a13c6f.lovable.app-1785109986344.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        
        <Scripts />
      </body>
    </html>
  );
}

const PAGE_TITLES: Record<string, string> = {
  "/painel": "Visão geral",
  "/tutorial": "Como usar",

  "/criar": "Criar com IA",
  "/automatico": "Calendário automático",
  "/imagens": "Imagens",
  "/biblioteca": "Biblioteca",
  "/aprovacao": "Aprovação",
  "/calendario": "Calendário",
  "/agendamento": "Agendamento",
  "/publicacao": "Publicação",
  "/comentarios": "Comentários",
  "/relatorios": "Relatórios",
  "/n8n": "Fluxo n8n",
  "/clientes": "Clientes",
  "/planos": "Planos",
  "/auth": "Entrar",
  "/onboarding": "Configuração inicial",
};

function AppHeader({ isAdmin }: { isAdmin: boolean }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const title = PAGE_TITLES[pathname] ?? (isAdmin ? "Painel master" : "Zaply");

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/70 bg-background/70 px-4 backdrop-blur-xl">
      <SidebarTrigger />
      <div className="flex min-w-0 items-center gap-2 text-sm">
        <span className="hidden text-muted-foreground sm:inline">Zaply</span>
        <span className="hidden text-muted-foreground/50 sm:inline">/</span>
        <span className="truncate font-display font-semibold tracking-tight">{title}</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        {!isAdmin && (
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/criar">
              <Sparkles className="size-4" />
              Criar com IA
            </Link>
          </Button>
        )}
        <AccountButton />
      </div>
    </header>
  );
}


const ADMIN_ALLOWED = ["/admin", "/conta", "/painel", "/tutorial", "/criar", "/automatico", "/imagens", "/biblioteca", "/aprovacao", "/calendario", "/agendamento", "/publicacao", "/comentarios", "/relatorios", "/n8n", "/clientes", "/planos"];

function AppShell() {
  const { loading: accessLoading, blocked, profile, reload, isAdmin, trialActive, trialExpired, trialMsLeft, user, approved } =
    useProfileAccess();

  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const router = useRouter();

  // Admin master usa um painel próprio, separado dos módulos de usuário.
  const adminOutOfScope =
    !accessLoading && isAdmin && !ADMIN_ALLOWED.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  useEffect(() => {
    if (!accessLoading && user && !profile?.tenant_id && pathname !== "/onboarding" && !pathname.startsWith("/admin")) {
      void router.navigate({ to: "/onboarding", replace: true });
      return;
    }
    if (adminOutOfScope && !pathname.startsWith("/admin")) {
      void router.navigate({ to: "/admin", search: { tab: "usuarios" }, replace: true });
    }
  }, [adminOutOfScope, router, accessLoading, user, profile?.tenant_id, pathname]);


  if (accessLoading && user) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-6 animate-spin text-primary/50" />
          <span className="animate-pulse">Sincronizando sua conta…</span>
        </div>
      </div>
    );
  }

  // Se for admin, ignora qualquer bloqueio de aprovação/teste.
  if (isAdmin) {
    // Redireciona para /admin se estiver em uma rota de usuário (e não for /conta ou /admin).
    if (adminOutOfScope) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-[#02040a]">
          <div className="flex flex-col items-center gap-4">
            <div className="relative size-12">
              <Loader2 className="absolute inset-0 size-12 animate-spin text-primary opacity-20" />
              <ShieldCheck className="absolute inset-0 m-auto size-6 text-primary animate-pulse" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-semibold tracking-wide uppercase text-primary/80">Administrador Master</span>
              <span className="text-xs text-muted-foreground italic">Acessando central de controle Zaply...</span>
            </div>
          </div>
        </div>
      );
    }
  } else if (!isAdmin && (!approved || blocked) && user) {
    const isInactiveSubscription = (profile as any)?.tenants?.subscription_status && !['active', 'trialing'].includes((profile as any).tenants.subscription_status);
    return (
      <div className="min-h-screen bg-background grid-backdrop">
        <PendingApprovalScreen
          requestedPlan={profile?.requested_plan ?? null}

          trialExpired={!!(trialExpired || isInactiveSubscription)}
          onRequested={() => void reload()}
        />
        <FloatingContact />
      </div>
    );
  }


  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          {/* {trialActive && <TrialBanner msLeft={trialMsLeft} />} */}
          <AppHeader isAdmin={isAdmin} />
          <main className="flex-1 grid-backdrop">
            {/* Required: nested routes render here. */}
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}


function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isPublic = pathname === "/" || pathname.startsWith("/auth");

  // Removendo obrigatoriedade de login para acesso direto ao painel.
  // No entanto, para persistência no Supabase, o usuário ainda precisa estar logado para salvar dados.
  // Se o objetivo é "acesso livre" total (sem login), o useProfileAccess precisaria ser ignorado.

  if (isPublic) {
    return (
      <QueryClientProvider client={queryClient}>
        <Outlet />
        <Toaster position="top-center" />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}

