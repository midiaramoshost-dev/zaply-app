import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BarChart3,
  Eye,
  FileDown,
  Heart,
  MessageCircle,
  Sheet as SheetIcon,
  ThumbsDown,
  Trophy,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePosts } from "@/lib/posts-store";
import { useClients } from "@/lib/clients-store";
import {
  availableMonths,
  buildMonthlyReport,
  exportReportExcel,
  exportReportPdf,
  monthKey,
  monthLabel,
} from "@/lib/report";

export const Route = createFileRoute("/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios mensais em PDF e Excel | ContentFlow" },
      {
        name: "description",
        content:
          "Relatório mensal com alcance, seguidores, curtidas, comentários, crescimento e ranking de melhor e pior postagem. Exporte em PDF ou Excel.",
      },
      { property: "og:title", content: "Relatórios mensais em PDF e Excel" },
      {
        property: "og:description",
        content: "Alcance, seguidores, engajamento e ranking de posts em um relatório exportável.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportsPage;
});

const nf = new Intl.NumberFormat("pt-BR");

function ReportsPage() {
  const { posts, ready } = usePosts();
  const { clients } = useClients();
  const [month, setMonth] = useState(() => monthKey(new Date()));
  const [busy, setBusy] = useState<"pdf" | "xlsx" | null>(null);

  const months = useMemo(() => availableMonths(posts), [posts]);
  const report = useMemo(() => buildMonthlyReport(posts, month), [posts, month]);
  const brand = clients[0]?.name ?? "ContentFlow";

  const run = async (kind: "pdf" | "xlsx") => {
    setBusy(kind);
    try {
      if (kind === "pdf") await exportReportPdf(report, brand);
      else await exportReportExcel(report, brand);
      toast.success(kind === "pdf" ? "PDF gerado." : "Excel gerado.");
    } catch {
      toast.error("Não foi possível gerar o arquivo.");
    } finally {
      setBusy(null);
    }
  };

  const kpis = [
    { label: "Alcance", value: nf.format(report.reach), icon: Eye },
    { label: "Seguidores", value: nf.format(report.followers), icon: Users },
    { label: "Novos seguidores", value: `+${nf.format(report.followersGained)}`, icon: UserPlus },
    { label: "Comentários", value: nf.format(report.comments), icon: MessageCircle },
    { label: "Curtidas", value: nf.format(report.likes), icon: Heart },
    { label: "Crescimento", value: `${report.growth.toFixed(1)}%`, icon: TrendingUp },
    { label: "Engajamento", value: `${report.engagement.toFixed(2)}%`, icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-semibold">Relatórios</h1>
          <p className="text-muted-foreground">
            Consolidado mensal de desempenho, pronto para enviar ao cliente em PDF ou Excel.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m} value={m}>
                  {monthLabel(m)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => run("pdf")} disabled={busy !== null}>
            <FileDown className="size-4" />
            {busy === "pdf" ? "Gerando…" : "PDF mensal"}
          </Button>
          <Button variant="secondary" onClick={() => run("xlsx")} disabled={busy !== null}>
            <SheetIcon className="size-4" />
            {busy === "xlsx" ? "Gerando…" : "Excel"}
          </Button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="panel">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{k.label}</CardTitle>
              <k.icon className="size-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl font-semibold">{ready ? k.value : "—"}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="size-4 text-primary" /> Melhor postagem
            </CardTitle>
            <CardDescription>Maior taxa de engajamento no período.</CardDescription>
          </CardHeader>
          <CardContent>
            {report.best ? (
              <div className="space-y-2">
                <p className="font-medium">{report.best.title}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="secondary">{report.best.channel}</Badge>
                  <Badge variant="outline">{report.best.date}</Badge>
                  <Badge variant="outline">{report.best.engagement.toFixed(2)}% eng.</Badge>
                  <Badge variant="outline">{nf.format(report.best.reach)} alcance</Badge>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Sem posts publicados neste mês.</p>
            )}
          </CardContent>
        </Card>

        <Card className="panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ThumbsDown className="size-4 text-primary" /> Pior postagem
            </CardTitle>
            <CardDescription>Menor taxa de engajamento no período.</CardDescription>
          </CardHeader>
          <CardContent>
            {report.worst ? (
              <div className="space-y-2">
                <p className="font-medium">{report.worst.title}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="secondary">{report.worst.channel}</Badge>
                  <Badge variant="outline">{report.worst.date}</Badge>
                  <Badge variant="outline">{report.worst.engagement.toFixed(2)}% eng.</Badge>
                  <Badge variant="outline">{nf.format(report.worst.reach)} alcance</Badge>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Publique mais posts para comparar.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="panel">
        <CardHeader>
          <CardTitle className="text-base">Desempenho por publicação</CardTitle>
          <CardDescription>{report.posts.length} post(s) publicados em {report.monthLabel}.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {report.posts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum post publicado neste mês.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Data</th>
                  <th className="py-2 pr-3 font-medium">Título</th>
                  <th className="py-2 pr-3 font-medium">Canal</th>
                  <th className="py-2 pr-3 text-right font-medium">Alcance</th>
                  <th className="py-2 pr-3 text-right font-medium">Curtidas</th>
                  <th className="py-2 pr-3 text-right font-medium">Comentários</th>
                  <th className="py-2 text-right font-medium">Eng.</th>
                </tr>
              </thead>
              <tbody>
                {report.posts.map((p) => (
                  <tr key={p.id} className="border-b border-border/50 last:border-0">
                    <td className="py-2 pr-3 whitespace-nowrap text-muted-foreground">{p.date}</td>
                    <td className="py-2 pr-3">{p.title}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{p.channel}</td>
                    <td className="py-2 pr-3 text-right">{nf.format(p.reach)}</td>
                    <td className="py-2 pr-3 text-right">{nf.format(p.likes)}</td>
                    <td className="py-2 pr-3 text-right">{nf.format(p.comments)}</td>
                    <td className="py-2 text-right">{p.engagement.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
