import { useState } from "react";
import { Headset, Mail, MessageCircle, X } from "lucide-react";

import { CONTACT, mailtoLink, whatsappLink } from "@/lib/contact";
import { cn } from "@/lib/utils";

type Props = {
  /** Mensagem pré-preenchida enviada ao administrador. */
  message?: string;
};

export function FloatingContact({
  message = "Olá! Acabei de me cadastrar no Zaply e quero solicitar a liberação da minha conta.",
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-64 rounded-2xl border border-border/70 bg-surface/95 p-4 shadow-2xl backdrop-blur-xl">
          <p className="font-display text-sm font-semibold">Falar com o administrador</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Escolha o plano, faça o pagamento e solicite a liberação do seu acesso.
          </p>
          <div className="mt-3 space-y-2">
            <a
              href={whatsappLink(message)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-border/70 bg-background/60 px-3 py-2 text-xs transition-colors hover:border-primary/50 hover:text-foreground"
            >
              <MessageCircle className="size-4 text-primary" /> WhatsApp
            </a>
            <a
              href={mailtoLink("Liberação de acesso — Zaply", message)}
              className="flex items-center gap-2 rounded-xl border border-border/70 bg-background/60 px-3 py-2 text-xs transition-colors hover:border-primary/50 hover:text-foreground"
            >
              <Mail className="size-4 text-primary" /> {CONTACT.email}
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar contato" : "Falar com o administrador"}
        className={cn(
          "grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_40px_-10px_hsl(var(--primary))] transition-transform hover:scale-105",
        )}
      >
        {open ? <X className="size-5" /> : <Headset className="size-5" />}
      </button>
    </div>
  );
}
