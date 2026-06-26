import { motion } from "framer-motion";
import { Overline } from "./ui/GlassPanel";
import { fadeUp, inViewSection } from "../lib/motion";
import { QuoteForm } from "./QuoteForm";

export function CotacaoSection() {
  return (
    <motion.section
      id="cotacao"
      {...inViewSection}
      variants={fadeUp}
      className="relative bg-obsidian pb-24 pt-12 sm:pt-16 scroll-mt-24"
    >
      <div className="mx-auto max-w-3xl px-5">
        <div className="text-center">
          <Overline>Cotação especial</Overline>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-pristine text-balance">
            Receba sua cotação especial SEESP
          </h2>
          <p className="mt-2 text-sm text-platinum/60 text-balance">
            Preencha em 30 segundos. Um consultor da Elih retorna com a melhor condição para o seu perfil.
          </p>
        </div>
        <div className="mt-7">
          <QuoteForm />
        </div>
      </div>
    </motion.section>
  );
}
