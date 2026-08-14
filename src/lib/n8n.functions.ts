import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const BaseInput = z.object({
  baseUrl: z.string().trim().url(),
});

const TriggerInput = z.object({
  webhookUrl: z.string().trim().url(),
  payload: z.any(),
});

function normalize(url: string) {
  return url.replace(/\/+$/, "");
}

function apiKey() {
  const key = process.env["N8N_API_KEY"];
  if (!key) throw new Error("A chave da automação não está configurada no servidor.");
  return key;
}

/** Verifica se a instância n8n responde e retorna quantos workflows existem. */
export const testN8nConnection = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => BaseInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const res = await fetch(`${normalize(data.baseUrl)}/api/v1/workflows?limit=1`, {
        headers: { "X-N8N-API-KEY": apiKey(), Accept: "application/json" },
      });
      if (!res.ok) {
        return {
          ok: false as const,
          status: res.status,
          error:
            res.status === 401
              ? "Chave de API recusada pela sua instância n8n."
              : `A instância respondeu com erro ${res.status}.`,
        };
      }
      return { ok: true as const, status: res.status, error: null };
    } catch {
      return { ok: false as const, status: 0, error: "Não foi possível alcançar a instância n8n." };
    }
  });

/** Lista os workflows disponíveis na instância. */
export const listN8nWorkflows = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => BaseInput.parse(input))
  .handler(async ({ data }) => {
    const res = await fetch(`${normalize(data.baseUrl)}/api/v1/workflows?limit=50`, {
      headers: { "X-N8N-API-KEY": apiKey(), Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`Falha ao listar automações (${res.status}).`);
    const json = (await res.json()) as { data?: Array<Record<string, unknown>> };
    return (json.data ?? []).map((w) => ({
      id: String(w["id"] ?? ""),
      name: String(w["name"] ?? "Sem nome"),
      active: Boolean(w["active"]),
      updatedAt: String(w["updatedAt"] ?? ""),
    }));
  });

/** Ativa ou desativa um workflow. */
export const setN8nWorkflowActive = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    BaseInput.extend({ workflowId: z.string().min(1), active: z.boolean() }).parse(input),
  )
  .handler(async ({ data }) => {
    const action = data.active ? "activate" : "deactivate";
    const res = await fetch(
      `${normalize(data.baseUrl)}/api/v1/workflows/${encodeURIComponent(data.workflowId)}/${action}`,
      { method: "POST", headers: { "X-N8N-API-KEY": apiKey(), Accept: "application/json" } },
    );
    if (!res.ok) throw new Error(`Não foi possível ${data.active ? "ativar" : "pausar"} a automação.`);
    return { success: true };
  });

/** Dispara o webhook do fluxo no servidor (sem no-cors, com resposta real). */
export const triggerN8nWebhook = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TriggerInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const res = await fetch(data.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-N8N-API-KEY": apiKey(),
        },
        body: JSON.stringify(data.payload),
      });
      const body = await res.text();
      return {
        ok: res.ok,
        status: res.status,
        response: body.slice(0, 500),
      };
    } catch {
      return { ok: false, status: 0, response: "Webhook inacessível." };
    }
  });
