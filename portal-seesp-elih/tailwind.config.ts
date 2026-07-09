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
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: { DEFAULT: "var(--primary)", foreground: "var(--primary-foreground)" },
        secondary: { DEFAULT: "var(--secondary)", foreground: "var(--secondary-foreground)" },
        muted: { DEFAULT: "var(--muted)", foreground: "var(--muted-foreground)" },
        accent: { DEFAULT: "var(--accent)", foreground: "var(--accent-foreground)" },
        card: { DEFAULT: "var(--card)", foreground: "var(--card-foreground)" },
        // Nova escala Elih
        navy: {
          50: "var(--navy-50)",
          100: "var(--navy-100)",
          150: "var(--navy-150)",
          200: "var(--navy-200)",
          300: "var(--navy-300)",
          400: "var(--navy-400)",
          500: "var(--navy-500)",
          600: "var(--navy-600)",
          700: "var(--navy-700)",
          800: "var(--navy-800)",
          900: "var(--navy-900)",
          950: "var(--navy-950)",
        },
        neutral: {
          0: "var(--neutral-0)",
          50: "var(--neutral-50)",
          100: "var(--neutral-100)",
          200: "var(--neutral-200)",
          300: "var(--neutral-300)",
          400: "var(--neutral-400)",
          500: "var(--neutral-500)",
          600: "var(--neutral-600)",
          700: "var(--neutral-700)",
          800: "var(--neutral-800)",
          900: "var(--neutral-900)",
          950: "var(--neutral-950)",
          1000: "var(--neutral-1000)",
        },
        sky: {
          100: "var(--accent-100)",
          300: "var(--accent-300)",
          500: "var(--accent-500)",
          700: "var(--accent-700)",
        },
        // Mapeamentos retrocompatíveis
        obsidian: "var(--navy-900)",
        "corp-navy": "var(--navy-950)",
        "deep-navy": "var(--navy-800)",
        graphite: "var(--neutral-800)",
        platinum: "var(--neutral-200)",
        "cool-gray": "var(--neutral-400)",
        pristine: "var(--neutral-0)",
        clinical: "var(--neutral-50)",
        "soft-slate": "var(--neutral-100)",
        "inst-blue": "var(--neutral-300)",
      },
      fontFamily: {
        sans: ["Nunito", "system-ui", "-apple-system", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
        fredoka: ["Plus Jakarta Sans", "sans-serif"],
        display: ["Plus Jakarta Sans", "sans-serif"],
        // Retrocompatíveis
        inter: ["Nunito", "sans-serif"],
        grotesk: ["Plus Jakarta Sans", "sans-serif"],
        serif: ["Nunito", "sans-serif"],
      },
      letterSpacing: { overline: "0.14em" },
      maxWidth: { "8xl": "80rem" }, // Alinhado com a --max-width de 80rem do design system
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
        panel: "var(--radius-xl)",
        frame: "var(--radius-2xl)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        panel: "0 24px 60px -30px rgba(1,18,70,0.16)",
        "nav-idle": "0 14px 40px -22px rgba(1,18,70,0.08)",
        "nav-scroll": "0 18px 44px -18px rgba(1,18,70,0.12)",
        float: "0 18px 44px -14px rgba(1,18,70,0.14)",
        cta: "var(--shadow-sm)",
        "cta-hover": "var(--shadow-md)",
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
