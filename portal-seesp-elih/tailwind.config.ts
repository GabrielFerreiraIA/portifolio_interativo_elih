import type { Config } from "tailwindcss";

/**
 * Portal SEESP × Elih — Tailwind config
 * Reaproveita o design system oficial da Elih (Executive/Clinical).
 * Tokens shadcn via CSS vars (src/index.css) + extras da marca.
 */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1.25rem", screens: { "2xl": "1280px" } },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        // Escala da marca Elih
        obsidian: "#020617",
        "corp-navy": "#0F172A",
        "deep-navy": "#0C1324",
        graphite: "#1E293B",
        platinum: "#E2E8F0",
        "cool-gray": "#C5C6CB",
        pristine: "#FFFFFF",
        clinical: "#F8FAFC",
        "soft-slate": "#E5E7EB",
        "inst-blue": "#CBD5E1",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        grotesk: ["Space Grotesk", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
      },
      letterSpacing: { overline: "0.18em" },
      maxWidth: { "8xl": "88rem" },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        panel: "20px",
        frame: "28px",
      },
      boxShadow: {
        panel: "0 24px 60px -30px rgba(2,6,23,0.6)",
        "nav-idle": "0 14px 40px -22px rgba(2,6,23,0.5)",
        "nav-scroll": "0 18px 44px -18px rgba(2,6,23,0.55)",
        float: "0 18px 44px -14px rgba(2,6,23,0.55)",
        cta: "0 6px 20px -6px rgba(2,6,23,0.24)",
        "cta-hover": "0 10px 26px -6px rgba(2,6,23,0.32)",
      },
      keyframes: {
        "pulse-soft": { "0%, 100%": { opacity: "0.6" }, "50%": { opacity: "1" } },
        marquee: { "0%": { transform: "translateX(0%)" }, "100%": { transform: "translateX(-50%)" } },
      },
      animation: {
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
