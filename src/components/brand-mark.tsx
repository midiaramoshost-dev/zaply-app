import zaplyMark from "@/assets/zaply-mark.png";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  imgClassName?: string;
};

export function BrandMark({ className, imgClassName }: BrandMarkProps) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-xl border border-primary/25 bg-[linear-gradient(140deg,color-mix(in_oklab,var(--primary)_22%,transparent),color-mix(in_oklab,var(--accent)_18%,transparent))] shadow-[0_0_20px_-6px_color-mix(in_oklab,var(--primary)_60%,transparent)]",
        className,
      )}
    >
      <img
        src={zaplyMark}
        alt="Logotipo da Zaply: raio geométrico em gradiente neon"
        width={816}
        height={816}
        loading="lazy"
        className={cn("size-[62%] object-contain", imgClassName)}
      />
    </span>
  );
}
