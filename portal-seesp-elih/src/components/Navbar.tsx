import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "../lib/cn";
import { buttonClasses } from "./ui/Button";

const links = [
  { label: "Benefícios", hash: "#beneficios" },
  { label: "Planos", hash: "#planos" },
  { label: "Por que Elih", hash: "#porque" },
];

function BrandLockup({ compact }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="Início — SEESP × Elih">
      <img
        src="https://res.cloudinary.com/dfwjwo2mz/image/upload/v1783580844/Logo_Seesp_ukt5nc.png"
        alt="SEESP"
        className={cn("w-auto object-contain", compact ? "h-[13px]" : "h-[16px]")}
      />
      <span className="text-neutral-300 text-lg leading-none">×</span>
      <img
        src="/logos/elih-seguros-wordmark-navy.png"
        alt="Elih Seguros"
        className={cn("w-auto object-contain", compact ? "h-5" : "h-6")}
      />
    </Link>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function goTo(hash: string) {
    setOpen(false);
    if (location.pathname !== "/") {
      navigate("/" + hash);
      return;
    }
    document.querySelector(hash)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4" style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}>
      <nav
        className={cn(
          "mx-auto flex items-center justify-between bg-white border border-neutral-200 rounded-full transition-all duration-500",
          scrolled ? "max-w-3xl h-14 px-4 shadow-md" : "max-w-5xl h-16 px-5 shadow-sm"
        )}
      >
        <BrandLockup compact={scrolled} />

        <div className="hidden md:flex items-center gap-1 font-sans">
          {links.map((l) => (
            <button
              key={l.hash}
              onClick={() => goTo(l.hash)}
              className="rounded-full px-3 py-2 text-sm font-semibold text-neutral-600 hover:text-navy-950 hover:bg-neutral-50 transition-colors"
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => goTo("#cotacao")}
            className={cn(buttonClasses("primary", "light"), "hidden md:inline-flex px-4 py-2 min-h-0 h-10")}
          >
            Cotação
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.75} />
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            className="md:hidden grid place-items-center h-11 w-11 rounded-full text-navy-950 hover:bg-neutral-50 transition-colors"
          >
            {open ? <X strokeWidth={1.75} /> : <Menu strokeWidth={1.75} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-md"
            style={{ paddingTop: "calc(env(safe-area-inset-top) + 5rem)" }}
          >
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06 } } }}
              className="flex flex-col gap-2 px-6"
            >
              {links.map((l) => (
                <motion.li
                  key={l.hash}
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                >
                  <button
                    onClick={() => goTo(l.hash)}
                    className="w-full text-left py-4 text-2xl font-bold font-display text-navy-950 border-b border-neutral-200"
                  >
                    {l.label}
                  </button>
                </motion.li>
              ))}
              <motion.li
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                className="mt-6"
              >
                <button onClick={() => goTo("#cotacao")} className={cn(buttonClasses("primary", "light"), "w-full")}>
                  Fazer cotação especial
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
