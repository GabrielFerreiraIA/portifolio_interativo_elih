/**
 * Elih — Tailwind theme.extend snippet
 * Cole estes blocos dentro de `theme.extend` no `tailwind.config.ts` do CRM.
 * Os tokens shadcn (border/background/primary/...) já existem; aqui vão os EXTRAS da marca Elih.
 */

// ── fontFamily ─────────────────────────────────────────────
export const fontFamily = {
  sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
  inter: ["Inter", "sans-serif"],
  grotesk: ["Space Grotesk", "system-ui", "sans-serif"], // overlines / rótulos técnicos
  serif: ["Playfair Display", "Georgia", "serif"],        // toques editoriais
  display: ["Space Grotesk", "Inter", "sans-serif"],
};

// ── colors (escala da marca, além dos tokens shadcn) ───────
export const colors = {
  // Dark / Executive
  obsidian: "#020617",
  "corp-navy": "#0F172A",
  "deep-navy": "#0C1324",
  graphite: "#1E293B",
  platinum: "#E2E8F0",
  "cool-gray": "#C5C6CB",
  // Light / Clinical
  pristine: "#FFFFFF",
  clinical: "#F8FAFC",
  "soft-slate": "#E5E7EB",
  "inst-blue": "#CBD5E1",
};

// ── letterSpacing / maxWidth ───────────────────────────────
export const letterSpacing = { overline: "0.18em" };
export const maxWidth = { "8xl": "88rem" };

// ── borderRadius (Elih usa 10–11px nos botões, 20px painéis) ─
export const borderRadius = {
  lg: "var(--radius)",                       // 10px
  md: "calc(var(--radius) - 2px)",
  sm: "calc(var(--radius) - 4px)",
  panel: "20px",
  frame: "28px",
};

// ── boxShadow (todas em obsidiana, sem cor) ────────────────
export const boxShadow = {
  panel: "0 24px 60px -30px rgba(2,6,23,0.6)",
  "nav-idle": "0 14px 40px -22px rgba(2,6,23,0.5)",
  "nav-scroll": "0 18px 44px -18px rgba(2,6,23,0.55)",
  float: "0 18px 44px -14px rgba(2,6,23,0.55)",
  cta: "0 6px 20px -6px rgba(2,6,23,0.24)",
  "cta-hover": "0 10px 26px -6px rgba(2,6,23,0.32)",
};

// ── keyframes + animation ──────────────────────────────────
export const keyframes = {
  "pulse-soft": {
    "0%, 100%": { opacity: "0.6" },
    "50%": { opacity: "1" },
  },
  marquee: {
    "0%": { transform: "translateX(0%)" },
    "100%": { transform: "translateX(-50%)" },
  },
};
export const animation = {
  "pulse-soft": "pulse-soft 3s ease-in-out infinite",
  marquee: "marquee 40s linear infinite",
};

/**
 * Exemplo de aplicação no tailwind.config.ts:
 *
 *   theme: {
 *     extend: {
 *       fontFamily,
 *       colors: { ...tokensShadcn, ...colors },
 *       letterSpacing, maxWidth, borderRadius, boxShadow, keyframes, animation,
 *     }
 *   }
 *
 * Ease padrão das animações Framer Motion da Elih: [0.22, 1, 0.36, 1]
 */
