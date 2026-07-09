import { motion } from "framer-motion";
import { Headset, BadgePercent, FileCheck2 } from "lucide-react";
import { Overline } from "./ui/GlassPanel";
import { inViewSection, stagger, staggerItem } from "../lib/motion";

const pilares = [
  {
    icon: Headset,
    titulo: "Atendimento consultivo",
    texto: "Sem 0800 e sem robôs. Você fala direto com quem resolve — da dúvida à contratação.",
  },
  {
    icon: BadgePercent,
    titulo: "Condições especiais SEESP",
    texto: "Valores e benefícios negociados para associados, com isenção analítica na recomendação.",
  },
  {
    icon: FileCheck2,
    titulo: "Suporte na contratação",
    texto: "A Elih cuida da burocracia, carências e documentos. Você acompanha só o resultado.",
  },
];

export function WhyElih() {
  return (
    <motion.section
      id="porque"
      {...inViewSection}
      className="relative bg-white py-20 sm:py-28 scroll-mt-24 overflow-hidden"
    >
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-sky-50/70 blur-[130px]" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[700px] h-[700px] rounded-full bg-indigo-50/50 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50/50 px-3.5 py-1.5 text-xs font-semibold text-sky-700 tracking-wider uppercase backdrop-blur-sm">
            <span>Por que Elih</span>
          </div>
          <h2 className="mt-5 max-w-3xl text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-navy-950 text-balance">
            Mais do que um plano. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">Uma orientação certa</span> para sua escolha.
          </h2>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-20px" }}
          className="mt-16 grid gap-6 sm:grid-cols-3"
        >
          {pilares.map((p) => (
            <motion.div
              key={p.titulo}
              variants={staggerItem}
              className="group relative overflow-hidden rounded-3xl bg-white/60 border border-neutral-100/80 p-8 shadow-[0_15px_40px_-15px_rgba(1,18,70,0.04)] hover:shadow-[0_25px_50px_-12px_rgba(1,18,70,0.08)] hover:border-sky-100 hover:bg-white/80 transition-all duration-500 ease-out hover:-translate-y-1.5"
            >
              {/* Subtle top indicator line on hover */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-sky-500 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 border border-sky-100/60 mb-6 group-hover:bg-gradient-to-br group-hover:from-sky-500 group-hover:to-indigo-600 group-hover:border-transparent group-hover:shadow-[0_8px_20px_-6px_rgba(14,165,233,0.4)] transition-all duration-500 ease-out">
                <p.icon className="h-6 w-6 text-sky-600 group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
              </div>
              <h3 className="relative z-10 font-display font-semibold text-lg text-navy-950 mb-3 group-hover:text-sky-700 transition-colors duration-300">{p.titulo}</h3>
              <p className="relative z-10 text-sm sm:text-base leading-relaxed text-neutral-600">{p.texto}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
