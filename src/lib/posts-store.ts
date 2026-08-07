import { useCallback, useEffect, useState } from "react";

export type PostStatus = "rascunho" | "agendado" | "publicado" | "cancelado";

export type PostCategory =
  | "produtos"
  | "promocoes"
  | "datas"
  | "videos"
  | "logos"
  | "stories"
  | "reels";

export const POST_CATEGORIES: { id: PostCategory; label: string }[] = [
  { id: "produtos", label: "Produtos" },
  { id: "promocoes", label: "Promoções" },
  { id: "datas", label: "Datas" },
  { id: "videos", label: "Vídeos" },
  { id: "logos", label: "Logos" },
  { id: "stories", label: "Stories" },
  { id: "reels", label: "Reels" },
];

export const categoryLabel: Record<PostCategory, string> = POST_CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.id]: c.label }),
  {} as Record<PostCategory, string>,
);

const CATEGORY_KEYWORDS: Record<PostCategory, string[]> = {
  promocoes: ["promo", "desconto", "oferta", "cupom", "black friday", "liquida", "%"],
  datas: ["natal", "ano novo", "dia das", "páscoa", "pascoa", "aniversário", "aniversario", "feriado", "data comemorativa"],
  videos: ["vídeo", "video", "youtube", "tutorial em vídeo"],
  logos: ["logo", "marca", "identidade visual", "branding"],
  stories: ["story", "stories", "enquete", "caixinha"],
  reels: ["reel", "reels", "tiktok", "shorts"],
  produtos: ["produto", "lançamento", "lancamento", "catálogo", "catalogo", "serviço", "servico"],
};

/** Deduz uma categoria a partir do texto/formato quando ela ainda não foi definida. */
export function inferCategory(input: {
  title?: string;
  body?: string;
  format?: string;
  hashtags?: string[];
}): PostCategory {
  const text = [input.title, input.body, input.format, ...(input.hashtags ?? [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  for (const [category, words] of Object.entries(CATEGORY_KEYWORDS) as [PostCategory, string[]][]) {
    if (words.some((word) => text.includes(word))) return category;
  }
  return "produtos";
}

export type Post = {
  id: string;
  title: string;
  body: string;
  hashtags: string[];
  channel: string;
  tone: string;
  status: PostStatus;
  scheduledAt: string | null;
  createdAt: string;
  imageUrl?: string | null;
  approved?: boolean;
  format?: string;
  category?: PostCategory;
};


const STORAGE_KEY = "contentflow.posts.v1";

const SEED: Post[] = [
  {
    id: "seed-1",
    title: "5 sinais de que seu conteúdo precisa de automação",
    body: "Se você ainda escreve legenda em cima da hora, a sua marca está pagando caro por isso.\n\nAutomatizar não é publicar robô: é liberar tempo para estratégia.",
    hashtags: ["marketing", "automacao", "conteudo"],
    channel: "LinkedIn",
    tone: "Profissional",
    status: "agendado",
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "seed-2",
    title: "Bastidores: como criamos 30 posts em 1 hora",
    body: "Escolhemos o tema, deixamos a IA gerar variações e aprovamos o calendário inteiro numa tacada só.",
    hashtags: ["ia", "produtividade", "socialmedia"],
    channel: "Instagram",
    tone: "Descontraído",
    status: "rascunho",
    scheduledAt: null,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "seed-3",
    title: "Newsletter #12 — O calendário que se preenche sozinho",
    body: "Nesta edição: como estruturar pautas recorrentes e deixar a IA cuidar do rascunho inicial.",
    hashtags: ["newsletter", "conteudo"],
    channel: "Newsletter",
    tone: "Educativo",
    status: "publicado",
    scheduledAt: new Date(Date.now() - 172800000).toISOString(),
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

function read(): Post[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      return SEED;
    }
    const parsed = JSON.parse(raw) as Post[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(posts: Post[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  window.dispatchEvent(new Event("contentflow:posts"));
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPosts(read());
    setReady(true);
    const sync = () => setPosts(read());
    window.addEventListener("contentflow:posts", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("contentflow:posts", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const addPost = useCallback((post: Omit<Post, "id" | "createdAt">) => {
    const next: Post = {
      ...post,
      category: post.category ?? inferCategory(post),
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    write([next, ...read()]);
    return next;
  }, []);

  const updatePost = useCallback((id: string, patch: Partial<Post>) => {
    const current = read();
    const exists = current.find((p) => p.id === id);
    if (!exists) {
      console.warn("Tentativa de atualizar post inexistente:", id);
      return;
    }
    write(current.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const removePost = useCallback((id: string) => {
    const current = read();
    const next = current.filter((p) => p.id !== id);
    if (next.length === current.length) {
      console.warn("Tentativa de remover post inexistente:", id);
      return;
    }
    write(next);
  }, []);

  return { posts, ready, addPost, updatePost, removePost };
}

export const statusLabel: Record<PostStatus, string> = {
  rascunho: "Rascunho",
  agendado: "Agendado",
  publicado: "Publicado",
  cancelado: "Cancelado",

};
