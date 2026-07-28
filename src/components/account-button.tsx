import { Link } from "@tanstack/react-router";
import { LogOut, UserRound } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function AccountButton() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <span className="h-7 w-24 animate-pulse rounded-full border border-border bg-surface" />
    );
  }

  if (!user) {
    return (
      <Button asChild size="sm" variant="outline" className="h-8">
        <Link to="/auth">
          <UserRound className="size-3.5" />
          Entrar
        </Link>
      </Button>
    );
  }

  const label = (user.user_metadata?.full_name as string | undefined) ?? user.email;

  return (
    <div className="flex items-center gap-2">
      <span className="hidden max-w-[180px] truncate rounded-full border border-border bg-surface px-3 py-1 text-[11px] text-muted-foreground sm:inline">
        {label}
      </span>
      <Button
        size="sm"
        variant="ghost"
        className="h-8"
        onClick={async () => {
          await signOut();
          toast.success("Você saiu da conta.");
        }}
      >
        <LogOut className="size-3.5" />
        Sair
      </Button>
    </div>
  );
}
