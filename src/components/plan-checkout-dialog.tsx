import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CreditCard,
  FileText,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { whatsappLink } from "@/lib/contact";
import { formatLimit, formatPrice, type Plan } from "@/lib/plans-store";
import { cn } from "@/lib/utils";

type Props = {
  plan: Plan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContracted?: () => void;
};

type Billing = "monthly" | "yearly";
type PayMethod = "pix" | "boleto" | "card";

const STEPS = ["Plano", "Dados", "Pagamento", "Contrato"] as const;

const PAY_LABEL: Record<PayMethod, string> = {
  pix: "Pix (liberação imediata)",
  boleto: "Boleto bancário",
  card: "Cartão de crédito (link seguro)",
};

/** Preço anual com 20% de desconto (2 meses grátis). */
function yearlyCents(monthly: number) {
  return Math.round(monthly * 12 * 0.8);
}

export function PlanCheckoutDialog({ plan, open, onOpenChange, onContracted }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [billing, setBilling] = useState<Billing>("monthly");
  const [method, setMethod] = useState<PayMethod>("pix");
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    company: "",
    document: "",
    phone: "",
    email: "",
  });

  const total = useMemo(() => {
    if (!plan) return 0;
    return billing === "monthly" ? plan.price_cents : yearlyCents(plan.price_cents);
  }, [plan, billing]);

  function reset() {
    setStep(0);
    setAccepted(false);
    setBusy(false);
  }

  function close(next: boolean) {
    if (!next) reset();
    onOpenChange(next);
  }

  const dataValid =
    form.fullName.trim().length > 2 &&
    form.document.trim().length >= 11 &&
    form.phone.trim().length >= 10 &&
    /\S+@\S+\.\S+/.test(form.email.trim() || user?.email || "");

  async function confirm() {
    if (!plan) return;
    if (!user) {
      close(false);
      void navigate({ to: "/auth", search: { mode: "signup" } as never });
      return;
    }
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({ requested_plan: plan.code, full_name: form.fullName || null, phone: form.phone || null })
      .eq("id", user.id);
    setBusy(false);
    if (error) {
      toast.error("Não foi possível registrar a contratação. Tente novamente.");
      return;
    }
    setStep(3);
    onContracted?.();
    toast.success("Contratação registrada. Estamos finalizando com o time comercial.");
  }

  function sendToWhatsapp() {
    if (!plan) return;
    const resumo = [
      "*Nova contratação — Zaply*",
      `Plano: ${plan.name} (${plan.code})`,
      `Ciclo: ${billing === "monthly" ? "Mensal" : "Anual (20% off)"}`,
      `Valor: ${formatPrice(total, plan.currency)}`,
      `Pagamento: ${PAY_LABEL[method]}`,
      "",
      `Nome: ${form.fullName}`,
      form.company ? `Empresa: ${form.company}` : "",
      `CPF/CNPJ: ${form.document}`,
      `Telefone: ${form.phone}`,
      `E-mail: ${form.email || user?.email || ""}`,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappLink(resumo), "_blank", "noopener");
  }

  if (!plan) return null;

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <FileText className="size-4 text-primary" /> Contratar {plan.name}
          </DialogTitle>
          <DialogDescription>
            Processo em 3 etapas: confirmação do plano, dados de faturamento e forma de pagamento.
          </DialogDescription>
        </DialogHeader>

        {/* Indicador de etapas */}
        <ol className="flex items-center gap-2 text-[11px]">
          {STEPS.map((label, i) => (
            <li key={label} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold",
                  i < step
                    ? "border-primary bg-primary text-primary-foreground"
                    : i === step
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground",
                )}
              >
                {i < step ? <Check className="size-3" /> : i + 1}
              </span>
              <span className={cn(i === step ? "text-foreground" : "text-muted-foreground")}>
                {label}
              </span>
              {i < STEPS.length - 1 && <span className="h-px flex-1 bg-border" />}
            </li>
          ))}
        </ol>

        {step === 0 && (
          <div className="space-y-4">
            <div className="panel-quiet space-y-2 rounded-xl p-4">
              <div className="flex flex-wrap gap-2 text-[11px]">
                <Badge variant="secondary">{formatLimit(plan.max_clients, "cliente")}</Badge>
                <Badge variant="secondary">
                  {formatLimit(plan.max_posts, "post/mês", "posts/mês")}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </div>

            <div className="space-y-2">
              <Label>Ciclo de cobrança</Label>
              <RadioGroup
                value={billing}
                onValueChange={(v) => setBilling(v as Billing)}
                className="grid gap-2"
              >
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border p-3 text-sm has-[:checked]:border-primary">
                  <span className="flex items-center gap-2">
                    <RadioGroupItem value="monthly" /> Mensal
                  </span>
                  <span className="font-medium">
                    {formatPrice(plan.price_cents, plan.currency)}/mês
                  </span>
                </label>
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border p-3 text-sm has-[:checked]:border-primary">
                  <span className="flex items-center gap-2">
                    <RadioGroupItem value="yearly" /> Anual{" "}
                    <Badge variant="outline" className="border-primary/40 text-primary">
                      2 meses grátis
                    </Badge>
                  </span>
                  <span className="font-medium">
                    {formatPrice(yearlyCents(plan.price_cents), plan.currency)}/ano
                  </span>
                </label>
              </RadioGroup>
            </div>

            <Button className="w-full" onClick={() => setStep(1)}>
              Continuar <ArrowRight className="size-4" />
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="ck-name">Nome completo do responsável</Label>
                <Input
                  id="ck-name"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Maria Souza"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ck-company">Empresa (opcional)</Label>
                <Input
                  id="ck-company"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Agência Souza"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ck-doc">CPF ou CNPJ</Label>
                <Input
                  id="ck-doc"
                  value={form.document}
                  onChange={(e) => setForm({ ...form, document: e.target.value })}
                  placeholder="000.000.000-00"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ck-phone">Telefone / WhatsApp</Label>
                <Input
                  id="ck-phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ck-email">E-mail de cobrança</Label>
                <Input
                  id="ck-email"
                  type="email"
                  value={form.email || user?.email || ""}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="voce@empresa.com"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep(0)}>
                <ArrowLeft className="size-4" /> Voltar
              </Button>
              <Button className="flex-1" disabled={!dataValid} onClick={() => setStep(2)}>
                Continuar <ArrowRight className="size-4" />
              </Button>
            </div>
            {!dataValid && (
              <p className="text-[11px] text-muted-foreground">
                Preencha nome, documento, telefone e e-mail válidos para seguir.
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Forma de pagamento</Label>
              <RadioGroup
                value={method}
                onValueChange={(v) => setMethod(v as PayMethod)}
                className="grid gap-2"
              >
                {(Object.keys(PAY_LABEL) as PayMethod[]).map((key) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-border p-3 text-sm has-[:checked]:border-primary"
                  >
                    <RadioGroupItem value={key} />
                    {key === "card" ? (
                      <CreditCard className="size-4 text-primary" />
                    ) : (
                      <Building2 className="size-4 text-primary" />
                    )}
                    {PAY_LABEL[key]}
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div className="panel-quiet space-y-1 rounded-xl p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plano</span>
                <span>{plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ciclo</span>
                <span>{billing === "monthly" ? "Mensal" : "Anual"}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-medium">
                <span>Total</span>
                <span>
                  {formatPrice(total, plan.currency)}
                  <span className="text-xs text-muted-foreground">
                    /{billing === "monthly" ? "mês" : "ano"}
                  </span>
                </span>
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <Checkbox checked={accepted} onCheckedChange={(v) => setAccepted(v === true)} />
              <span>
                Li e aceito os termos de uso, a política de privacidade e as condições de
                cobrança recorrente. Posso cancelar a qualquer momento antes da próxima renovação.
              </span>
            </label>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft className="size-4" /> Voltar
              </Button>
              <Button className="flex-1" disabled={!accepted || busy} onClick={() => void confirm()}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
                Confirmar contratação
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 text-sm">
            <div className="panel-quiet flex items-start gap-3 rounded-xl p-4">
              <Check className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Contratação registrada!</p>
                <p className="text-muted-foreground">
                  O plano <strong>{plan.name}</strong> ({billing === "monthly" ? "mensal" : "anual"}) ficou
                  registrado na sua conta. Envie o resumo ao time comercial para receber o link de
                  pagamento e liberar o acesso completo.
                </p>
              </div>
            </div>
            <ol className="space-y-2 text-xs text-muted-foreground">
              <li>1. Envie o resumo da contratação pelo WhatsApp.</li>
              <li>2. Receba o link/chave de pagamento ({PAY_LABEL[method]}).</li>
              <li>3. Após a confirmação, o administrador libera o acesso automaticamente.</li>
            </ol>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={sendToWhatsapp}>
                Enviar resumo ao comercial
              </Button>
              <Button variant="ghost" onClick={() => close(false)}>
                Fechar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
