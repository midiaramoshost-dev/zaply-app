import { CalendarClock, Check, ImageIcon, Pencil, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { statusLabel, type Post } from "@/lib/posts-store";

type Mode = "editar" | "imagem" | "reagendar" | null;

function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function PostDayCard({
  post,
  onUpdate,
}: {
  post: Post;
  onUpdate: (id: string, patch: Partial<Post>) => void;
}) {
  const [mode, setMode] = useState<Mode>(null);
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);
  const [imageUrl, setImageUrl] = useState(post.imageUrl ?? "");
  const [when, setWhen] = useState(toLocalInput(post.scheduledAt));

  const open = (next: Exclude<Mode, null>) => {
    setTitle(post.title);
    setBody(post.body);
    setImageUrl(post.imageUrl ?? "");
    setWhen(toLocalInput(post.scheduledAt));
    setMode(next);
  };

  return (
    <div className="rounded-xl border border-border/70 bg-surface/60 p-4">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="secondary">{post.channel}</Badge>
        {post.scheduledAt && (
          <span>
            {new Date(post.scheduledAt).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
        <Badge variant="outline">{statusLabel[post.status]}</Badge>
        {post.approved && (
          <Badge className="bg-primary/15 text-primary">Aprovado</Badge>
        )}
      </div>

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={`Imagem do post ${post.title}`}
          loading="lazy"
          className="mt-3 aspect-video w-full rounded-lg object-cover"
        />
      )}

      <p className="mt-2 text-sm font-medium">{post.title}</p>
      <p className="mt-1 line-clamp-3 whitespace-pre-line text-sm text-muted-foreground">
        {post.body}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => open("editar")}>
          <Pencil className="size-3.5" /> Editar post
        </Button>
        <Button size="sm" variant="outline" onClick={() => open("imagem")}>
          <ImageIcon className="size-3.5" /> Alterar imagem
        </Button>
        <Button size="sm" variant="outline" onClick={() => open("reagendar")}>
          <CalendarClock className="size-3.5" /> Reagendar
        </Button>
        {!post.approved && post.status !== "publicado" && (
          <Button
            size="sm"
            onClick={() => {
              onUpdate(post.id, { approved: true, status: "agendado" });
              toast.success("Post aprovado.");
            }}
          >
            <Check className="size-3.5" /> Aprovar
          </Button>
        )}
        {post.status !== "cancelado" && (
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => {
              onUpdate(post.id, { status: "cancelado", approved: false });
              toast("Publicação cancelada.");
            }}
          >
            <X className="size-3.5" /> Cancelar
          </Button>
        )}
        {post.status === "cancelado" && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              onUpdate(post.id, { status: post.scheduledAt ? "agendado" : "rascunho" });
              toast.success("Publicação reativada.");
            }}
          >
            Reativar
          </Button>
        )}
      </div>

      <Dialog open={mode !== null} onOpenChange={(o) => !o && setMode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {mode === "editar" && "Editar post"}
              {mode === "imagem" && "Alterar imagem"}
              {mode === "reagendar" && "Reagendar publicação"}
            </DialogTitle>
          </DialogHeader>

          {mode === "editar" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`t-${post.id}`}>Título</Label>
                <Input
                  id={`t-${post.id}`}
                  value={title}
                  maxLength={160}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`b-${post.id}`}>Conteúdo</Label>
                <Textarea
                  id={`b-${post.id}`}
                  rows={8}
                  maxLength={5000}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </div>
            </div>
          )}

          {mode === "imagem" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`i-${post.id}`}>URL da imagem</Label>
                <Input
                  id={`i-${post.id}`}
                  placeholder="https://..."
                  value={imageUrl}
                  maxLength={500}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Pré-visualização da nova imagem"
                  className="aspect-video w-full rounded-lg object-cover"
                />
              )}
            </div>
          )}

          {mode === "reagendar" && (
            <div className="space-y-2">
              <Label htmlFor={`d-${post.id}`}>Nova data e hora</Label>
              <Input
                id={`d-${post.id}`}
                type="datetime-local"
                value={when}
                onChange={(e) => setWhen(e.target.value)}
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setMode(null)}>
              Fechar
            </Button>
            <Button
              onClick={() => {
                if (mode === "editar") {
                  if (!title.trim() || !body.trim()) {
                    toast.error("Título e conteúdo são obrigatórios.");
                    return;
                  }
                  onUpdate(post.id, { title: title.trim(), body: body.trim() });
                  toast.success("Post atualizado.");
                }
                if (mode === "imagem") {
                  const url = imageUrl.trim();
                  if (url && !/^https?:\/\//i.test(url)) {
                    toast.error("Informe uma URL válida (http/https).");
                    return;
                  }
                  onUpdate(post.id, { imageUrl: url || null });
                  toast.success(url ? "Imagem atualizada." : "Imagem removida.");
                }
                if (mode === "reagendar") {
                  if (!when) {
                    toast.error("Escolha uma data.");
                    return;
                  }
                  onUpdate(post.id, {
                    scheduledAt: new Date(when).toISOString(),
                    status: post.status === "publicado" ? "publicado" : "agendado",
                  });
                  toast.success("Publicação reagendada.");
                }
                setMode(null);
              }}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
