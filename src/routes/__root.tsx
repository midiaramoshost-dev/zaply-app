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
import { Sparkles } from "lucide-react";
import { useEffect, type ReactNode } from "react";

import { AppSidebar } from "../components/app-sidebar";
import { AccountButton } from "../components/account-button";
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
      { title: "Painel — ContentFlow, conteúdo com IA" },
      {
        name: "description",
        content:
          "Acompanhe rascunhos, agendamentos e publicações da sua operação de conteúdo em um único painel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Painel — ContentFlow, conteúdo com IA" },
      { name: "twitter:title", content: "Painel — ContentFlow, conteúdo com IA" },
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
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
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
  "/": "Visão geral",
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
};

function AppHeader() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const title = PAGE_TITLES[pathname] ?? "ContentFlow";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/70 bg-background/70 px-4 backdrop-blur-xl">
      <SidebarTrigger />
      <div className="flex min-w-0 items-center gap-2 text-sm">
        <span className="hidden text-muted-foreground sm:inline">ContentFlow</span>
        <span className="hidden text-muted-foreground/50 sm:inline">/</span>
        <span className="truncate font-display font-semibold tracking-tight">{title}</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button asChild size="sm" className="hidden sm:inline-flex">
          <Link to="/criar">
            <Sparkles className="size-4" />
            Criar com IA
          </Link>
        </Button>
        <AccountButton />
      </div>
    </header>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <AppHeader />
            <main className="flex-1 grid-backdrop">
              {/* Required: nested routes render here. */}
              <Outlet />
            </main>
          </div>
        </div>
        <Toaster position="top-center" />
      </SidebarProvider>
    </QueryClientProvider>
  );
}
