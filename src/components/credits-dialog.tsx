import { useState } from "react";
import { Coins, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { grantUserCredits } from "@/lib/admin.functions";

type Props = {
  userId: string;
  name: string;
  balance: number;
  onDone: () => void;
  className?: string;
};

const PRESETS = [10, 50, 100, 500];

/** Painel master: gera (ou retira) créditos de um usuário. */
export function CreditsDialog({ userId, name, balance, onDone, className }: Props) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("10");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const grantCredits = useServerFn(grantUserCredits);

  async function submit(value: number) {
    if (!Number.isFinite(value) || value === 0) {
      toast.error("Informe uma quantidade de créditos diferente de zero.");
      return;
    }
    setBusy(true);
    try {
      const data = await grantCredits({
        data: { userId, amount: Math.trunc(value), reason: reason.trim() || undefined },
      });
      toast.success(
        `${value > 0 ? "Créditos gerados" : "Créditos retirados"}. Novo saldo: ${data}.`,
      );
      setReason("");
      setOpen(false);
      onDone();
    } catch {
      toast.error("Não foi possível lançar os créditos.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className={className}>
          <Coins className="size-3.5" /> Créditos
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gerar créditos</DialogTitle>
          <DialogDescription>
            {name} — saldo atual: <strong>{balance}</strong> créditos Zaply. 
            Estes créditos permitem que o usuário gere conteúdos através da IA Zaply.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <Button
                key={p}
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => setAmount(String(p))}
              >
                +{p}
              </Button>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="credit-amount">Quantidade</Label>
            <Input
              id="credit-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="credit-reason">Motivo (opcional)</Label>
            <Input
              id="credit-reason"
              placeholder="Ex.: pagamento do plano Pro confirmado"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={busy}>
            Cancelar
          </Button>
          <Button onClick={() => void submit(Number(amount))} disabled={busy}>
            {busy && <Loader2 className="size-3.5 animate-spin" />} Lançar créditos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
