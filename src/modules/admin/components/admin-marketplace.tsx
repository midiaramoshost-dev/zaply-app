import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getMarketplaceItems, createMarketplaceItem, deleteMarketplaceItem } from "../services/admin.functions";
import { Loader2, Plus, Trash2, BookOpen, Tags } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AdminMarketplace() {
  const queryClient = useQueryClient();
  const [newItem, setNewItem] = useState({ title: "", description: "", prompt_text: "", category: "social_media" });

  const { data: items, isLoading } = useQuery({
    queryKey: ["admin", "marketplace"],
    queryFn: () => getMarketplaceItems(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => createMarketplaceItem({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "marketplace"] });
      setNewItem({ title: "", description: "", prompt_text: "", category: "social_media" });
      toast.success("Prompt adicionado ao Marketplace");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMarketplaceItem({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "marketplace"] });
      toast.success("Prompt removido");
    }
  });

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary size-8" /></div>;

  return (
    <div className="space-y-6">
      <Card className="panel border-border/50 bg-surface/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="size-5 text-primary" /> Novo Prompt no Marketplace
          </CardTitle>
          <CardDescription>Crie templates de prompts compartilhados para todos os usuários.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Título</label>
              <Input 
                placeholder="Ex: Legenda Magnética Instagram" 
                value={newItem.title}
                onChange={e => setNewItem({...newItem, title: e.target.value})}
                className="bg-surface/50 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Categoria</label>
              <Select value={newItem.category} onValueChange={val => setNewItem({...newItem, category: val})}>
                <SelectTrigger className="bg-surface/50 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="social_media">Redes Sociais</SelectItem>
                  <SelectItem value="ads">Anúncios</SelectItem>
                  <SelectItem value="blog">Blog/Artigos</SelectItem>
                  <SelectItem value="email">Email Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">Descrição</label>
            <Input 
              placeholder="Para que serve este prompt?" 
              value={newItem.description}
              onChange={e => setNewItem({...newItem, description: e.target.value})}
              className="bg-surface/50 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">Prompt (Use {"{topic}"} para variável)</label>
            <Textarea 
              placeholder="Crie um post sobre {topic}..." 
              value={newItem.prompt_text}
              onChange={e => setNewItem({...newItem, prompt_text: e.target.value})}
              className="bg-surface/50 border-white/10 min-h-[100px]"
            />
          </div>
          <Button 
            className="w-full" 
            onClick={() => createMutation.mutate(newItem)}
            disabled={!newItem.title || !newItem.prompt_text || createMutation.isPending}
          >
            {createMutation.isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Plus className="mr-2 size-4" />}
            Publicar no Marketplace
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {items?.map((item: any) => (
          <Card key={item.id} className="panel border-border/50 bg-surface/20 group hover:border-primary/30 transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <BookOpen className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold text-white">{item.title}</CardTitle>
                    <Badge variant="secondary" className="text-[9px] uppercase mt-1">{item.category}</Badge>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="size-8 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deleteMutation.mutate(item.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">{item.description}</p>
              <pre className="text-[10px] bg-black/40 p-3 rounded-lg border border-white/5 whitespace-pre-wrap font-mono text-primary/80">
                {item.prompt_text}
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
