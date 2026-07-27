import { useCallback, useEffect, useState } from "react";

export type Comment = {
  id: string;
  author: string;
  text: string;
  channel: string;
  postTitle: string;
  createdAt: string;
  reply?: string;
  replied?: boolean;
  intent?: string;
  needsHuman?: boolean;
  sentiment?: Sentiment;
};

export type Sentiment = "positivo" | "negativo" | "spam" | "neutro";

const POSITIVE = ["amei", "amo", "adorei", "top", "excelente", "otimo", "ótimo", "maravilh", "parabens", "parabéns", "show", "incrivel", "incrível", "perfeito", "obrigad", "sucesso", "melhor", "gostei", "lindo"];
const NEGATIVE = ["pessimo", "péssimo", "horrivel", "horrível", "ruim", "odiei", "decepcion", "demora", "caro demais", "nao gostei", "não gostei", "golpe", "reclama", "problema", "atraso", "cancelar"];
const SPAM = ["ganhe dinheiro", "clique aqui", "http://", "https://", "promo\u00e7\u00e3o imperd", "whatsapp.com", "bit.ly", "siga de volta", "segue de volta", "curso gratis", "curso grátis", "🔞", "investimento garantido"];

export function classifySentiment(text: string): Sentiment {
  const t = text.toLowerCase();
  if (SPAM.some((w) => t.includes(w))) return "spam";
  if (NEGATIVE.some((w) => t.includes(w))) return "negativo";
  if (POSITIVE.some((w) => t.includes(w))) return "positivo";
  return "neutro";
}

const STORAGE_KEY = "contentflow.comments.v1";
const EVENT = "contentflow:comments";

const SEED: Comment[] = [
  {
    id: "cmt-1",
    author: "Marina Alves",
    text: "Quanto custa?",
    channel: "Instagram",
    postTitle: "Bastidores: como criamos 30 posts em 1 hora",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    sentiment: "neutro",
  },
  {
    id: "cmt-2",
    author: "Rafael Lima",
    text: "Onde fica?",
    channel: "Facebook",
    postTitle: "Novidades da semana",
    createdAt: new Date(Date.now() - 5400000).toISOString(),
    sentiment: "neutro",
  },
  {
    id: "cmt-3",
    author: "Juliana Prado",
    text: "Vocês atendem empresas pequenas também?",
    channel: "LinkedIn",
    postTitle: "5 sinais de que seu conteúdo precisa de automação",
    createdAt: new Date(Date.now() - 9000000).toISOString(),
    sentiment: "neutro",
  },
  {
    id: "cmt-4",
    author: "Bruno Tavares",
    text: "Amei o conteúdo, parabéns pelo trabalho!",
    channel: "Instagram",
    postTitle: "Bastidores: como criamos 30 posts em 1 hora",
    createdAt: new Date(Date.now() - 12600000).toISOString(),
    sentiment: "positivo",
  },
  {
    id: "cmt-5",
    author: "Carla Souza",
    text: "Péssimo atendimento, esperei dias e ninguém respondeu.",
    channel: "Facebook",
    postTitle: "Novidades da semana",
    createdAt: new Date(Date.now() - 16200000).toISOString(),
    sentiment: "negativo",
  },
  {
    id: "cmt-6",
    author: "promo_ofertas",
    text: "Ganhe dinheiro rápido, clique aqui: bit.ly/oferta",
    channel: "X",
    postTitle: "5 sinais de que seu conteúdo precisa de automação",
    createdAt: new Date(Date.now() - 19800000).toISOString(),
    sentiment: "spam",
  },
];

function read(): Comment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      return SEED;
    }
    const parsed = JSON.parse(raw) as Comment[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(comments: Comment[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
  window.dispatchEvent(new Event(EVENT));
}

export function useComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setComments(read());
    setReady(true);
    const sync = () => setComments(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const addComment = useCallback((comment: Omit<Comment, "id" | "createdAt">) => {
    const next: Comment = {
      ...comment,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      sentiment: comment.sentiment ?? classifySentiment(comment.text),
    };
    write([next, ...read()]);
    return next;
  }, []);

  const updateComment = useCallback((id: string, patch: Partial<Comment>) => {
    write(read().map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const removeComment = useCallback((id: string) => {
    write(read().filter((c) => c.id !== id));
  }, []);

  return { comments, ready, addComment, updateComment, removeComment };
}
