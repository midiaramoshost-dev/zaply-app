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
};

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
  },
  {
    id: "cmt-2",
    author: "Rafael Lima",
    text: "Onde fica?",
    channel: "Facebook",
    postTitle: "Novidades da semana",
    createdAt: new Date(Date.now() - 5400000).toISOString(),
  },
  {
    id: "cmt-3",
    author: "Juliana Prado",
    text: "Vocês atendem empresas pequenas também?",
    channel: "LinkedIn",
    postTitle: "5 sinais de que seu conteúdo precisa de automação",
    createdAt: new Date(Date.now() - 9000000).toISOString(),
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
