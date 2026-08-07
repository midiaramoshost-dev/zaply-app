import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, DollarSign, Zap, BarChart3 } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
}

function KPICard({ title, value, change, trend, icon: Icon }: KPICardProps) {
  return (
    <Card className="kpi-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="eyebrow text-muted-foreground">{title}</CardTitle>
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="mt-1 flex items-center gap-1.5">
          <span className={`flex items-center gap-0.5 text-[10px] font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trend === 'up' ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {change}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground/60">vs mês passado</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function KPIGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KPICard 
        title="Receita Estimada" 
        value="R$ 12.450" 
        change="+12.5%" 
        trend="up" 
        icon={DollarSign} 
      />
      <KPICard 
        title="Novos Leads" 
        value="148" 
        change="+8.2%" 
        trend="up" 
        icon={Users} 
      />
      <KPICard 
        title="Posts Agendados" 
        value="42" 
        change="-2.4%" 
        trend="down" 
        icon={Zap} 
      />
      <KPICard 
        title="ROI Médio" 
        value="4.2x" 
        change="+5.1%" 
        trend="up" 
        icon={BarChart3} 
      />
    </div>
  );
}
