import { createFileRoute } from "@tanstack/react-router";
import {
  Download,
  ExternalLink,
  ImagePlus,
  Loader2,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { IMAGE_STYLES, useImageLibrary, type ImageStyle } from "@/lib/images-store";
import { streamImage } from "@/lib/stream-image";
import { cn } from "@/lib/utils";

const TEMPLATES = [
  {
    name: "Post para Instagram",
    format: "1080 x 1080",
    url: "https://www.canva.com/instagram-posts/templates/",
  },
  {
    name: "Stories / Reels",
    format: "1080 x 1920",
    url: "https://www.canva.com/instagram-stories/templates/",
  },
  {
    name: "Banner LinkedIn",
    format: "1584 x 396",
    url: "https://www.canva.com/linkedin-banners/templates/",
  },
  {
    name: "Capa de Facebook",
    format: "820 x 312",
    url: "https://www.canva.com/facebook-covers/templates/",
  },
  {
    name: "Apresentação",
    format: "1920 x 1080",
    url: "https://www.canva.com/presentations/templates/",
  },
  {
    name: "Mockup de produto",
    format: "Livre",
    url: "https://www.canva.com/templates/?query=mockup",
  },
];

export const Route = createFileRoute("/imagens")({
  head: () => ({
    meta: [
      { title: "Gerador de imagens — Zaply" },
      {
        name: "description",
        content:
          "Crie banners, mockups, ilustrações e fotos realistas com IA, use templates prontos ou guarde tudo na sua biblioteca.",
      },
      { property: "og:title", content: "Gerador de imagens — Zaply" },
      {
        property: "og:description",
        content: "Imagens por IA, templates do Canva e biblioteca própria em um só lugar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ImagesPage,
});

function ImagesPage() {
  const { images, addImage, removeImage } = useImageLibrary();
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<ImageStyle>("banner");
  const [preview, setPreview] = useState<string | null>(null);
  const [isFinal, setIsFinal] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function generate() {
    const styleHint = IMAGE_STYLES.find((s) => s.id === style)?.hint ?? "";
    setLoading(true);
    setPreview(null);
    setIsFinal(false);
    try {
      let last = "";
      await streamImage(`${prompt.trim()}. Estilo: ${styleHint}.`, (dataUrl, final) => {
        setPreview(dataUrl);
        setIsFinal(final);
        last = dataUrl;
      });
      if (last) {
        addImage({ url: last, prompt: prompt.trim(), style, source: "ia" });
        toast.success("Imagem gerada e salva na biblioteca.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao gerar a imagem.");
    } finally {
      setLoading(false);
    }
  }

  function upload(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Envie um arquivo de imagem.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      addImage({
        url: String(reader.result),
        prompt: file.name,
        style: "foto",
        source: "upload",
      });
      toast.success("Imagem adicionada à biblioteca.");
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold sm:text-3xl">Gerador de imagens</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Crie com IA, use templates prontos ou reaproveite o que já está na sua biblioteca.
        </p>
      </header>

      <Tabs defaultValue="ia">
        <TabsList>
          <TabsTrigger value="ia">IA</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="biblioteca">Biblioteca própria</TabsTrigger>
        </TabsList>

        <TabsContent value="ia" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
            <Card className="panel h-fit">
              <CardHeader>
                <CardTitle className="text-base">Briefing visual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-prompt">O que você quer ver na imagem?</Label>
                  <Textarea
                    id="image-prompt"
                    rows={4}
                    maxLength={500}
                    placeholder="Ex.: banner de lançamento do plano anual com 20% de desconto"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tipo de imagem</Label>
                  <div className="flex flex-wrap gap-2">
                    {IMAGE_STYLES.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        aria-pressed={style === s.id}
                        onClick={() => setStyle(s.id)}
                        className={cn(
                          "rounded-full border border-border px-3 py-1.5 text-xs transition-colors",
                          style === s.id
                            ? "border-primary/60 bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  disabled={loading || prompt.trim().length < 3}
                  onClick={() => void generate()}
                >
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                  {loading ? "Gerando..." : "Gerar imagem"}
                </Button>
              </CardContent>
            </Card>

            <Card className="panel">
              <CardContent className="p-4">
                {preview ? (
                  <figure className="space-y-3">
                    <img
                      src={preview}
                      alt={
                        prompt
                          ? `Imagem gerada por IA: ${prompt}`
                          : "Imagem gerada por inteligência artificial"
                      }
                      className={cn(
                        "w-full rounded-xl border border-border transition-[filter] duration-300",
                        isFinal ? "blur-0" : "blur-2xl",
                      )}
                    />
                    <figcaption className="text-xs text-muted-foreground">
                      {isFinal ? "Imagem gerada por IA" : "Gerando imagem..."}
                      {prompt ? ` — ${prompt}` : ""}
                    </figcaption>
                    {isFinal && (
                      <div className="flex gap-2">
                        <Button asChild size="sm" variant="outline">
                          <a href={preview} download="contentflow.png">
                            <Download className="size-4" />
                            Baixar
                          </a>
                        </Button>
                      </div>
                    )}
                  </figure>
                ) : (
                  <div className="flex min-h-[320px] items-center justify-center text-sm text-muted-foreground">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" /> Desenhando sua imagem...
                      </span>
                    ) : (
                      "A imagem gerada aparece aqui."
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((t) => (
              <Card key={t.name} className="panel">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{t.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Badge variant="secondary">{t.format}</Badge>
                  <Button asChild size="sm" variant="outline" className="w-full">
                    <a href={t.url} target="_blank" rel="noreferrer noopener">
                      <ExternalLink className="size-4" />
                      Abrir no Canva
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="biblioteca" className="mt-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {images.length} imagem(ns) salva(s) — geradas por IA ou enviadas por você.
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) upload(file);
                e.target.value = "";
              }}
            />
            <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
              <Upload className="size-4" />
              Enviar imagem
            </Button>
          </div>

          {images.length === 0 ? (
            <Card className="panel">
              <CardContent className="flex flex-col items-center gap-2 py-16 text-sm text-muted-foreground">
                <ImagePlus className="size-6" />
                Sua biblioteca está vazia.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image) => (
                <Card key={image.id} className="panel overflow-hidden">
                  <figure>
                    <img
                      src={image.url}
                      alt={
                        image.prompt
                          ? `${image.source === "ia" ? "Imagem gerada por IA" : "Imagem enviada"}: ${image.prompt}`
                          : "Imagem da biblioteca do Zaply"
                      }
                      className="h-44 w-full object-cover"
                      loading="lazy"
                    />
                    <figcaption className="px-4 pt-3 text-xs text-muted-foreground">
                      {image.source === "ia" ? "Imagem gerada por IA" : "Imagem enviada por você"}
                    </figcaption>
                  </figure>
                  <CardContent className="space-y-3 p-4">
                    <p className="line-clamp-2 text-sm">{image.prompt}</p>
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className="text-[11px]">
                        {image.source === "ia" ? "IA" : "Upload"}
                      </Badge>
                      <div className="flex gap-1">
                        <Button asChild size="icon" variant="ghost">
                          <a href={image.url} download={`${image.id}.png`}>
                            <Download className="size-4" />
                          </a>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeImage(image.id)}
                          aria-label="Remover imagem"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
