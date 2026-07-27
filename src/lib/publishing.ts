import { useCallback, useEffect, useState } from "react";

export type PublishFormat = {
  id: string;
  label: string;
  hint: string;
  supported: boolean;
};

export type PublishTarget = {
  channel: string;
  destination: string;
  formats: PublishFormat[];
};

export const PUBLISH_TARGETS: PublishTarget[] = [
  {
    channel: "Instagram",
    destination: "Conta profissional",
    formats: [
      { id: "feed", label: "Feed", hint: "Imagem única 1:1 ou 4:5", supported: true },
      { id: "carrossel", label: "Carrossel", hint: "Até 10 cards", supported: true },
      {
        id: "reels",
        label: "Reels",
        hint: "Vídeo vertical — quando suportado pela integração",
        supported: false,
      },
    ],
  },
  {
    channel: "Facebook",
    destination: "Página",
    formats: [{ id: "pagina", label: "Página", hint: "Publicação na página", supported: true }],
  },
  {
    channel: "LinkedIn",
    destination: "Perfil e empresa",
    formats: [
      { id: "perfil", label: "Perfil", hint: "Publicação pessoal", supported: true },
      { id: "empresa", label: "Empresa", hint: "Página da empresa", supported: true },
    ],
  },
  {
    channel: "X",
    destination: "Conta X",
    formats: [{ id: "tweet", label: "Tweet", hint: "Até 280 caracteres", supported: true }],
  },
];

export function targetForChannel(channel: string) {
  return PUBLISH_TARGETS.find((t) => t.channel.toLowerCase() === channel.toLowerCase()) ?? null;
}

const KEY = "contentflow.connections.v1";
const EVENT = "contentflow:connections";

function read(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as Record<string, boolean>;
  } catch {
    return {};
  }
}

export function useChannelConnections() {
  const [connections, setConnections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setConnections(read());
    const sync = () => setConnections(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggleConnection = useCallback((channel: string, value: boolean) => {
    const next = { ...read(), [channel]: value };
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { connections, toggleConnection };
}
