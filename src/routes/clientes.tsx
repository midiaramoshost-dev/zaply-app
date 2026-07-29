import { createFileRoute } from "@tanstack/react-router";
import { Building2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TONES } from "@/lib/content.functions";
import { emptyClient, splitList, useClients, type Client } from "@/lib/clients-store";

export const Route = createFileRoute("/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes — Zaply" },
      {
        name: "description",
        content:
          "Cadastre marcas com nicho, objetivos, público-alvo, tom de voz, palavras proibidas, cores e fontes.",
      },
      { property: "og:title", content: "Clientes — Zaply" },
      {
        property: "og:description",
        content: "Central de marcas: identidade, diretrizes de conteúdo e restrições de linguagem.",
      },
    ],
  }),
  component: ClientsPage,
});

type Draft = Omit<Client, "id" | "createdAt"> & { id?: string };

function ClientsPage() {
  const { clients, ready, addClient, updateClient, removeClient } = useClients();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>({ ...emptyClient });

  function openNew() {
    setDraft({ ...emptyClient });
    setOpen(true);
  }

  function openEdit(client: Client) {
    setDraft({ ...client });
    setOpen(true);
  }

  function save() {
    if (draft.name.trim().length < 2) {
      toast.error("Informe o nome do cliente.");
      return;
    }
    const payload = { ...draft, name: draft.name.trim() };
    delete (payload as Draft).id;
    if (draft.id) {
      updateClient(draft.id, payload);
      toast.success("Cliente atualizado.");
    } else {
      addClient(payload);
      toast.success("Cliente cadastrado.");
    }
    setOpen(false);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">Clientes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Guarde a identidade de cada marca para a IA gerar conteúdo no tom certo.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="size-4" />
          Novo cliente
        </Button>
      </div>

      {ready && clients.length === 0 && (
        <Card className="panel mt-6">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Nenhum cliente cadastrado ainda.
          </CardContent>
        </Card>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {clients.map((client) => (
          <Card key={client.id} className="panel">
            <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
              <div className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-border/70 bg-surface">
                  {client.logoUrl ? (
                    <img
                      src={client.logoUrl}
                      alt={`Logo de ${client.name}`}
                      className="size-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <Building2 className="size-4 text-primary" />
                  )}
                </span>
                <div>
                  <CardTitle className="text-base">{client.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{client.niche || "Sem nicho"}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => openEdit(client)} aria-label="Editar">
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Remover"
                  onClick={() => {
                    removeClient(client.id);
                    toast.success("Cliente removido.");
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Field label="Objetivos" value={client.goals} />
              <Field label="Público-alvo" value={client.audience} />
              {client.address && <Field label="Endereço" value={client.address} />}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">Tom: {client.tone}</Badge>
                {client.fonts.map((font) => (
                  <Badge key={font} variant="outline">
                    {font}
                  </Badge>
                ))}
              </div>
              {client.colors.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Cores</span>
                  {client.colors.map((color) => (
                    <span
                      key={color}
                      title={color}
                      className="size-5 rounded-full border border-border/70"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}
              {client.bannedWords.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Palavras proibidas: {client.bannedWords.join(", ")}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{draft.id ? "Editar cliente" : "Novo cliente"}</DialogTitle>
            <DialogDescription>
              Essas informações guiam a geração de conteúdo da marca.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={draft.name}
                maxLength={80}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo (URL)</Label>
              <Input
                id="logo"
                placeholder="https://..."
                value={draft.logoUrl}
                maxLength={500}
                onChange={(e) => setDraft({ ...draft, logoUrl: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="niche">Nicho</Label>
              <Input
                id="niche"
                value={draft.niche}
                maxLength={80}
                onChange={(e) => setDraft({ ...draft, niche: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goals">Objetivos</Label>
              <Textarea
                id="goals"
                rows={3}
                maxLength={500}
                value={draft.goals}
                onChange={(e) => setDraft({ ...draft, goals: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audience">Público-alvo</Label>
              <Textarea
                id="audience"
                rows={3}
                maxLength={500}
                value={draft.audience}
                onChange={(e) => setDraft({ ...draft, audience: e.target.value })}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  placeholder="Rua, número, bairro, cidade"
                  value={draft.address}
                  onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contato</Label>
                <Input
                  id="contact"
                  placeholder="E-mail ou telefone"
                  value={draft.contact}
                  onChange={(e) => setDraft({ ...draft, contact: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tom de voz</Label>
              <Select value={draft.tone} onValueChange={(tone) => setDraft({ ...draft, tone })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((tone) => (
                    <SelectItem key={tone} value={tone}>
                      {tone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="banned">Palavras proibidas (separadas por vírgula)</Label>
              <Input
                id="banned"
                value={draft.bannedWords.join(", ")}
                maxLength={300}
                onChange={(e) => setDraft({ ...draft, bannedWords: splitList(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Cores da marca</Label>
              <div className="flex flex-wrap items-center gap-2">
                {draft.colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <input
                      type="color"
                      aria-label={`Cor ${index + 1}`}
                      value={color}
                      onChange={(e) => {
                        const colors = [...draft.colors];
                        colors[index] = e.target.value;
                        setDraft({ ...draft, colors });
                      }}
                      className="size-9 cursor-pointer rounded-md border border-border bg-transparent"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Remover cor"
                      onClick={() =>
                        setDraft({ ...draft, colors: draft.colors.filter((_, i) => i !== index) })
                      }
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDraft({ ...draft, colors: [...draft.colors, "#22D3EE"] })}
                >
                  <Plus className="size-3.5" />
                  Cor
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fonts">Fontes (separadas por vírgula)</Label>
              <Input
                id="fonts"
                value={draft.fonts.join(", ")}
                maxLength={200}
                onChange={(e) => setDraft({ ...draft, fonts: splitList(e.target.value) })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={save}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm">{value}</p>
    </div>
  );
}
