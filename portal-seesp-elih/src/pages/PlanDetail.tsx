import { Link, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  MessageCircle,
  Check,
  Stethoscope,
  FlaskConical,
  BedDouble,
  Siren,
  Smile,
  Receipt,
  MapPin,
  Users,
  CreditCard,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { cn } from "../lib/cn";
import { buttonClasses } from "../components/ui/Button";
import { Overline } from "../components/ui/GlassPanel";
import { QuoteForm } from "../components/QuoteForm";
import { getPlan, PARA_QUEM_LABEL, REGIAO_LABEL } from "../data/plans";
import { buildWhatsappLink } from "../lib/whatsapp";
import { elihEase } from "../lib/motion";

const coberturaItens = [
  { key: "consultas", label: "Consultas", icon: Stethoscope },
  { key: "exames", label: "Exames", icon: FlaskConical },
  { key: "internacao", label: "Internação", icon: BedDouble },
  { key: "urgencia", label: "Urgência / Emergência", icon: Siren },
  { key: "odonto", label: "Odontologia", icon: Smile },
  { key: "reembolso", label: "Reembolso", icon: Receipt },
] as const;

export function PlanDetail() {
  const { slug } = useParams();
  const plan = slug ? getPlan(slug) : undefined;
  const reduce = useReducedMotion();

  if (!plan) {
    return (
      <div className="min-h-dvh bg-white grid place-items-center px-5 text-center">
        <div>
          <h1 className="text-2xl font-display font-bold text-navy-950">Plano não encontrado</h1>
          <Link to="/" className={cn(buttonClasses("primary", "light"), "mt-6")}>
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> Voltar ao portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="bg-white">
      {/* Topo */}
      <section className="relative overflow-hidden bg-white pt-24 pb-10 sm:pt-28 font-sans">
        <div className="relative mx-auto max-w-5xl px-5">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-navy-950 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> Voltar
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: elihEase }}
            >
              {/* Banner no Mobile: Exibido apenas em telas menores que lg, no topo absoluto */}
              <div className="block lg:hidden mb-6">
                <div className="relative w-full aspect-[4/3] rounded-frame overflow-hidden border border-neutral-200 shadow-md bg-neutral-100">
                  <img
                    src={plan.bannerImg}
                    alt={`Banner do ${plan.nome}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex rounded-full bg-neutral-100 px-3 py-1.5">
                  <Overline className="text-neutral-500 font-semibold">{plan.categoriaLabel}</Overline>
                </div>
                {plan.slogan && (
                  <span className="inline-flex items-center rounded-full bg-accent-100 px-3 py-1 text-[11px] font-bold text-accent-700 uppercase tracking-wider">
                    {plan.slogan}
                  </span>
                )}
              </div>
              <h1 className="mt-4 text-3xl sm:text-4xl font-display font-bold tracking-tight text-navy-950 text-balance">
                {plan.nome}
              </h1>
              <p className="mt-3 max-w-xl text-base text-neutral-600 leading-relaxed">{plan.chamada}</p>

              <div className="mt-6 inline-block rounded-panel bg-neutral-50 border border-neutral-200 p-5">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-neutral-500">a partir de</span>
                  <span className="text-2xl font-display font-bold text-navy-900 tabular-nums">{plan.faixaPreco}</span>
                </div>
                {plan.planoLabel && (
                  <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-navy-50 border border-navy-100 px-2.5 py-1 text-[11px] font-bold text-navy-800">
                    <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
                    {plan.planoLabel}
                  </span>
                )}
                {plan.pagamento && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-neutral-500">
                    <CreditCard className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                    {plan.pagamento}
                  </p>
                )}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href={buildWhatsappLink({ planoNome: plan.nome })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses("primary", "light")}
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={1.75} /> Cotação especial no WhatsApp
                </a>
                <a href="#form" className={buttonClasses("secondary", "light")}>
                  Receber proposta
                </a>
              </div>
            </motion.div>

            {/* Coluna visual no Desktop: Exibido apenas em telas lg ou maiores */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: elihEase, delay: 0.1 }}
              className="hidden lg:block relative mx-auto w-full max-w-md lg:max-w-none"
            >
              <div className="relative w-full aspect-[4/3] rounded-frame overflow-hidden border border-neutral-200 shadow-md bg-neutral-100">
                <img
                  src={plan.bannerImg}
                  alt={`Banner do ${plan.nome}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Visão geral */}
      <section className="mx-auto max-w-5xl px-5 py-10 font-sans">
        <Overline>Visão geral</Overline>
        <h2 className="mt-3 text-2xl font-display font-bold text-navy-950">{plan.resumo}</h2>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          {/* Informações detalhadas do plano */}
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-panel bg-white border border-neutral-200 shadow-sm p-5">
                <div className="flex items-center gap-2 text-navy-950">
                  <Users className="h-4 w-4" strokeWidth={1.75} />
                  <h3 className="font-display font-semibold text-xs uppercase tracking-wider">Para quem é</h3>
                </div>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {plan.paraQuem.map((p) => (
                    <li key={p} className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
                      {PARA_QUEM_LABEL[p]}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-panel bg-white border border-neutral-200 shadow-sm p-5">
                <div className="flex items-center gap-2 text-navy-950">
                  <MapPin className="h-4 w-4" strokeWidth={1.75} />
                  <h3 className="font-display font-semibold text-xs uppercase tracking-wider">Região de atendimento</h3>
                </div>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {plan.regioes.map((r) => (
                    <li key={r} className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
                      {REGIAO_LABEL[r]}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <ul className="grid gap-2 sm:grid-cols-2">
              {plan.destaques.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-2.5 rounded-lg bg-white border border-neutral-200 px-4 py-3 text-sm text-neutral-800 shadow-xs"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success-500" strokeWidth={2} />
                  {d}
                </li>
              ))}
            </ul>
          </div>

          {/* Categorias disponíveis se houver */}
          <div className="space-y-4">
            {plan.categorias && plan.categorias.length > 0 && (
              <div className="rounded-panel bg-white border border-neutral-200 shadow-sm p-5">
                <div className="flex items-center gap-2 text-navy-950">
                  <Layers className="h-4 w-4" strokeWidth={1.75} />
                  <h3 className="font-display font-semibold text-xs uppercase tracking-wider">Categorias disponíveis</h3>
                </div>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {plan.categorias.map((c) => (
                    <li
                      key={c}
                      className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Arte do flyer do plano */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[360px] rounded-panel overflow-hidden border border-neutral-200 shadow-md bg-neutral-100">
              <img
                src={plan.flyerImg}
                alt={`Flyer detalhado do ${plan.nome}`}
                className="block w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* O que inclui */}
      <section className="mx-auto max-w-5xl px-5 py-10 font-sans">
        <Overline>O que inclui</Overline>
        <h2 className="mt-3 text-2xl font-display font-bold text-navy-950">Coberturas do plano</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {coberturaItens.map((item) => {
            const ativo = Boolean(plan.cobertura[item.key]);
            return (
              <div
                key={item.key}
                className={cn(
                  "flex items-center gap-3 rounded-panel border p-4 transition-all duration-200",
                  ativo 
                    ? "bg-white border-neutral-200 shadow-sm text-navy-950 font-semibold" 
                    : "bg-neutral-50/50 border-neutral-100 text-neutral-400"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                <span className="text-sm font-semibold">{item.label}</span>
                {ativo && <Check className="ml-auto h-4 w-4 text-success-500" strokeWidth={2} />}
              </div>
            );
          })}
        </div>
        {plan.coberturas && plan.coberturas.length > 0 && (
          <div className="mt-8">
            <h3 className="font-display font-semibold text-xs text-neutral-500 uppercase tracking-wider">
              Coberturas detalhadas
            </h3>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {plan.coberturas.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 rounded-lg bg-white border border-neutral-200 px-4 py-3 text-sm text-neutral-800 shadow-xs"
                >
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success-100 text-success-700">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {plan.cobertura.rede && (
          <p className="mt-4 text-sm text-neutral-600">
            <span className="text-neutral-500">Rede referenciada: </span>
            {plan.cobertura.rede}
          </p>
        )}
      </section>

      {/* Condição especial SEESP */}
      <section className="mx-auto max-w-5xl px-5 py-10 font-sans">
        <div className="rounded-panel bg-navy-900 text-white border border-navy-800 shadow-lg p-6 sm:p-8">
          <Overline className="overline--on-dark">Condição especial SEESP</Overline>
          <p className="mt-3 text-lg font-display font-bold text-white">{plan.precoDetalhe}</p>
          <p className="mt-3 text-sm leading-relaxed text-navy-100">{plan.condicaoSeesp}</p>
          {plan.obs && (
            <p className="mt-4 border-t border-white/10 pt-3 text-xs leading-relaxed text-white/50">
              {plan.obs}
            </p>
          )}
        </div>
      </section>

      {/* Formulário */}
      <section id="form" className="mx-auto max-w-3xl px-5 pb-24 pt-6 scroll-mt-24 font-sans">
        <div className="text-center">
          <Overline>Solicite sua cotação</Overline>
          <h2 className="mt-3 text-2xl sm:text-3xl font-display font-bold tracking-tight text-navy-950">
            Solicite sua cotação especial
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Preencha e um consultor da Elih retorna com a condição do {plan.nome}.
          </p>
        </div>
        <div className="mt-7">
          <QuoteForm defaultPlano={plan.slug} />
        </div>
      </section>
    </article>
  );
}
