import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { MessageCircle, ArrowUpRight } from "lucide-react";
import { cn } from "../lib/cn";
import { buttonClasses } from "./ui/Button";
import { buildWhatsappLink } from "../lib/whatsapp";

/** Barra de cotação fixa no rodapé (mobile). Aparece após rolar um pouco. */
export function QuoteBar() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function goToForm() {
    document.querySelector("#cotacao")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 lg:hidden transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      )}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-3 mb-1 flex items-center gap-2 rounded-full bg-white border border-neutral-200 p-2 shadow-float font-sans">
        <button onClick={goToForm} className={cn(buttonClasses("primary", "light"), "flex-1 min-h-[46px]")}>
          Fazer cotação especial
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
        </button>
        <a
          href={buildWhatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp"
          className="grid place-items-center h-[46px] w-[46px] rounded-full border border-neutral-300 bg-white text-navy-900 hover:bg-neutral-50 hover:border-neutral-400 transition-colors shrink-0"
        >
          <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
        </a>
      </div>
    </div>
  );
}
