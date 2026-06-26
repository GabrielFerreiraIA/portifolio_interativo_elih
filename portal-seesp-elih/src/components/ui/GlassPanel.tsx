import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  tone?: "dark" | "light";
  edge?: "soft" | "strong" | "none";
}

/** Painel de vidro com borda metálica — base de cards e blocos. */
export function GlassPanel({ tone = "dark", edge = "soft", className, children, ...props }: GlassPanelProps) {
  return (
    <div
      className={cn(
        "relative rounded-panel shadow-panel",
        tone === "dark" ? "glass-dark text-platinum" : "glass-light text-graphite",
        edge !== "none" && "edge",
        edge === "soft" && "edge-soft",
        edge === "strong" && "edge-strong",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** Sobretítulo Space Grotesk em caixa alta (assinatura da marca). */
export function Overline({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("overline text-platinum/60", className)}>{children}</span>;
}
