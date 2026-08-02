import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Cabeçalho padrão dos painéis: mesma hierarquia visual em todas as telas. */
export function PageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  actions,
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <header className={cn("page-header p-6 sm:p-7", className)}>
      <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          {Icon && (
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/20">
              <Icon className="size-5" />
            </span>
          )}
          <div className="min-w-0 space-y-1.5">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h1 className="truncate font-display text-2xl font-semibold sm:text-[1.75rem]">
              {title}
            </h1>
            {description && (
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children && <div className="relative mt-5">{children}</div>}
    </header>
  );
}
