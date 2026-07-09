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
      className="relative overflow-hidden bg-navy-950 pt-16 pb-20 sm:pt-20 sm:pb-24 scroll-mt-24 border-t border-b border-navy-900"
    >
      {/* Radial Glow Highlight */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,130,244,0.06),transparent_60%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-5 z-10">
        <Overline className="text-sky-300">{filtered ? "Recomendados para você" : "Todos os benefícios"}</Overline>
        <h2 className="mt-3 text-2xl sm:text-3xl font-display font-bold tracking-tight text-white text-balance">
          {filtered ? "Planos que combinam com sua busca" : "Conheça todos os planos"}
        </h2>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-20px" }}
          className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {plans.map((plan) => (
            <motion.article key={plan.slug} variants={staggerItem}>
              <Link
                to={`/plano/${plan.slug}`}
                className="group relative flex h-full flex-col rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] hover:border-sky-500/30 p-5 shadow-md shadow-navy-950/20 hover:shadow-[0_20px_40px_-15px_rgba(37,130,244,0.15)] hover:bg-white/[0.06] hover:-translate-y-1 transition-all duration-300 ease-out"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-white/[0.06] border border-white/[0.08] px-3 py-1 text-[11px] font-bold text-navy-200">
                    {plan.categoriaLabel}
                  </span>
                  {plan.tags[0] && (
                    <span className="rounded-full bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 text-[10px] font-bold text-sky-300 uppercase tracking-wider">
                      {plan.tags[0]}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-lg font-display font-bold text-white leading-tight">{plan.nome}</h3>
                <p className="mt-1.5 text-sm text-navy-200 leading-relaxed">{plan.resumo}</p>

                <ul className="mt-4 space-y-1.5 font-sans">
                  {plan.destaques.slice(0, 3).map((d) => (
                    <li key={d} className="flex items-start gap-2 text-[13px] text-navy-100">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" strokeWidth={2.5} />
                      {d}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex items-end justify-between border-t border-white/[0.08] pt-4">
                  <div className="min-w-0">
                    <span className="block text-[11px] text-neutral-400">a partir de</span>
                    <span className="text-base font-display font-bold text-white tabular-nums">{plan.faixaPreco}</span>
                    {plan.planoLabel && (
                      <span className="mt-0.5 block truncate text-[10px] text-neutral-400">{plan.planoLabel}</span>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-display font-semibold text-sky-300 group-hover:text-sky-200 transition-colors">
                    Saiba mais
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.75} />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>

        {plans.length === 0 && (
          <p className="mt-7 rounded-2xl bg-white/[0.03] border border-white/[0.08] p-8 text-center text-neutral-300 font-sans">
            Nenhum plano corresponde a todos os filtros. Tente remover um filtro.
          </p>
        )}
      </div>
    </motion.section>
  );
}
