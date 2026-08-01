import { Clock } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { formatTrialLeft, TRIAL_HOURS } from "@/hooks/use-profile-access";

type Props = { msLeft: number };

/** Faixa fixa avisando quanto tempo resta do teste gratuito de 4 horas. */
export function TrialBanner({ msLeft }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 border-b border-primary/30 bg-primary/10 px-4 py-2 text-xs text-foreground">
      <span className="inline-flex items-center gap-1.5 font-medium">
        <Clock className="size-3.5 text-primary" />
        Teste gratuito de {TRIAL_HOURS}h — restam {formatTrialLeft(msLeft)}
      </span>
      <Button asChild size="sm" variant="outline" className="h-7 px-3 text-[11px]">
        <Link to="/planos">Escolher um plano</Link>
      </Button>
    </div>
  );
}
