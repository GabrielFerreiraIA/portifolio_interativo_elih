import type { Variants } from "framer-motion";

/** Ease assinatura da Elih (easeOutExpo-like). */
export const elihEase = [0.22, 1, 0.36, 1] as const;

/** Entrada de seção: fade + leve subida, dispara uma vez ao entrar na viewport. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: elihEase },
  },
};

/** Container com stagger para listas/grids. */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

/** Item filho de um container com stagger. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: elihEase } },
};

/** Props prontas para uma seção que anima ao entrar na viewport. */
export const inViewSection = {
  initial: "hidden" as const,
  whileInView: "show" as const,
  viewport: { once: true, margin: "-20px" },
};
