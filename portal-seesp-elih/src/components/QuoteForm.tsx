import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  MessageCircle,
  Check,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  User,
  Building2,
  Users,
  MapPinned,
  CalendarRange,
  HeartPulse,
  Wallet,
  Loader2,
  Phone,
  Plus,
  Minus,
  Briefcase,
  Search,
  ShieldCheck,
  ThumbsUp,
  Heart,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";
import { cn } from "../lib/cn";
import { buttonClasses } from "./ui/Button";
import { plans } from "../data/plans";
import { buildWhatsappLink } from "../lib/whatsapp";
import { sendCanonicalLead } from "../lib/lead";
import {
  digitsOnly,
  formatPhoneBR,
  buildLeadPayload,
  type RespostaEntry,
} from "../lib/leadPayload";
import {
  formatCNPJ,
  isValidCNPJ,
  fetchCNPJ,
  type CNPJData,
} from "../lib/cnpj";

// ─── Config ───────────────────────────────────────────────────────────────────
const REDUCAO = "35%";
const ease = [0.22, 1, 0.36, 1] as const;

// ─── Types ────────────────────────────────────────────────────────────────────
type Option = { valor: string; rotulo: string; desc?: string };

type SelectDef = {
  type: "select";
  campo: string;
  pergunta: string;
  icon: LucideIcon;
  options: Option[];
};

type VidasBracket = { key: string; rotulo: string; short: string };

type VidasDef = {
  type: "vidas";
  campo: string;
  perguntaCPF: string;
  perguntaCNPJ: string;
  icon: LucideIcon;
  brackets: VidasBracket[];
};

type PorteDef = {
  type: "porte";
  campo: string;
  pergunta: string;
  icon: LucideIcon;
  blocks: Option[];
};

type StepDef = SelectDef | VidasDef | PorteDef;
type QuizStepName = "tipo" | "porte" | "plano" | "regiao" | "idade" | "vidas" | "hospital" | "tem_plano" | "valor";
type StepName = QuizStepName | "nome" | "tel";
type CurStep = "intro" | StepName;

type Answers = Record<string, string>;
type VidasCounts = Record<string, number>;

// ─── Step definitions ─────────────────────────────────────────────────────────
const STEPS: Record<QuizStepName, StepDef> = {
  tipo: {
    type: "select",
    campo: "tipo",
    pergunta: "Qual o seu perfil de contratação?",
    icon: User,
    options: [
      { valor: "CPF",  rotulo: "Pessoa Física (CPF)" },
      { valor: "CNPJ", rotulo: "Empresa (CNPJ/MEI)" },
    ],
  },

  porte: {
    type: "porte",
    campo: "porte",
    pergunta: "Qual a constituição da empresa?",
    icon: Briefcase,
    blocks: [
      { valor: "MEI",    rotulo: "MEI",    desc: "1 beneficiário mínimo" },
      { valor: "ME_EPP", rotulo: "ME/EPP", desc: "Micro ou Pequena Empresa" },
      { valor: "LTDA",   rotulo: "LTDA",   desc: "Sociedade Limitada" },
      { valor: "SA",     rotulo: "S.A.",   desc: "Sociedade Anônima" },
    ],
  },

  plano: {
    type: "select",
    campo: "plano",
    pergunta: "O plano é individual ou familiar?",
    icon: Users,
    options: [
      { valor: "INDIVIDUAL", rotulo: "Só para mim" },
      { valor: "FAMILIAR",   rotulo: "Para mim + dependentes" },
    ],
  },

  regiao: {
    type: "select",
    campo: "regiao",
    pergunta: "Em qual região do estado você está?",
    icon: MapPinned,
    options: [
      { valor: "capital",  rotulo: "Capital SP" },
      { valor: "grande-sp", rotulo: "Grande São Paulo" },
      { valor: "litoral",  rotulo: "Litoral Paulista" },
      { valor: "interior", rotulo: "Interior de SP" },
    ],
  },

  idade: {
    type: "select",
    campo: "idade",
    pergunta: "Qual é a sua faixa etária?",
    icon: CalendarRange,
    options: [
      { valor: "0-18",  rotulo: "Até 18 anos" },
      { valor: "19-28", rotulo: "19 – 28 anos" },
      { valor: "29-38", rotulo: "29 – 38 anos" },
      { valor: "39-48", rotulo: "39 – 48 anos" },
      { valor: "49-58", rotulo: "49 – 58 anos" },
      { valor: "59+",   rotulo: "59 anos ou mais" },
    ],
  },

  vidas: {
    type: "vidas",
    campo: "vidas",
    perguntaCPF:  "Quem são os beneficiários do plano?",
    perguntaCNPJ: "Quantas vidas por faixa etária?",
    icon: CalendarRange,
    brackets: [
      { key: "0-18",  short: "0–18",  rotulo: "Até 18 anos" },
      { key: "19-28", short: "19–28", rotulo: "19 – 28 anos" },
      { key: "29-38", short: "29–38", rotulo: "29 – 38 anos" },
      { key: "39-48", short: "39–48", rotulo: "39 – 48 anos" },
      { key: "49-58", short: "49–58", rotulo: "49 – 58 anos" },
      { key: "59+",   short: "59+",   rotulo: "59 anos ou mais" },
    ],
  },

  hospital: {
    type: "select",
    campo: "hospital",
    pergunta: "Tem preferência por hospitais específicos?",
    icon: Building2,
    options: [
      { valor: "SIM", rotulo: "Sim, tenho preferência" },
      { valor: "NAO", rotulo: "Prefiro o melhor custo-benefício" },
    ],
  },

  tem_plano: {
    type: "select",
    campo: "tem_plano",
    pergunta: "Você já possui plano de saúde hoje?",
    icon: HeartPulse,
    options: [
      { valor: "SIM", rotulo: "Sim, já possuo" },
      { valor: "NAO", rotulo: "Ainda não possuo" },
    ],
  },

  valor: {
    type: "select",
    campo: "valor",
    pergunta: "Qual o valor médio investido hoje?",
    icon: Wallet,
    options: [
      { valor: "0-500",     rotulo: "Até R$ 500/mês" },
      { valor: "500-1000",  rotulo: "R$ 500 a R$ 1.000/mês" },
      { valor: "1000-2000", rotulo: "R$ 1.000 a R$ 2.000/mês" },
      { valor: "2000+",     rotulo: "Acima de R$ 2.000/mês" },
    ],
  },
};

const ALL_STEPS: StepName[] = [
  "tipo", "porte", "plano", "regiao", "idade", "vidas", "hospital", "tem_plano", "valor", "nome", "tel",
];

function getVisibleSteps(answers: Answers): StepName[] {
  const tipo  = answers.tipo;
  const plano = answers.plano;
  return ALL_STEPS.filter((s) => {
    if (s === "porte")  return tipo === "CNPJ";
    if (s === "plano")  return tipo === "CPF";
    if (s === "idade")  return tipo === "CPF" && plano === "INDIVIDUAL";
    if (s === "vidas")  return tipo === "CNPJ" || (tipo === "CPF" && plano === "FAMILIAR");
    if (s === "valor")  return answers.tem_plano === "SIM";
    return true;
  });
}

// ─── Animations ───────────────────────────────────────────────────────────────
const slideVariants = {
  enter:  (dir: number) => ({ opacity: 0, x: dir * 30, filter: "blur(4px)" }),
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit:   (dir: number) => ({ opacity: 0, x: dir * -30, filter: "blur(4px)" }),
};
const slideReduced = {
  enter:  { opacity: 0 },
  center: { opacity: 1 },
  exit:   { opacity: 0 },
};

function getOptionIcon(campo: string, valor: string): LucideIcon | null {
  const map: Record<string, Record<string, LucideIcon>> = {
    tipo:      { CPF: User, CNPJ: Building2 },
    plano:     { INDIVIDUAL: User, FAMILIAR: Users },
    hospital:  { SIM: Heart, NAO: ThumbsUp },
    tem_plano: { SIM: HeartPulse, NAO: ThumbsUp },
  };
  return map[campo]?.[valor] ?? null;
}

function QuoteBadge() {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 relative overflow-hidden shrink-0">
      <span className="font-grotesk text-[9px] uppercase tracking-[0.18em] text-platinum/80 relative">
        Cotação Simplificada
      </span>
    </span>
  );
}

interface Props {
  defaultPlano?: string;
}

export function QuoteForm({ defaultPlano }: Props) {
  const reduced = useReducedMotion();

  const [currentStep, setCurrentStep] = useState<CurStep>("intro");
  const [dir, setDir] = useState(1);
  const [status, setStatus] = useState<"form" | "submitting" | "success" | "error">("form");

  const [answers, setAnswers]         = useState<Answers>({});
  const [vidasCounts, setVidasCounts] = useState<VidasCounts>({});
  const [nome, setNome]               = useState("");
  const [telefone, setTelefone]       = useState("");

  // CNPJ
  const [cnpj, setCnpj]             = useState("");
  const [cnpjStatus, setCnpjStatus] = useState<
    "idle" | "loading" | "valid" | "invalid" | "notfound" | "error"
  >("idle");
  const [empresa, setEmpresa]       = useState<CNPJData | null>(null);

  // Pré-seleciona plano de interesse
  useEffect(() => {
    if (defaultPlano) {
      setAnswers((a) => ({ ...a, plano_interesse: defaultPlano }));
    }
  }, [defaultPlano]);

  const visibleSteps = useMemo(() => getVisibleSteps(answers), [answers]);
  const stepIdx      = currentStep === "intro" ? -1 : visibleSteps.indexOf(currentStep as StepName);
  const total        = visibleSteps.length;
  const progress     = currentStep === "intro" ? 0 : ((stepIdx + 1) / total) * 100;

  const nomeValid  = nome.trim().length >= 2;
  const phoneValid = digitsOnly(telefone).length >= 10;

  function goTo(step: CurStep, direction: number) {
    setDir(direction);
    setCurrentStep(step);
  }

  function next() {
    if (currentStep === "intro") { goTo("tipo", 1); return; }

    if (currentStep === "porte") {
      const digits = digitsOnly(cnpj);
      if (cnpjStatus === "valid" && digits.length === 14 && !empresa) {
        setCnpjStatus("loading");
        fetchCNPJ(digits).then((res) => {
          if (digitsOnly(cnpj) !== digits) return;
          if (res.ok) {
            setEmpresa(res.data);
            setCnpjStatus("valid");
          } else {
            setCnpjStatus(res.status === 404 ? "notfound" : "error");
          }
        });
      }
    }

    if (stepIdx < total - 1) goTo(visibleSteps[stepIdx + 1], 1);
  }

  function back() {
    if (currentStep === "tipo" || stepIdx <= 0) { goTo("intro", -1); return; }
    goTo(visibleSteps[stepIdx - 1], -1);
  }

  function select(campo: string, valor: string) {
    const newAnswers = { ...answers, [campo]: valor };
    setAnswers(newAnswers);
    const newVisible = getVisibleSteps(newAnswers);
    const idx = newVisible.indexOf(currentStep as StepName);
    setTimeout(() => {
      if (idx < newVisible.length - 1) goTo(newVisible[idx + 1], 1);
    }, 200);
  }

  function adjustVidas(key: string, delta: number) {
    setVidasCounts((c) => ({ ...c, [key]: Math.max(0, (c[key] ?? 0) + delta) }));
  }

  function onCnpjChange(raw: string) {
    const masked = formatCNPJ(raw);
    setCnpj(masked);
    setEmpresa(null);
    const digits = digitsOnly(masked);
    if (digits.length < 14) {
      setCnpjStatus("idle");
      return;
    }
    if (!isValidCNPJ(digits)) {
      setCnpjStatus("invalid");
      return;
    }
    setCnpjStatus("valid");
  }

  const getWhatsappCtx = () => {
    return {
      nome,
      planoNome: plans.find((p) => p.slug === answers.plano_interesse)?.nome ?? defaultPlano,
      paraQuem: answers.tipo === "CNPJ" ? "Empresa" : answers.plano || undefined,
      faixaEtaria: answers.idade || undefined,
    };
  };

  const respostas: RespostaEntry[] = useMemo(() => {
    const entries: RespostaEntry[] = [];
    for (const s of visibleSteps) {
      if (s === "nome" || s === "tel") continue;
      if (s === "porte") {
        const def = STEPS.porte as PorteDef;
        const valor = answers.porte ?? "";
        if (valor) {
          const blk = def.blocks.find((b) => b.valor === valor);
          entries.push({ campo: "porte", pergunta: def.pergunta, valor, rotulo: blk?.rotulo ?? valor });
        }
        const digits = digitsOnly(cnpj);
        if (digits.length === 14 && isValidCNPJ(digits)) {
          entries.push({ campo: "cnpj", pergunta: "CNPJ informado", valor: digits, rotulo: formatCNPJ(digits) });
        }
        if (empresa) {
          entries.push({ campo: "razao_social", pergunta: "Razão social", valor: empresa.razao_social, rotulo: empresa.razao_social });
          if (empresa.situacao)
            entries.push({ campo: "situacao_cadastral", pergunta: "Situação cadastral", valor: empresa.situacao, rotulo: empresa.situacao });
          if (empresa.porte)
            entries.push({ campo: "porte_receita", pergunta: "Porte (Receita)", valor: empresa.porte, rotulo: empresa.porte });
        }
        continue;
      }
      if (s === "vidas") {
        const def = STEPS.vidas as VidasDef;
        const tot = Object.values(vidasCounts).reduce((sum, n) => sum + n, 0);
        entries.push({
          campo: "vidas_total",
          pergunta: "Total de vidas",
          valor: String(tot),
          rotulo: `${tot} vida${tot !== 1 ? "s" : ""}`,
        });
        for (const b of def.brackets) {
          const count = vidasCounts[b.key] ?? 0;
          entries.push({
            campo: `vidas_${b.key.replace(/[^a-z0-9]/gi, "_")}`,
            pergunta: `Vidas ${b.rotulo}`,
            valor: String(count),
            rotulo: `${count} vida${count !== 1 ? "s" : ""}`,
          });
        }
        continue;
      }
      const def = STEPS[s as QuizStepName] as SelectDef;
      if (!def || def.type !== "select") continue;
      const valor = answers[s] ?? "";
      const opt   = def.options.find((o) => o.valor === valor);
      entries.push({ campo: s, pergunta: def.pergunta, valor, rotulo: opt?.rotulo ?? valor });
    }

    if (answers.plano_interesse) {
      const planoObj = plans.find((p) => p.slug === answers.plano_interesse);
      entries.push({
        campo: "plano_interesse",
        pergunta: "Plano de Interesse",
        valor: answers.plano_interesse,
        rotulo: planoObj?.nome ?? answers.plano_interesse,
      });
    }

    return entries;
  }, [visibleSteps, answers, vidasCounts, cnpj, empresa]);

  async function handleSubmit() {
    setStatus("submitting");
    const payload = buildLeadPayload({ contact: { nome, telefone }, respostas });
    const success = await sendCanonicalLead(payload);
    if (success) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  }

  const currentDef: StepDef | null =
    currentStep !== "intro" && currentStep !== "nome" && currentStep !== "tel"
      ? (STEPS[currentStep as QuizStepName] ?? null)
      : null;

  return (
    <div className="relative rounded-panel bg-deep-navy glass-dark border border-white/[0.08] shadow-[0_20px_50px_-15px_rgba(2,6,23,0.6)] overflow-hidden min-h-[390px] flex flex-col">
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-panel edge edge-soft" />
      <div className="relative p-5 sm:p-7 flex-1 flex flex-col">
        {/* Top Progress Header */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <QuoteBadge />
          {status === "form" && currentStep !== "intro" && (
            <span className="font-grotesk text-[10px] uppercase tracking-[0.14em] text-platinum/50 tabular-nums shrink-0">
              {stepIdx + 1} / {total}
            </span>
          )}
        </div>

        {status === "form" && currentStep !== "intro" && (
          <div className="mb-5">
            <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-platinum to-platinum/40"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease }}
              />
            </div>
            <button
              type="button"
              onClick={back}
              className="mt-3.5 inline-flex items-center gap-1.5 text-[10px] font-grotesk uppercase tracking-[0.14em] text-platinum/50 hover:text-pristine transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden />
              Voltar
            </button>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait" custom={dir}>
            {/* SUCCESS STATE */}
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease }}
                className="flex-1 flex flex-col items-center justify-center text-center py-4"
              >
                <motion.span
                  initial={reduced ? false : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                  className="flex items-center justify-center w-14 h-14 rounded-full bg-white/[0.08] border border-white/20 mb-4 text-pristine"
                >
                  <Check className="w-7 h-7" strokeWidth={2.5} />
                </motion.span>
                <h3 className="text-xl font-bold text-pristine">Cotação enviada!</h3>
                <p className="mt-2 text-xs sm:text-sm text-platinum/75 max-w-sm leading-relaxed">
                  Obrigado, {nome.split(" ")[0] || "tudo certo"}. Preenchemos seus dados com sucesso. Se preferir, inicie seu atendimento imediato pelo WhatsApp abaixo:
                </p>
                <a
                  href={buildWhatsappLink(getWhatsappCtx())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonClasses("primary", "dark"), "mt-5 w-full sm:w-auto")}
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={2} />
                  Falar no WhatsApp agora
                </a>
              </motion.div>
            ) : status === "error" ? (
              /* ERROR STATE */
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center py-4"
              >
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-white/[0.08] border border-white/20 mb-4">
                  <AlertCircle className="w-7 h-7 text-platinum" strokeWidth={2} />
                </span>
                <h3 className="text-lg font-bold text-pristine">Não foi possível enviar</h3>
                <p className="mt-2 text-xs sm:text-sm text-platinum/75 max-w-sm leading-relaxed">
                  Não conseguimos salvar sua solicitação no sistema, mas você pode obter a cotação diretamente com nosso consultor no WhatsApp:
                </p>
                <div className="mt-5 w-full flex flex-col sm:flex-row gap-2.5">
                  <a
                    href={buildWhatsappLink(getWhatsappCtx())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonClasses("primary", "dark"), "flex-1")}
                  >
                    <MessageCircle className="h-4 w-4" strokeWidth={2} /> Falar no WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => setStatus("form")}
                    className={cn(buttonClasses("secondary", "dark"), "flex-1")}
                  >
                    Tentar novamente
                  </button>
                </div>
              </motion.div>
            ) : currentStep === "intro" ? (
              /* INTRO STEP */
              <motion.div
                key="intro"
                custom={dir}
                variants={reduced ? slideReduced : slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease }}
                className="flex-1 flex flex-col justify-center py-2"
              >
                <h3 className="text-xl sm:text-2xl font-bold text-pristine leading-snug">
                  Simule sua cotação especial SEESP — economize até <span className="text-platinum">{REDUCAO}</span> no seu plano de saúde.
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-platinum/65 leading-relaxed">
                  Responda a 4 perguntas rápidas e encontre as melhores opções para o seu perfil de forma consultiva.
                </p>
                <button
                  type="button"
                  onClick={next}
                  className={cn(buttonClasses("primary", "dark"), "mt-6 self-start")}
                >
                  Iniciar cotação
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
                </button>
              </motion.div>
            ) : currentDef?.type === "select" ? (
              /* SELECT STEP */
              <SelectStep
                key={currentDef.campo}
                def={currentDef}
                answers={answers}
                dir={dir}
                reduced={!!reduced}
                onSelect={select}
              />
            ) : currentDef?.type === "vidas" ? (
              /* VIDAS COUNTER STEP */
              <VidasCounterStep
                key="vidas"
                def={currentDef}
                answers={answers}
                counts={vidasCounts}
                dir={dir}
                reduced={!!reduced}
                onChange={adjustVidas}
                onContinue={next}
              />
            ) : currentDef?.type === "porte" ? (
              /* PORTE STEP */
              <PorteStep
                key="porte"
                def={currentDef}
                answers={answers}
                cnpj={cnpj}
                cnpjStatus={cnpjStatus}
                empresa={empresa}
                dir={dir}
                reduced={!!reduced}
                onSelectBlock={(valor) => setAnswers((a) => ({ ...a, porte: valor }))}
                onCnpjChange={onCnpjChange}
                onContinue={next}
              />
            ) : currentStep === "nome" ? (
              /* NOME STEP */
              <motion.div
                key="nome"
                custom={dir}
                variants={reduced ? slideReduced : slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease }}
                className="flex-1 flex flex-col py-2"
              >
                <StepHeading icon={User} label="Como podemos te chamar?" />
                <div className="mt-5 flex-1 flex flex-col justify-between">
                  <TextField
                    value={nome}
                    onChange={setNome}
                    onEnter={() => nomeValid && next()}
                    placeholder="Seu nome completo"
                    autoFocus
                  />
                  <NextButton label="Continuar" disabled={!nomeValid} onClick={next} />
                </div>
              </motion.div>
            ) : (
              /* TELEFONE STEP */
              <motion.div
                key="telefone"
                custom={dir}
                variants={reduced ? slideReduced : slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease }}
                className="flex-1 flex flex-col py-2"
              >
                <StepHeading icon={Phone} label="Qual seu WhatsApp para receber a cotação?" />
                <div className="mt-5 flex-1 flex flex-col justify-between">
                  <div>
                    <TextField
                      value={telefone}
                      onChange={(v) => setTelefone(formatPhoneBR(v))}
                      onEnter={() => phoneValid && handleSubmit()}
                      placeholder="(11) 99999-8888"
                      inputMode="tel"
                      autoFocus
                    />
                    <p className="mt-3 text-[10px] text-platinum/50 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" aria-hidden />
                      Seus dados estão protegidos sob a LGPD.
                    </p>
                  </div>
                  <NextButton
                    label="Solicitar cotação"
                    disabled={!phoneValid}
                    onClick={handleSubmit}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Submitting Overlay */}
        {status === "submitting" && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-obsidian/75 backdrop-blur-sm rounded-panel">
            <span className="flex flex-col items-center gap-3 text-platinum">
              <Loader2 className="w-6 h-6 animate-spin text-platinum" />
              <span className="font-grotesk text-[10px] uppercase tracking-[0.16em] text-platinum/70">
                Enviando…
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SelectStep ───────────────────────────────────────────────────────────────
function SelectStep({
  def,
  answers,
  dir,
  reduced,
  onSelect,
}: {
  def: SelectDef;
  answers: Answers;
  dir: number;
  reduced: boolean;
  onSelect: (campo: string, valor: string) => void;
}) {
  return (
    <motion.div
      custom={dir}
      variants={reduced ? slideReduced : slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4, ease }}
      className="flex-1 flex flex-col py-2"
    >
      <StepHeading icon={def.icon} label={def.pergunta} />

      {def.options.length === 2 ? (
        <div className="mt-5 grid grid-cols-2 gap-3">
          {def.options.map((opt) => {
            const selected = answers[def.campo] === opt.valor;
            const Icon = getOptionIcon(def.campo, opt.valor);
            return (
              <button
                key={opt.valor}
                type="button"
                onClick={() => onSelect(def.campo, opt.valor)}
                className={`group relative flex flex-col items-center justify-center gap-2.5 rounded-2xl p-4 min-h-[110px] border transition-all duration-200 ${
                  selected
                    ? "bg-white/[0.08] border-white/40 shadow-cta"
                    : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20"
                }`}
              >
                {Icon && (
                  <Icon
                    className={`w-7 h-7 transition-colors ${
                      selected ? "text-pristine" : "text-platinum/50 group-hover:text-platinum/80"
                    }`}
                    strokeWidth={1.5}
                    aria-hidden
                  />
                )}
                <span className={`text-xs font-semibold text-center leading-snug transition-colors ${
                  selected ? "text-pristine" : "text-platinum/80 group-hover:text-platinum"
                }`}>
                  {opt.rotulo}
                </span>
                {selected && (
                  <span className="absolute top-2 right-2 flex items-center justify-center w-4 h-4 rounded-full bg-pristine">
                    <Check className="w-2.5 h-2.5 text-obsidian" strokeWidth={3.5} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {def.options.map((opt) => {
            const selected = answers[def.campo] === opt.valor;
            return (
              <button
                key={opt.valor}
                type="button"
                onClick={() => onSelect(def.campo, opt.valor)}
                className={`group relative w-full text-left rounded-xl px-4 py-3 border transition-all duration-200 ${
                  selected
                    ? "bg-white/[0.08] border-white/40"
                    : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20"
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="min-w-0">
                    <span className={`block text-sm font-semibold leading-snug transition-colors ${
                      selected ? "text-pristine" : "text-platinum/80 group-hover:text-platinum"
                    }`}>
                      {opt.rotulo}
                    </span>
                    {opt.desc && (
                      <span className={`block text-[10px] mt-0.5 transition-colors ${
                        selected ? "text-platinum/80" : "text-platinum/40 group-hover:text-platinum/55"
                      }`}>
                        {opt.desc}
                      </span>
                    )}
                  </span>
                  <span className={`flex items-center justify-center w-4 h-4 rounded-full border shrink-0 transition-all ${
                    selected ? "bg-pristine border-pristine" : "border-white/30 group-hover:border-white/50"
                  }`}>
                    {selected && <Check className="w-2.5 h-2.5 text-obsidian" strokeWidth={3.5} />}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

// ─── VidasCounterStep ─────────────────────────────────────────────────────────
function VidasCounterStep({
  def,
  answers,
  counts,
  dir,
  reduced,
  onChange,
  onContinue,
}: {
  def: VidasDef;
  answers: Answers;
  counts: VidasCounts;
  dir: number;
  reduced: boolean;
  onChange: (key: string, delta: number) => void;
  onContinue: () => void;
}) {
  const total = Object.values(counts).reduce((s, n) => s + n, 0);
  const pergunta = answers.tipo === "CNPJ" ? def.perguntaCNPJ : def.perguntaCPF;
  const isCNPJ = answers.tipo === "CNPJ";

  return (
    <motion.div
      custom={dir}
      variants={reduced ? slideReduced : slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4, ease }}
      className="flex-1 flex flex-col py-1"
    >
      <StepHeading icon={def.icon} label={pergunta} />
      <p className="mt-1 text-[11px] text-platinum/50 leading-relaxed">
        {isCNPJ
          ? "Preencha as faixas etárias oficiais da ANS. Use +10 para preenchimento rápido."
          : "Preencha quantas pessoas de sua família estão em cada faixa etária."}
      </p>

      {/* Grid of faixas - Optimized for mobile */}
      <div className="mt-3.5 space-y-1.5 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
        {def.brackets.map((b) => {
          const count = counts[b.key] ?? 0;
          return (
            <div
              key={b.key}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 border transition-all duration-150 ${
                count > 0
                  ? "bg-white/[0.08] border-white/35"
                  : "bg-white/[0.02] border-white/10"
              }`}
            >
              <span className={`text-[9px] font-grotesk font-bold uppercase tracking-[0.08em] tabular-nums px-1.5 py-0.5 rounded shrink-0 w-[42px] text-center transition-colors ${
                count > 0 ? "bg-white/15 text-pristine" : "bg-white/5 text-platinum/35"
              }`}>
                {b.short}
              </span>

              <span className={`flex-1 text-xs font-semibold truncate transition-colors ${
                count > 0 ? "text-pristine" : "text-platinum/55"
              }`}>
                {b.rotulo}
              </span>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onChange(b.key, -10)}
                  disabled={count < 10}
                  className="flex items-center justify-center h-6 px-1 rounded border border-white/10 text-[9px] font-extrabold text-platinum/50 hover:border-white/30 disabled:opacity-20 active:scale-95 transition-all"
                >
                  −10
                </button>

                <button
                  type="button"
                  onClick={() => onChange(b.key, -1)}
                  disabled={count === 0}
                  className="flex items-center justify-center w-6 h-6 rounded border border-white/15 text-platinum/60 hover:border-white/35 disabled:opacity-20 active:scale-95 transition-all"
                >
                  <Minus className="w-2.5 h-2.5" />
                </button>

                <motion.span
                  key={count}
                  initial={{ scale: 1.15 }}
                  animate={{ scale: 1 }}
                  className={`text-xs font-bold tabular-nums w-6 text-center transition-colors ${
                    count > 0 ? "text-pristine" : "text-platinum/25"
                  }`}
                >
                  {count}
                </motion.span>

                <button
                  type="button"
                  onClick={() => onChange(b.key, 1)}
                  className="flex items-center justify-center w-6 h-6 rounded border border-white/20 text-platinum hover:border-white/40 active:scale-95 transition-all"
                >
                  <Plus className="w-2.5 h-2.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onChange(b.key, 10)}
                  className="flex items-center justify-center h-6 px-1 rounded border border-white/20 text-[9px] font-extrabold text-platinum hover:border-white/40 active:scale-95 transition-all"
                >
                  +10
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-platinum/40 uppercase font-semibold">Total:</span>
          <span className={cn("text-xs font-bold tabular-nums", total > 0 ? "text-pristine" : "text-platinum/25")}>
            {total} vida{total !== 1 ? "s" : ""}
          </span>
        </div>
        <NextButton label="Continuar" disabled={total === 0} onClick={onContinue} />
      </div>
    </motion.div>
  );
}

// ─── PorteStep ────────────────────────────────────────────────────────────────
function PorteStep({
  def,
  answers,
  cnpj,
  cnpjStatus,
  empresa,
  dir,
  reduced,
  onSelectBlock,
  onCnpjChange,
  onContinue,
}: {
  def: PorteDef;
  answers: Answers;
  cnpj: string;
  cnpjStatus: "idle" | "loading" | "valid" | "invalid" | "notfound" | "error";
  empresa: CNPJData | null;
  dir: number;
  reduced: boolean;
  onSelectBlock: (valor: string) => void;
  onCnpjChange: (raw: string) => void;
  onContinue: () => void;
}) {
  const selected   = answers.porte ?? "";
  const canContinue = Boolean(selected) || cnpjStatus === "valid";

  return (
    <motion.div
      custom={dir}
      variants={reduced ? slideReduced : slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4, ease }}
      className="flex-1 flex flex-col py-1"
    >
      <StepHeading icon={def.icon} label={def.pergunta} />

      {/* Economia CNPJ tag - Compact for mobile */}
      <div className="mt-3 rounded-xl bg-white/[0.04] border border-white/10 p-2.5 relative overflow-hidden shadow-cta">
        <div className="flex gap-2 items-center">
          <TrendingDown className="w-4 h-4 text-platinum shrink-0" />
          <p className="text-[10px] sm:text-xs font-semibold text-platinum/90 leading-tight">
            MEI ou CNPJ reduzem o valor do plano em até 35%
          </p>
        </div>
      </div>

      {/* CNPJ Input */}
      <div className="mt-3.5">
        <div className="relative">
          <input
            value={cnpj}
            inputMode="numeric"
            onChange={(e) => onCnpjChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canContinue) {
                e.preventDefault();
                onContinue();
              }
            }}
            placeholder="CNPJ da empresa (opcional)"
            className={`w-full bg-white/[0.02] border rounded-lg pl-3 pr-10 py-2.5 text-sm font-semibold tracking-wide text-pristine placeholder:text-platinum/40 focus:outline-none transition-colors ${
              cnpjStatus === "invalid" || cnpjStatus === "error" || cnpjStatus === "notfound"
                ? "border-red-400/50 focus:border-red-400"
                : cnpjStatus === "valid"
                ? "border-pristine/60 focus:border-pristine"
                : "border-white/10 focus:border-white/30"
            }`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {cnpjStatus === "loading" ? (
              <Loader2 className="w-4 h-4 text-platinum animate-spin" />
            ) : cnpjStatus === "valid" ? (
              <Check className="w-4 h-4 text-platinum" strokeWidth={2.5} />
            ) : (
              <Search className="w-4 h-4 text-platinum/35" />
            )}
          </span>
        </div>

        {cnpjStatus === "valid" && empresa ? (
          <div className="mt-2 rounded-lg bg-white/[0.06] border border-white/15 px-3 py-2">
            <p className="text-[11px] font-bold text-pristine truncate leading-snug">
              {empresa.razao_social || "Empresa encontrada"}
            </p>
            <p className="mt-0.5 text-[9px] text-platinum/50">
              {[empresa.situacao, empresa.porte, [empresa.municipio, empresa.uf].filter(Boolean).join("/")].filter(Boolean).join(" · ")}
            </p>
          </div>
        ) : cnpjStatus === "invalid" ? (
          <p className="mt-1.5 text-[10px] text-red-300">CNPJ inválido — confira os números.</p>
        ) : cnpjStatus === "notfound" ? (
          <p className="mt-1.5 text-[10px] text-red-300">CNPJ não encontrado na Receita.</p>
        ) : cnpjStatus === "error" ? (
          <p className="mt-1.5 text-[10px] text-red-300">Consulta indisponível — preencha manualmente abaixo.</p>
        ) : null}
      </div>

      {/* Divisor */}
      <div className="mt-3 flex items-center gap-2">
        <span className="h-px flex-1 bg-white/5" />
        <span className="text-[9px] font-grotesk uppercase tracking-[0.16em] text-platinum/30">
          ou selecione manualmente
        </span>
        <span className="h-px flex-1 bg-white/5" />
      </div>

      {/* Manual block selection */}
      <div className="mt-2 grid grid-cols-2 gap-2">
        {def.blocks.map((blk) => {
          const isOn = selected === blk.valor;
          return (
            <button
              key={blk.valor}
              type="button"
              onClick={() => onSelectBlock(blk.valor)}
              className={`group relative flex flex-col items-start rounded-xl px-3 py-2 border text-left transition-all duration-200 ${
                isOn
                  ? "bg-white/[0.08] border-white/45 shadow-cta"
                  : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20"
              }`}
            >
              <span className={`text-xs font-bold transition-colors ${
                isOn ? "text-pristine" : "text-platinum/85 group-hover:text-platinum"
              }`}>
                {blk.rotulo}
              </span>
              {blk.desc && (
                <span className={`text-[9px] leading-snug transition-colors truncate w-full ${
                  isOn ? "text-platinum" : "text-platinum/40 group-hover:text-platinum/50"
                }`}>
                  {blk.desc}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <NextButton label="Continuar" disabled={!canContinue} onClick={onContinue} />
    </motion.div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StepHeading({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.08] border border-white/10 shrink-0">
        <Icon className="w-4 h-4 text-pristine" strokeWidth={2} aria-hidden />
      </span>
      <h3 className="text-sm sm:text-base font-bold text-pristine leading-snug pt-1 text-balance">
        {label}
      </h3>
    </div>
  );
}

function TextField({
  value,
  onChange,
  onEnter,
  placeholder,
  autoFocus,
  inputMode,
}: {
  value: string;
  onChange: (v: string) => void;
  onEnter: () => void;
  placeholder: string;
  autoFocus?: boolean;
  inputMode?: "text" | "tel" | "email";
}) {
  return (
    <input
      autoFocus={autoFocus}
      value={value}
      inputMode={inputMode}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onEnter();
        }
      }}
      placeholder={placeholder}
      className="w-full bg-transparent border-0 border-b border-white/20 px-0 py-2.5 text-xl sm:text-2xl font-bold text-pristine placeholder:text-platinum/30 focus:outline-none focus:border-white transition-colors"
    />
  );
}

function NextButton({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group mt-4 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-pristine text-obsidian text-xs sm:text-sm font-semibold hover:bg-platinum transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-cta self-end"
    >
      {label}
      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
    </button>
  );
}
