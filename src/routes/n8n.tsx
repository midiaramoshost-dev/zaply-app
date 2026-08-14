import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowDown, Copy, PlugZap, RefreshCw, Send, Webhook, Workflow } from "lucide-react";
import { toast } from "sonner";

import {
  listN8nWorkflows,
  setN8nWorkflowActive,
  testN8nConnection,
  triggerN8nWebhook,
} from "@/lib/n8n.functions";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { usePosts } from "@/lib/posts-store";
import {
  N8N_STEPS,
  buildN8nPayload,
  sendToN8n,
  useN8n,
} from "@/lib/n8n-store";

export const Route = createFileRoute("/n8n")({
  head: () => ({
    meta: [
      { title: "Fluxo n8n — automação de publicação | Zaply" },
      {
        name: "description",
        content:
          "Cron, busca do post agendado, IA, geração de imagem, salvamento e publicação em Instagram, Facebook, LinkedIn e X via webhook do n8n.",
      },
      { property: "og:title", content: "Fluxo n8n — automação de publicação" },
      {
        property: "og:description",
        content: "Conecte o webhook do n8n e dispare o pipeline completo de publicação.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: N8nPage,
});

function N8nPage() {
  const { posts } = usePosts();
  const { config, update, toggleStep } = useN8n();
  const [sending, setSending] = useState(false);

  const queue = useMemo(
    () =>
      posts
        .filter((p) => p.status === "agendado" && p.scheduledAt)
        .sort((a, b) => (a.scheduledAt ?? "").localeCompare(b.scheduledAt ?? "")),
    [posts],
  );

  const sample = queue[0];
  const payloadPreview = JSON.stringify(
    sample
      ? buildN8nPayload(sample, config.steps)
      : { source: "contentflow", post: "nenhum post agendado" },
    null,
    2,
  );

  const dispatch = async (all: boolean) => {
    if (!config.webhookUrl) {
      toast.error("Informe a URL do webhook do n8n.");
      return;
    }
    const batch = all ? queue : queue.slice(0, 1);
    if (batch.length === 0) {
      toast.error("Nenhum post agendado na fila.");
      return;
    }
    setSending(true);
    try {
      for (const post of batch) {
        await sendToN8n(config.webhookUrl, buildN8nPayload(post, config.steps));
      }
      toast.success(
        `${batch.length} post(s) enviados ao n8n. Confira o histórico de execuções do fluxo.`,
      );
    } catch {
      toast.error("Falha ao chamar o webhook.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-display text-3xl font-semibold">Fluxo n8n</h1>
        <p className="text-muted-foreground">
          Pipeline de automação: cron → post agendado → IA → imagem → salvar → publicar nas redes.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <Card className="panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Workflow className="size-4 text-primary" /> Etapas do fluxo
            </CardTitle>
            <CardDescription>Ative ou desative os nós enviados ao n8n.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {N8N_STEPS.map((step, i) => (
              <div key={step.id}>
                <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-card/40 px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {i + 1}. {step.label}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{step.hint}</p>
                  </div>
                  <Switch
                    checked={config.steps[step.id]}
                    onCheckedChange={(v) => toggleStep(step.id, v)}
                    aria-label={`Ativar ${step.label}`}
                  />
                </div>
                {i < N8N_STEPS.length - 1 && (
                  <div className="flex justify-center py-0.5">
                    <ArrowDown className="size-3.5 text-muted-foreground/60" />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Webhook className="size-4 text-primary" /> Conexão
              </CardTitle>
              <CardDescription>
                No n8n, crie um Zap/Workflow com o nó <strong>Webhook</strong> e cole a URL abaixo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hook">URL do webhook</Label>
                <Input
                  id="hook"
                  placeholder="https://seu-n8n.app/webhook/contentflow"
                  value={config.webhookUrl}
                  onChange={(e) => update({ webhookUrl: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cron">Expressão cron (nó Schedule)</Label>
                <Input
                  id="cron"
                  value={config.cron}
                  onChange={(e) => update({ cron: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Padrão alinhado à grade: Segunda 09:00, Quarta 14:00, Sexta 18:00.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => dispatch(false)} disabled={sending}>
                  <Send className="size-4" /> Testar com 1 post
                </Button>
                <Button variant="secondary" onClick={() => dispatch(true)} disabled={sending}>
                  Enviar fila ({queue.length})
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                O envio é feito em modo <code>no-cors</code>: confirme o recebimento no histórico de
                execuções do n8n.
              </p>
            </CardContent>
          </Card>

          <Card className="panel">
            <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
              <div>
                <CardTitle className="text-base">Payload enviado</CardTitle>
                <CardDescription>Formato JSON recebido pelo nó Webhook.</CardDescription>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  navigator.clipboard.writeText(payloadPreview);
                  toast.success("Payload copiado.");
                }}
              >
                <Copy className="size-4" /> Copiar
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="max-h-72 overflow-auto rounded-lg border border-border/60 bg-background/60 p-3 text-xs">
                {payloadPreview}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="panel">
        <CardHeader>
          <CardTitle className="text-base">Fila de publicação</CardTitle>
          <CardDescription>Posts agendados que o cron irá consumir.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {queue.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum post agendado no momento.</p>
          ) : (
            queue.slice(0, 8).map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-card/40 px-3 py-2"
              >
                <span className="min-w-0 flex-1 truncate text-sm">{p.title}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{p.channel}</Badge>
                  <Badge variant="outline">
                    {p.scheduledAt
                      ? new Date(p.scheduledAt).toLocaleString("pt-BR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })
                      : "—"}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
