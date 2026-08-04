import { Link, useRouterState } from "@tanstack/react-router";
import {
  BadgeCheck,
  CreditCard,
  CalendarClock,
  FileBarChart,
  Workflow,
  CalendarDays,
  GraduationCap,
  ImageIcon,
  LayoutDashboard,
  Library,
  MessageCircle,
  Send,
  Sparkles,
  Wand2,
  Users,
  ShieldCheck,
  UserRound,
  Zap,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRole } from "@/hooks/use-role";
import { BrandMark } from "@/components/brand-mark";


const groups = [
  {
    label: "Início",
    items: [
      { title: "Visão geral", url: "/painel", icon: LayoutDashboard },
      { title: "Como usar", url: "/tutorial", icon: GraduationCap },
    ],
  },
  {
    label: "Criar",
    items: [
      { title: "Criar com IA", url: "/criar", icon: Sparkles },
      { title: "Calendário automático", url: "/automatico", icon: Wand2 },
      { title: "Imagens", url: "/imagens", icon: ImageIcon },
      { title: "Biblioteca", url: "/biblioteca", icon: Library },
    ],
  },
  {
    label: "Publicar",
    items: [
      { title: "Aprovação", url: "/aprovacao", icon: BadgeCheck },
      { title: "Calendário", url: "/calendario", icon: CalendarDays },
      { title: "Agendamento", url: "/agendamento", icon: CalendarClock },
      { title: "Publicação", url: "/publicacao", icon: Send },
    ],
  },
  {
    label: "Acompanhar",
    items: [
      { title: "Comentários", url: "/comentarios", icon: MessageCircle },
      { title: "Relatórios", url: "/relatorios", icon: FileBarChart },
      { title: "Fluxo n8n", url: "/n8n", icon: Workflow },
    ],
  },
  {
    label: "Conta",
    items: [
      { title: "Meu painel", url: "/conta", icon: UserRound },
      { title: "Clientes", url: "/clientes", icon: Users },
      { title: "Planos", url: "/planos", icon: CreditCard },
    ],
  },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  const { isAdmin } = useRole();

  // O admin master tem um painel separado e focado em gestão.
  const visibleGroups = isAdmin
    ? [
        {
          label: "Gestão Master",
          items: [
            { title: "Painel de Controle", url: "/admin" as const, icon: ShieldCheck },
            { title: "Usuários & Créditos", url: "/admin?tab=usuarios" as const, icon: Users },
            { title: "Configurações", url: "/admin?tab=sistema" as const, icon: Zap },
            { title: "Minha Conta", url: "/conta" as const, icon: UserRound },
          ],
        },
      ]
    : groups;


  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border/70">
        <div className="flex items-center gap-2.5 px-2 py-3">
          <BrandMark className="size-9" />
          {!collapsed && (
            <div className="leading-tight">
              <p className="font-display text-sm font-semibold tracking-tight">Zaply</p>
              <p className="text-[11px] text-muted-foreground">Conteúdo com IA</p>
            </div>
          )}
        </div>
      </SidebarHeader>


      <SidebarContent className="gap-0">
        {visibleGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={currentPath === item.url}
                      className="data-[active=true]:bg-primary/12 data-[active=true]:text-primary data-[active=true]:font-medium"
                    >
                      <Link to={item.url} className="flex items-center gap-2.5">
                        <item.icon className="size-4" />
                        {!collapsed && <span className="truncate">{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        {!collapsed && (
          <p className="rounded-lg border border-sidebar-border/70 bg-sidebar-accent/40 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
            Publicação em modo simulado. Conecte suas redes para publicar de verdade.
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
