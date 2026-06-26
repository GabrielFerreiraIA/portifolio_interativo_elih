import type { Categoria, ParaQuem, Plan, Prioridade, Regiao } from "../data/plans";

export interface FilterState {
  categoria: Categoria | null;
  paraQuem: ParaQuem | null;
  regiao: Regiao | null;
  prioridade: Prioridade | null;
}

export const emptyFilter: FilterState = {
  categoria: null,
  paraQuem: null,
  regiao: null,
  prioridade: null,
};

export function hasAnyFilter(f: FilterState): boolean {
  return Boolean(f.categoria || f.paraQuem || f.regiao || f.prioridade);
}

/**
 * Pontua um plano contra os filtros selecionados de forma estrita.
 * Se o plano não corresponder a qualquer um dos filtros ativos, ele é excluído (retorna null).
 */
export function scorePlan(plan: Plan, f: FilterState): number | null {
  if (f.categoria && plan.categoria !== f.categoria) return null;
  if (f.paraQuem && !plan.paraQuem.includes(f.paraQuem)) return null;
  if (f.regiao && !plan.regioes.includes(f.regiao)) return null;
  if (f.prioridade && !plan.prioridades.includes(f.prioridade)) return null;

  let score = 0;
  if (f.categoria && plan.categoria === f.categoria) score += 3;
  if (f.paraQuem && plan.paraQuem.includes(f.paraQuem)) score += 2;
  if (f.regiao && plan.regioes.includes(f.regiao)) score += 2;
  if (f.prioridade && plan.prioridades.includes(f.prioridade)) score += 2;
  return score;
}

/** Retorna os planos ordenados por relevância para os filtros. */
export function rankPlans(plans: Plan[], f: FilterState): Plan[] {
  if (!hasAnyFilter(f)) return plans;
  return plans
    .map((p) => ({ p, s: scorePlan(p, f) }))
    .filter((x): x is { p: Plan; s: number } => x.s !== null)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.p);
}
