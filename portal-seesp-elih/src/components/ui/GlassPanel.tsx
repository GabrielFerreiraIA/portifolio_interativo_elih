import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  tone?: "dark" | "light";
  edge?: "soft" | "strong" | "none";
}

/** Painel de vidro com borda metálica simplificado para o novo design system. */
export function GlassPanel({ tone = "dark", edge = "soft", className, children, ...props }: GlassPanelProps) {
  return (
    <div
      className={cn(
        "relative rounded-panel transition-all duration-200",
        tone === "dark" 
          ? "glass-dark text-white border border-white/10 shadow-panel" 
          : "bg-white text-navy-950 border border-neutral-200 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** Sobretítulo Fredoka em caixa alta (assinatura da marca). */
export function Overline({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("overline", className)}>{children}</span>;
}
