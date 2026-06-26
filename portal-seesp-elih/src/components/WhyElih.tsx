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
      className="relative bg-obsidian grain py-16 sm:py-20 scroll-mt-24"
    >
      <div className="pointer-events-none absolute inset-0 grid-fade" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5">
        <Overline>Por que Elih</Overline>
        <h2 className="mt-3 max-w-2xl text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-pristine text-balance">
          Mais do que um plano. Uma orientação certa para sua escolha.
        </h2>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-20px" }}
          className="mt-9 grid gap-4 sm:grid-cols-3"
        >
          {pilares.map((p) => (
            <motion.div
              key={p.titulo}
              variants={staggerItem}
              className="rounded-panel glass-dark edge edge-soft p-6"
            >
              <div className="grid h-11 w-11 place-items-center rounded-[10px] bg-white/[0.06] border border-white/10">
                <p.icon className="h-5 w-5 text-platinum" strokeWidth={1.5} />
              </div>
              <h3 className="mt-4 font-grotesk uppercase tracking-[0.14em] text-sm text-pristine">{p.titulo}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-platinum/65">{p.texto}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
