import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type Variant = "primary" | "secondary" | "metallic";
type Surface = "dark" | "light";

const base =
  "group inline-flex items-center justify-center gap-2.5 rounded-[10px] px-6 py-3.5 text-sm font-semibold transition-all duration-200 min-h-[48px] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-platinum/60";

const styles: Record<Surface, Record<Variant, string>> = {
  dark: {
    primary: "bg-pristine text-obsidian hover:bg-platinum shadow-cta hover:shadow-cta-hover",
    secondary: "border border-platinum/20 text-platinum hover:border-platinum/60 hover:text-pristine",
    metallic:
      "text-obsidian shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_0_0_1px_rgba(15,23,42,.55),0_4px_14px_-4px_rgba(15,23,42,.18)] bg-[linear-gradient(160deg,rgba(255,255,255,.96),rgba(241,245,249,.92))] hover:brightness-105",
  },
  light: {
    primary: "bg-obsidian text-pristine hover:bg-corp-navy shadow-cta hover:shadow-cta-hover",
    secondary: "border border-graphite/20 text-graphite hover:border-graphite/60 hover:text-obsidian",
    metallic:
      "text-obsidian shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_0_0_1px_rgba(15,23,42,.55),0_4px_14px_-4px_rgba(15,23,42,.18)] bg-[linear-gradient(160deg,rgba(255,255,255,.96),rgba(241,245,249,.92))] hover:brightness-105",
  },
};

export function buttonClasses(variant: Variant = "primary", surface: Surface = "dark", className?: string) {
  return cn(base, styles[surface][variant], className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  surface?: Surface;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", surface = "dark", className, ...props }, ref) => (
    <button ref={ref} className={buttonClasses(variant, surface, className)} {...props} />
  )
);
Button.displayName = "Button";
