import { useCallback, useEffect, useState } from "react";

import type { Post } from "@/lib/posts-store";

const KEY = "contentflow.n8n.v1";
const EVENT = "contentflow:n8n";

export type N8nStepId =
  | "cron"
  | "buscar"
  | "openai"
  | "imagem"
  | "salvar"
  | "instagram"
  | "facebook"
  | "linkedin"
  | "x"
  | "links"
  | "relatorio";

export const N8N_STEPS: { id: N8nStepId; label: string; hint: string }[] = [
  { id: "cron", label: "Cron", hint: "Dispara conforme a grade de agendamento" },
  { id: "buscar", label: "Buscar post agendado", hint: "Lê o próximo post da fila" },
  { id: "openai", label: "OpenAI", hint: "Revisa/gera legenda, CTA e hashtags" },
  { id: "imagem", label: "Gerar imagem", hint: "Cria a arte do post" },
  { id: "salvar", label: "Salvar", hint: "Grava o conteúdo final e a imagem" },
  { id: "instagram", label: "Publicar Instagram", hint: "Feed, carrossel ou reels" },
  { id: "facebook", label: "Publicar Facebook", hint: "Página" },
  { id: "linkedin", label: "Publicar LinkedIn", hint: "Perfil ou empresa" },
  { id: "x", label: "Publicar X", hint: "Tweet até 280 caracteres" },
  { id: "links", label: "Salvar links", hint: "Guarda as URLs de cada publicação" },
  { id: "relatorio", label: "Enviar relatório", hint: "Consolidado do período por e-mail" },
];

export type N8nConfig = {
  webhookUrl: string;
  baseUrl: string;
  cron: string;
  steps: Record<N8nStepId, boolean>;
};

const DEFAULT: N8nConfig = {
  webhookUrl: "",
  baseUrl: "",
  cron: "0 9,14,18 * * 1,3,5",
  steps: N8N_STEPS.reduce(
    (acc, s) => ({ ...acc, [s.id]: true }),
    {} as Record<N8nStepId, boolean>,
  ),
};

function read(): N8nConfig {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as Partial<N8nConfig>;
    return { ...DEFAULT, ...parsed, steps: { ...DEFAULT.steps, ...(parsed.steps ?? {}) } };
  } catch {
    return DEFAULT;
  }
}

function write(config: N8nConfig) {
  window.localStorage.setItem(KEY, JSON.stringify(config));
  window.dispatchEvent(new Event(EVENT));
}

export function useN8n() {
  const [config, setConfig] = useState<N8nConfig>(DEFAULT);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConfig(read());
    setReady(true);
    const sync = () => setConfig(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = useCallback((patch: Partial<N8nConfig>) => {
    write({ ...read(), ...patch });
  }, []);

  const toggleStep = useCallback((id: N8nStepId, value: boolean) => {
    const current = read();
    write({ ...current, steps: { ...current.steps, [id]: value } });
  }, []);

  return { config, ready, update, toggleStep };
}

/** Payload enviado ao webhook do n8n para cada post. */
export function buildN8nPayload(post: Post, steps: Record<N8nStepId, boolean>) {
  return {
    source: "contentflow",
    triggeredAt: new Date().toISOString(),
    steps: Object.entries(steps)
      .filter(([, enabled]) => enabled)
      .map(([id]) => id),
    post: {
      id: post.id,
      title: post.title,
      body: post.body,
      hashtags: post.hashtags,
      channel: post.channel,
      format: post.format ?? null,
      category: post.category ?? null,
      imageUrl: post.imageUrl ?? null,
      scheduledAt: post.scheduledAt,
      approved: post.approved ?? false,
    },
  };
}

export async function sendToN8n(url: string, payload: unknown) {
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    mode: "no-cors",
    body: JSON.stringify(payload),
  });
}
