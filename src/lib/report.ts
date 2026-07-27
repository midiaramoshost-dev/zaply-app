import type { Post } from "@/lib/posts-store";

/** Métricas simuladas determinísticas por post (mesma base do dashboard). */
function hash(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) % 100000;
  return h;
}

export type PostReport = {
  id: string;
  title: string;
  channel: string;
  date: string;
  likes: number;
  comments: number;
  reach: number;
  engagement: number;
};

export type MonthlyReport = {
  monthKey: string;
  monthLabel: string;
  posts: PostReport[];
  reach: number;
  followers: number;
  followersGained: number;
  comments: number;
  likes: number;
  growth: number;
  engagement: number;
  best: PostReport | null;
  worst: PostReport | null;
};

export function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

function postDate(post: Post) {
  return new Date(post.scheduledAt ?? post.createdAt);
}

export function availableMonths(posts: Post[]): string[] {
  const keys = new Set<string>([monthKey(new Date())]);
  for (const post of posts) keys.add(monthKey(postDate(post)));
  return [...keys].sort().reverse();
}

export function buildMonthlyReport(posts: Post[], key: string): MonthlyReport {
  const published = posts.filter(
    (p) => p.status === "publicado" && monthKey(postDate(p)) === key,
  );

  const rows: PostReport[] = published.map((p) => {
    const likes = 120 + (hash(p.id) % 880);
    const comments = 8 + (hash(p.title) % 92);
    const reach = 1500 + (hash(p.channel + p.id) % 12000);
    return {
      id: p.id,
      title: p.title,
      channel: p.channel,
      date: postDate(p).toLocaleDateString("pt-BR"),
      likes,
      comments,
      reach,
      engagement: reach > 0 ? ((likes + comments) / reach) * 100 : 0,
    };
  });

  const likes = rows.reduce((s, r) => s + r.likes, 0);
  const comments = rows.reduce((s, r) => s + r.comments, 0);
  const reach = rows.reduce((s, r) => s + r.reach, 0);
  const engagement = reach > 0 ? ((likes + comments) / reach) * 100 : 0;
  const followersGained = Math.round(reach * 0.012 + likes * 0.08);
  const followers = 1200 + followersGained * 3;
  const growth = followers > 0 ? (followersGained / followers) * 100 : 0;

  const sorted = [...rows].sort((a, b) => b.engagement - a.engagement);

  return {
    monthKey: key,
    monthLabel: monthLabel(key),
    posts: rows,
    reach,
    followers,
    followersGained,
    comments,
    likes,
    growth,
    engagement,
    best: sorted[0] ?? null,
    worst: sorted.length > 1 ? sorted[sorted.length - 1] : null,
  };
}

const nf = new Intl.NumberFormat("pt-BR");

export function summaryRows(report: MonthlyReport): [string, string][] {
  return [
    ["Alcance", nf.format(report.reach)],
    ["Seguidores", nf.format(report.followers)],
    ["Novos seguidores", `+${nf.format(report.followersGained)}`],
    ["Comentários", nf.format(report.comments)],
    ["Curtidas", nf.format(report.likes)],
    ["Crescimento", `${report.growth.toFixed(1)}%`],
    ["Engajamento", `${report.engagement.toFixed(2)}%`],
    ["Posts publicados", nf.format(report.posts.length)],
    ["Melhor postagem", report.best ? `${report.best.title} (${report.best.engagement.toFixed(2)}%)` : "—"],
    ["Pior postagem", report.worst ? `${report.worst.title} (${report.worst.engagement.toFixed(2)}%)` : "—"],
  ];
}

export async function exportReportPdf(report: MonthlyReport, brand: string) {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Relatório mensal de conteúdo", 14, 20);
  doc.setFontSize(11);
  doc.setTextColor(110);
  doc.text(`${brand} • ${report.monthLabel}`, 14, 27);

  autoTable(doc, {
    startY: 36,
    head: [["Indicador", "Resultado"]],
    body: summaryRows(report),
    theme: "grid",
    headStyles: { fillColor: [24, 24, 32] },
    styles: { fontSize: 10, cellPadding: 3 },
  });

  const afterSummary = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
  doc.setFontSize(13);
  doc.setTextColor(0);
  doc.text("Desempenho por publicação", 14, afterSummary + 12);

  autoTable(doc, {
    startY: afterSummary + 16,
    head: [["Data", "Título", "Canal", "Alcance", "Curtidas", "Comentários", "Eng. %"]],
    body: report.posts.map((p) => [
      p.date,
      p.title.length > 46 ? `${p.title.slice(0, 46)}…` : p.title,
      p.channel,
      nf.format(p.reach),
      nf.format(p.likes),
      nf.format(p.comments),
      p.engagement.toFixed(2),
    ]),
    theme: "striped",
    headStyles: { fillColor: [24, 24, 32] },
    styles: { fontSize: 9, cellPadding: 2.5 },
    columnStyles: { 1: { cellWidth: 58 } },
  });

  doc.save(`relatorio-${report.monthKey}.pdf`);
}

export async function exportReportExcel(report: MonthlyReport, brand: string) {
  const XLSX = await import("xlsx");

  const resume = XLSX.utils.aoa_to_sheet([
    ["Relatório mensal de conteúdo"],
    [brand, report.monthLabel],
    [],
    ["Indicador", "Resultado"],
    ...summaryRows(report),
  ]);
  resume["!cols"] = [{ wch: 24 }, { wch: 52 }];

  const detail = XLSX.utils.json_to_sheet(
    report.posts.map((p) => ({
      Data: p.date,
      Título: p.title,
      Canal: p.channel,
      Alcance: p.reach,
      Curtidas: p.likes,
      Comentários: p.comments,
      "Engajamento (%)": Number(p.engagement.toFixed(2)),
    })),
  );
  detail["!cols"] = [{ wch: 12 }, { wch: 48 }, { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 16 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, resume, "Resumo");
  XLSX.utils.book_append_sheet(wb, detail, "Publicações");
  XLSX.writeFile(wb, `relatorio-${report.monthKey}.xlsx`);
}
