import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, MessageCircle, ArrowUpRight, ChevronDown, RotateCcw, SlidersHorizontal } from "lucide-react";
import { cn } from "../lib/cn";
import { Overline } from "./ui/GlassPanel";
import { fadeUp, inViewSection } from "../lib/motion";
import type { Plan, Categoria, ParaQuem, Regiao, Prioridade } from "../data/plans";
import { PARA_QUEM_LABEL, REGIAO_LABEL, PRIORIDADE_LABEL } from "../data/plans";
import { buildWhatsappLink } from "../lib/whatsapp";
import { type FilterState, emptyFilter } from "../lib/filter";

interface Props {
  plans: Plan[];
  filtered: boolean;
  filter: FilterState;
  setFilter: (f: FilterState) => void;
}

export function FlyerCarousel({ plans, filtered, filter, setFilter }: Props) {
  const [showSubFilters, setShowSubFilters] = useState(false);
  const hasSubFilters = Boolean(filter.paraQuem || filter.regiao || filter.prioridade);
  const activeSubFiltersCount = (filter.paraQuem ? 1 : 0) + (filter.regiao ? 1 : 0) + (filter.prioridade ? 1 : 0);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);

  // Duplicamos os itens 3 vezes para permitir scroll infinito sem saltos visuais.
  const displayPlans = plans.length > 1 ? [...plans, ...plans, ...plans] : plans;

  // Função para rolar via botões
  function scrollByCards(dir: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 16 : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * amount, behavior: reduce ? "auto" : "smooth" });
  }

  // Monitora o scroll para redefinir a posição de forma silenciosa (invisível) no meio
  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || plans.length <= 1) return;

    const singleSetWidth = track.scrollWidth / 3;

    // Se chegou perto do começo
    if (track.scrollLeft < 10) {
      track.scrollLeft += singleSetWidth;
    }
    // Se chegou perto do fim
    else if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
      track.scrollLeft -= singleSetWidth;
    }
  };

  // Posiciona o scroll inicial no bloco do meio quando a lista de planos é alterada
  useEffect(() => {
    const track = trackRef.current;
    if (!track || plans.length <= 1) return;

    const resetToMiddle = () => {
      const singleSetWidth = track.scrollWidth / 3;
      track.scrollLeft = singleSetWidth;
    };

    resetToMiddle();
    const t = setTimeout(resetToMiddle, 60); // Timeout extra para garantir renderização de imagens/estilos
    return () => clearTimeout(t);
  }, [plans]);

  // Autoplay infinito
  useEffect(() => {
    if (reduce || paused || plans.length <= 1) return;
    const track = trackRef.current;
    if (!track) return;

    const id = setInterval(() => {
      const card = track.querySelector<HTMLElement>("[data-card]");
      const amount = card ? card.offsetWidth + 16 : 320;
      track.scrollBy({ left: amount, behavior: "smooth" });
    }, 4200);

    return () => clearInterval(id);
  }, [reduce, paused, plans.length]);

  return (
    <motion.section
      id="ofertas"
      {...inViewSection}
      variants={fadeUp}
      className="relative bg-obsidian pt-6 pb-12 sm:pt-8 sm:pb-16 scroll-mt-24"
    >
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <Overline>{filtered ? "Combinam com sua busca" : "Vitrine de ofertas"}</Overline>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-pristine text-balance">
              {filtered ? "Destaques que combinam com você" : "Ofertas em destaque para associados SEESP"}
            </h2>
          </div>
          {plans.length > 1 && (
            <div className="hidden sm:flex gap-2">
              <button
                onClick={() => scrollByCards(-1)}
                aria-label="Anterior"
                className="grid place-items-center h-11 w-11 rounded-full glass-dark edge edge-soft text-platinum hover:text-pristine transition-colors"
              >
                <ChevronLeft strokeWidth={1.75} />
              </button>
              <button
                onClick={() => scrollByCards(1)}
                aria-label="Próximo"
                className="grid place-items-center h-11 w-11 rounded-full glass-dark edge edge-soft text-platinum hover:text-pristine transition-colors"
              >
                <ChevronRight strokeWidth={1.75} />
              </button>
            </div>
          )}
        </div>

        {/* --- FILTRO COMPACTO UI UX PRO MAX --- */}
        <div className="mt-6 flex flex-col gap-3 border-b border-platinum/10 pb-4">
          <div className="flex items-center justify-between gap-3 w-full">
            {/* Categorias - Segmented Control / Tabs */}
            <div className="relative flex items-center bg-white/[0.03] border border-platinum/10 rounded-full p-1 overflow-x-auto no-scrollbar scroll-smooth">
              {[
                { id: null, label: "Todos" },
                { id: "saude", label: "Saúde" },
                { id: "odonto", label: "Odonto" },
                { id: "vida", label: "Vida" },
              ].map((tab) => {
                const active = filter.categoria === tab.id;
                return (
                  <button
                    key={tab.id || "all"}
                    type="button"
                    onClick={() => setFilter({ ...filter, categoria: tab.id as Categoria | null })}
                    className={cn(
                      "relative rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-colors duration-200 whitespace-nowrap z-10",
                      active ? "text-obsidian" : "text-platinum/70 hover:text-pristine"
                    )}
                  >
                    {tab.label}
                    {active && (
                      <motion.div
                        layoutId="activeHeroCategoryTab"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        className="absolute inset-0 bg-pristine rounded-full -z-10 shadow-cta"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Botão de Filtros Adicionais */}
            <button
              type="button"
              onClick={() => setShowSubFilters(!showSubFilters)}
              className={cn(
                "flex items-center gap-2 rounded-full px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all border shrink-0",
                showSubFilters || hasSubFilters
                  ? "bg-pristine text-obsidian border-transparent shadow-cta"
                  : "bg-white/[0.03] text-platinum/75 border-platinum/10 hover:border-platinum/30 hover:text-pristine"
              )}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Filtros</span>
              {activeSubFiltersCount > 0 && (
                <span className={cn(
                  "grid place-items-center rounded-full h-4.5 w-4.5 text-[10px] font-extrabold tabular-nums",
                  showSubFilters || hasSubFilters ? "bg-obsidian text-pristine" : "bg-pristine text-obsidian"
                )}>
                  {activeSubFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Painel Expansível de Sub-filtros */}
          <AnimatePresence initial={false}>
            {showSubFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 mt-2 rounded-panel glass-dark border border-platinum/10">
                  {/* Para Quem */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-platinum/40 tracking-wider uppercase">Para quem?</label>
                    <div className="relative">
                      <select
                        value={filter.paraQuem || ""}
                        onChange={(e) => setFilter({ ...filter, paraQuem: (e.target.value as ParaQuem) || null })}
                        className="w-full appearance-none bg-white/[0.02] text-platinum/80 border border-platinum/10 hover:border-platinum/25 rounded-lg pl-3 pr-8 py-2 text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-1 focus:ring-platinum/30 cursor-pointer"
                      >
                        <option value="" className="bg-obsidian text-platinum">Qualquer público</option>
                        {(Object.keys(PARA_QUEM_LABEL) as ParaQuem[]).map((k) => (
                          <option key={k} value={k} className="bg-obsidian text-platinum">
                            {PARA_QUEM_LABEL[k]}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-platinum/40 pointer-events-none" />
                    </div>
                  </div>

                  {/* Região */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-platinum/40 tracking-wider uppercase">Região de cobertura</label>
                    <div className="relative">
                      <select
                        value={filter.regiao || ""}
                        onChange={(e) => setFilter({ ...filter, regiao: (e.target.value as Regiao) || null })}
                        className="w-full appearance-none bg-white/[0.02] text-platinum/80 border border-platinum/10 hover:border-platinum/25 rounded-lg pl-3 pr-8 py-2 text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-1 focus:ring-platinum/30 cursor-pointer"
                      >
                        <option value="" className="bg-obsidian text-platinum">Qualquer região</option>
                        {(Object.keys(REGIAO_LABEL) as Regiao[]).map((k) => (
                          <option key={k} value={k} className="bg-obsidian text-platinum">
                            {REGIAO_LABEL[k]}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-platinum/40 pointer-events-none" />
                    </div>
                  </div>

                  {/* Prioridade */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-platinum/40 tracking-wider uppercase">Sua Prioridade</label>
                    <div className="relative">
                      <select
                        value={filter.prioridade || ""}
                        onChange={(e) => setFilter({ ...filter, prioridade: (e.target.value as Prioridade) || null })}
                        className="w-full appearance-none bg-white/[0.02] text-platinum/80 border border-platinum/10 hover:border-platinum/25 rounded-lg pl-3 pr-8 py-2 text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-1 focus:ring-platinum/30 cursor-pointer"
                      >
                        <option value="" className="bg-obsidian text-platinum">Qualquer prioridade</option>
                        {(Object.keys(PRIORIDADE_LABEL) as Prioridade[]).map((k) => (
                          <option key={k} value={k} className="bg-obsidian text-platinum">
                            {PRIORIDADE_LABEL[k]}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-platinum/40 pointer-events-none" />
                    </div>
                  </div>

                  {/* Limpar e fechar */}
                  {filtered && (
                    <div className="sm:col-span-3 flex justify-end border-t border-platinum/5 pt-2.5 mt-1">
                      <button
                        type="button"
                        onClick={() => setFilter(emptyFilter)}
                        className="inline-flex items-center gap-1.5 text-xs text-platinum/55 hover:text-platinum transition-colors"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Limpar filtros ativos
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={handleScroll}
        onPointerDown={() => setPaused(true)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="no-scrollbar mt-7 flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-5 pb-2"
        style={{ scrollPaddingLeft: "1.25rem" }}
      >
        {displayPlans.map((plan, index) => (
          <article
            key={`${plan.slug}-${index}`}
            data-card
            className="snap-start shrink-0 w-[85vw] max-w-[380px] sm:w-[360px]"
          >
            <Link
              to={`/plano/${plan.slug}`}
              className="block relative rounded-none overflow-hidden edge edge-strong shadow-float bg-deep-navy transition-transform duration-300 hover:scale-[1.02]"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={plan.flyerImg}
                  alt={`${plan.nome} — ${plan.faixaPreco}`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </Link>

            <div className="mt-3 flex gap-2">
              <Link
                to={`/plano/${plan.slug}`}
                className="group flex-1 inline-flex items-center justify-center gap-1.5 rounded-[10px] border border-platinum/20 px-3 py-2.5 text-sm font-semibold text-platinum hover:border-platinum/60 hover:text-pristine transition-colors"
              >
                Saiba mais
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.75} />
              </Link>
              <a
                href={buildWhatsappLink({ planoNome: plan.nome })}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Cotação especial de ${plan.nome} pelo WhatsApp`}
                className="grid place-items-center h-[44px] w-[44px] rounded-[10px] bg-pristine text-obsidian hover:bg-platinum transition-colors shrink-0"
              >
                <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
              </a>
            </div>
          </article>
        ))}

        {plans.length === 0 && (
          <div className={cn("snap-start shrink-0 w-full rounded-panel glass-dark edge edge-soft p-8 text-center")}>
            <p className="text-platinum/70">Nenhuma oferta para esse filtro. Tente ajustar suas escolhas.</p>
          </div>
        )}
      </div>
    </motion.section>
  );
}
