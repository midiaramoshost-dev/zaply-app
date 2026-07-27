import { useCallback, useEffect, useState } from "react";

export type Client = {
  id: string;
  name: string;
  logoUrl: string;
  niche: string;
  goals: string;
  audience: string;
  address: string;
  contact: string;
  tone: string;
  bannedWords: string[];
  colors: string[];
  fonts: string[];
  createdAt: string;
};

const STORAGE_KEY = "contentflow.clients.v1";

const SEED: Client[] = [
  {
    id: "client-1",
    name: "Aurora Studio",
    logoUrl: "",
    niche: "Design e branding",
    goals: "Gerar autoridade no LinkedIn e captar 10 leads qualificados por mês.",
    audience: "Fundadores de startups B2B entre 28 e 45 anos.",
    address: "Rua das Laranjeiras, 220 — Pinheiros, São Paulo/SP",
    contact: "contato@aurorastudio.com · (11) 99999-0001",
    tone: "Profissional",
    bannedWords: ["barato", "milagroso"],
    colors: ["#7C5CFF", "#22D3EE", "#0F172A"],
    fonts: ["Space Grotesk", "DM Sans"],
    createdAt: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    id: "client-2",
    name: "Verde Vida",
    logoUrl: "",
    niche: "Alimentação saudável",
    goals: "Aumentar o engajamento no Instagram e divulgar o clube de assinatura.",
    audience: "Mulheres de 25 a 40 anos interessadas em bem-estar.",
    address: "Av. Beira Mar, 1500 — Loja 12, Florianópolis/SC",
    contact: "oi@verdevida.com.br · (48) 98888-0002",
    tone: "Descontraído",
    bannedWords: ["dieta restritiva", "detox"],
    colors: ["#34D399", "#166534", "#F8FAFC"],
    fonts: ["Poppins", "Inter"],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

function read(): Client[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      return SEED;
    }
    const parsed = JSON.parse(raw) as Client[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(clients: Client[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  window.dispatchEvent(new Event("contentflow:clients"));
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setClients(read());
    setReady(true);
    const sync = () => setClients(read());
    window.addEventListener("contentflow:clients", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("contentflow:clients", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const addClient = useCallback((client: Omit<Client, "id" | "createdAt">) => {
    const next: Client = {
      ...client,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    write([next, ...read()]);
    return next;
  }, []);

  const updateClient = useCallback((id: string, patch: Partial<Client>) => {
    write(read().map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const removeClient = useCallback((id: string) => {
    write(read().filter((c) => c.id !== id));
  }, []);

  return { clients, ready, addClient, updateClient, removeClient };
}

export const emptyClient: Omit<Client, "id" | "createdAt"> = {
  name: "",
  logoUrl: "",
  niche: "",
  goals: "",
  audience: "",
  address: "",
  contact: "",
  tone: "Profissional",
  bannedWords: [],
  colors: ["#7C5CFF"],
  fonts: [],
};

export function splitList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
