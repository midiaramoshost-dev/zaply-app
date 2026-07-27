import { useCallback, useEffect, useState } from "react";

export type ImageStyle = "banner" | "mockup" | "ilustracao" | "foto";

export type LibraryImage = {
  id: string;
  url: string;
  prompt: string;
  style: ImageStyle;
  source: "ia" | "upload";
  createdAt: string;
};

const STORAGE_KEY = "contentflow.images.v1";
const MAX_ITEMS = 24;

export const IMAGE_STYLES: { id: ImageStyle; label: string; hint: string }[] = [
  {
    id: "banner",
    label: "Banner",
    hint: "banner promocional de marketing, composição horizontal, espaço livre para texto, cores vibrantes, alta qualidade",
  },
  {
    id: "mockup",
    label: "Mockup",
    hint: "mockup de produto profissional, dispositivo ou embalagem em cena limpa, iluminação de estúdio, sombras suaves",
  },
  {
    id: "ilustracao",
    label: "Ilustração",
    hint: "ilustração vetorial moderna, formas geométricas, paleta harmônica, estilo editorial flat",
  },
  {
    id: "foto",
    label: "Foto realista",
    hint: "fotografia realista, lente 50mm, profundidade de campo, luz natural, aparência autêntica",
  },
];

function read(): LibraryImage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LibraryImage[]) : [];
  } catch {
    return [];
  }
}

function write(items: LibraryImage[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch {
    /* quota cheia — mantém apenas em memória */
  }
}

export function useImageLibrary() {
  const [images, setImages] = useState<LibraryImage[]>([]);

  useEffect(() => {
    setImages(read());
  }, []);

  const addImage = useCallback((input: Omit<LibraryImage, "id" | "createdAt">) => {
    setImages((prev) => {
      const next = [
        { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
        ...prev,
      ].slice(0, MAX_ITEMS);
      write(next);
      return next;
    });
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const next = prev.filter((image) => image.id !== id);
      write(next);
      return next;
    });
  }, []);

  return { images, addImage, removeImage };
}
