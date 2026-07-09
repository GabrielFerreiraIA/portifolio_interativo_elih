import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Surface = "dark" | "light";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-display font-semibold transition-all duration-220 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500";

const styles: Record<Surface, Record<Variant, string>> = {
  dark: {
    primary: "bg-white text-navy-900 hover:bg-navy-100",
    secondary: "border border-white/28 text-white hover:bg-white/6",
    ghost: "bg-transparent text-white hover:bg-white/8",
  },
  light: {
    primary: "bg-navy-900 text-white hover:bg-navy-950 shadow-cta hover:shadow-cta-hover",
    secondary: "border border-neutral-300 text-navy-800 hover:bg-navy-50",
    ghost: "bg-transparent text-navy-900 hover:bg-navy-50",
  },
};

export function buttonClasses(variant: Variant = "primary", surface: Surface = "light", className?: string) {
  return cn(base, styles[surface][variant], className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  surface?: Surface;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", surface = "light", className, ...props }, ref) => (
    <button ref={ref} className={buttonClasses(variant, surface, className)} {...props} />
  )
);
Button.displayName = "Button";
