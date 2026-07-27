import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarDays, ImageIcon, LayoutDashboard, Library, Sparkles, Users, Zap } from "lucide-react";

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

const items = [
  { title: "Visão geral", url: "/", icon: LayoutDashboard },
  { title: "Criar com IA", url: "/criar", icon: Sparkles },
  { title: "Imagens", url: "/imagens", icon: ImageIcon },
  { title: "Biblioteca", url: "/biblioteca", icon: Library },
  { title: "Calendário", url: "/calendario", icon: CalendarDays },
  { title: "Clientes", url: "/clientes", icon: Users },
] as const;


export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary glow">
            <Zap className="size-4" />
          </span>
          {!collapsed && (
            <div className="leading-tight">
              <p className="font-display text-sm font-semibold">ContentFlow</p>
              <p className="text-[11px] text-muted-foreground">Conteúdo com IA</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={currentPath === item.url}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="size-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {!collapsed && (
          <p className="px-2 pb-2 text-[11px] leading-relaxed text-muted-foreground">
            Publicação automática em modo simulado. Conecte suas redes para publicar de verdade.
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
