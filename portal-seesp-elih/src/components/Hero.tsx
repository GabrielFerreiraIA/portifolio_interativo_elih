import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ShieldCheck, Headset, Zap } from "lucide-react";
import { cn } from "../lib/cn";
import { buttonClasses } from "./ui/Button";
import { elihEase } from "../lib/motion";

const selos = [
  { icon: ShieldCheck, label: "Condições especiais" },
  { icon: Headset, label: "Atendimento consultivo" },
  { icon: Zap, label: "Cotação rápida" },
];

const heroBanners = [
  { img: "https://res.cloudinary.com/dfwjwo2mz/image/upload/v1782363868/Banner_Principal_1_lo6nxr.webp", alt: "Benefícios Exclusivos SEESP × Elih Seguros" },
  { img: "https://res.cloudinary.com/dfwjwo2mz/image/upload/v1782450732/Banner_Principal_2_hjzzln.webp", alt: "O melhor plano com condições especiais" },
];

function scrollTo(hash: string, smooth: boolean) {
  document.querySelector(hash)?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
}

function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroBanners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [reduce]);

  return (
    <div className="relative w-full aspect-[4/3] rounded-frame overflow-hidden edge edge-strong shadow-float bg-deep-navy">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={heroBanners[index].img}
          alt={heroBanners[index].alt}
          initial={{ opacity: 0, scale: 1.01 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Sombra de fundo suave para destacar os indicadores */}
      <div 
        className="absolute inset-x-0 bottom-0 h-10 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(2,6,23,0.4) 0%, transparent 100%)" }}
      />

      {/* Indicadores (dots) */}
      <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {heroBanners.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Ir para slide ${i + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === index ? "w-5 bg-pristine" : "w-1.5 bg-white/40 hover:bg-white/60"
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-obsidian grain pt-28 pb-16 sm:pt-32 sm:pb-20">
      <div className="pointer-events-none absolute inset-0 grid-fade" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[420px] w-[680px] rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(226,232,240,0.10), transparent)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Coluna de texto */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: elihEase }}
          >
            {/* Carousel no Mobile: Exibido apenas em telas menores que lg, no topo absoluto do Hero */}
            <div className="block lg:hidden mb-6">
              <HeroCarousel />
            </div>

            <h1 className="mt-5 text-balance font-extrabold tracking-tight leading-[1.1] text-pristine text-[2rem] sm:text-[2.4rem] lg:text-[2.8rem]">
              Condições exclusivas para associados.
            </h1>

            <p className="mt-4 max-w-xl text-balance text-base sm:text-lg leading-relaxed text-platinum/70">
              Planos de saúde, odonto e vida com o atendimento próximo e consultivo da Elih Seguros.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <button onClick={() => scrollTo("#planos", !reduce)} className={buttonClasses("primary", "dark")}>
                Encontrar meu plano
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.75} />
              </button>
              <button onClick={() => scrollTo("#ofertas", !reduce)} className={buttonClasses("secondary", "dark")}>
                Ver ofertas especiais
              </button>
            </div>

            <ul className="hidden sm:flex mt-8 flex-wrap gap-2.5">
              {selos.map((s) => (
                <li
                  key={s.label}
                  className="inline-flex items-center gap-2 rounded-full glass-dark edge edge-soft px-3.5 py-2 text-xs text-platinum/75"
                >
                  <s.icon className="h-3.5 w-3.5 text-platinum" strokeWidth={1.5} />
                  {s.label}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Coluna visual no Desktop: Exibido apenas em telas lg ou maiores */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: elihEase, delay: 0.1 }}
            className="hidden lg:block relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
            >
              <HeroCarousel />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
