import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import { Overline } from "./ui/GlassPanel";
import { inViewSection, stagger, staggerItem } from "../lib/motion";
import type { Plan } from "../data/plans";

interface Props {
  plans: Plan[];
  filtered: boolean;
}

export function PlanGrid({ plans, filtered }: Props) {
  return (
    <motion.section
      {...inViewSection}
      className="relative bg-obsidian pt-6 pb-12 sm:pt-8 sm:pb-16 scroll-mt-24"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Overline>{filtered ? "Recomendados para você" : "Todos os benefícios"}</Overline>
        <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-pristine text-balance">
          {filtered ? "Planos que combinam com sua busca" : "Conheça todos os planos"}
        </h2>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-20px" }}
          className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {plans.map((plan) => (
            <motion.article key={plan.slug} variants={staggerItem}>
              <Link
                to={`/plano/${plan.slug}`}
                className="group relative flex h-full flex-col rounded-panel glass-dark edge edge-soft p-5 transition-transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-white/[0.06] px-3 py-1 text-[11px] text-platinum/80">
                    {plan.categoriaLabel}
                  </span>
                  {plan.tags[0] && (
                    <span className="overline text-[10px] text-platinum/45">{plan.tags[0]}</span>
                  )}
                </div>

                <h3 className="mt-4 text-lg font-bold text-pristine leading-tight">{plan.nome}</h3>
                <p className="mt-1.5 text-sm text-platinum/65 leading-relaxed">{plan.resumo}</p>

                <ul className="mt-4 space-y-1.5">
                  {plan.destaques.slice(0, 3).map((d) => (
                    <li key={d} className="flex items-start gap-2 text-[13px] text-platinum/75">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-platinum" strokeWidth={2} />
                      {d}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex items-end justify-between border-t border-platinum/10 pt-4">
                  <div className="min-w-0">
                    <span className="block text-[11px] text-platinum/45">a partir de</span>
                    <span className="text-base font-bold text-pristine tabular-nums">{plan.faixaPreco}</span>
                    {plan.planoLabel && (
                      <span className="mt-0.5 block truncate text-[10px] text-platinum/40">{plan.planoLabel}</span>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-platinum group-hover:text-pristine">
                    Saiba mais
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.75} />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>

        {plans.length === 0 && (
          <p className="mt-7 rounded-panel glass-dark edge edge-soft p-8 text-center text-platinum/70">
            Nenhum plano corresponde a todos os filtros. Tente remover um filtro.
          </p>
        )}
      </div>
    </motion.section>
  );
}
