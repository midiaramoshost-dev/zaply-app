import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type Post } from "@/lib/posts-store";

interface PostEditorDialogProps {
  post: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, updates: Partial<Post>) => void;
}

export function PostEditorDialog({ post, open, onOpenChange, onSave }: PostEditorDialogProps) {
  const [title, setTitle] = useState(post?.title || "");
  const [body, setBody] = useState(post?.body || "");
  const [hashtags, setHashtags] = useState((post?.hashtags || []).join(" "));

  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Editar conteúdo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Título</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-body">Conteúdo (Legenda)</Label>
            <Textarea
              id="edit-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-tags">Hashtags</Label>
            <Input
              id="edit-tags"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#tag1 #tag2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              onSave(post.id, {
                title,
                body,
                hashtags: hashtags.split(" ").filter(t => t.length > 0).map(t => t.replace("#", "")),
              });
              onOpenChange(false);
            }}
          >
            Salvar alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
