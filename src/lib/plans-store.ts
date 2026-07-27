import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

export type PlanCode = "starter" | "pro" | "agency";

export type Plan = {
  id: string;
  code: PlanCode;
  name: string;
  description: string | null;
  price_cents: number;
  currency: string;
  interval: string;
  /** null = ilimitado */
  max_posts: number | null;
  /** null = ilimitado */
  max_clients: number | null;
  features: string[];
  is_featured: boolean;
  sort_order: number;
};

/** Fallback usado enquanto o banco responde (mantém a página utilizável offline). */
export const FALLBACK_PLANS: Plan[] = [
  {
    id: "starter",
    code: "starter",
    name: "Starter",
    description: "Para quem está começando a produzir conteúdo com IA.",
    price_cents: 4700,
    currency: "BRL",
    interval: "month",
    max_posts: 100,
    max_clients: 1,
    features: ["1 cliente", "100 posts por mês", "Gerador de conteúdo por IA", "Biblioteca e calendário"],
    is_featured: false,
    sort_order: 1,
  },
  {
    id: "pro",
    code: "pro",
    name: "Pro",
    description: "Para social medias e pequenas agências em ritmo constante.",
    price_cents: 9700,
    currency: "BRL",
    interval: "month",
    max_posts: null,
    max_clients: 5,
    features: [
      "5 clientes",
      "IA ilimitada",
      "Agendamento automático",
      "Geração de imagens por IA",
      "Calendário automático de 30 dias",
    ],
    is_featured: true,
    sort_order: 2,
  },
  {
    id: "agency",
    code: "agency",
    name: "Agency",
    description: "Para agências com equipe, clientes e relatórios sob a sua marca.",
    price_cents: 29700,
    currency: "BRL",
    interval: "month",
    max_posts: null,
    max_clients: null,
    features: [
      "Clientes ilimitados",
      "Múltiplos utilizadores",
      "Fluxo de aprovação do cliente",
      "Relatórios PDF e Excel",
      "Marca branca",
      "Automação n8n",
      "Suporte prioritário",
    ],
    is_featured: false,
    sort_order: 3,
  },
];

export function formatPrice(cents: number, currency = "BRL") {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export function formatLimit(value: number | null, singular: string, plural = `${singular}s`) {
  if (value === null) return `${plural} ilimitados`;
  return `${value} ${value === 1 ? singular : plural}`;
}

async function fetchPlans(): Promise<Plan[]> {
  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return FALLBACK_PLANS;

  return data.map((row) => ({
    id: row.id,
    code: row.code as PlanCode,
    name: row.name,
    description: row.description,
    price_cents: row.price_cents ?? 0,
    currency: row.currency ?? "BRL",
    interval: row.interval ?? "month",
    max_posts: row.max_posts,
    max_clients: row.max_clients,
    features: Array.isArray(row.features) ? (row.features as string[]) : [],
    is_featured: Boolean(row.is_featured),
    sort_order: row.sort_order ?? 0,
  }));
}

export function usePlans() {
  const query = useQuery({ queryKey: ["plans"], queryFn: fetchPlans });
  return { plans: query.data ?? FALLBACK_PLANS, loading: query.isLoading };
}
