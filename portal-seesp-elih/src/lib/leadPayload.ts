export interface LeadContact {
  nome: string;
  telefone: string;
  telefone_e164: string;
  whatsapp: string;
}

export interface RespostaEntry {
  campo: string;
  pergunta: string;
  valor: string;
  rotulo: string;
}

export interface LeadPayload {
  source: string;
  form: string;
  submitted_at: string;
  lead: LeadContact;
  respostas: RespostaEntry[];
  resumo: Record<string, string | null>;
  meta: {
    user_agent: string | null;
    pagina: string | null;
    referrer: string | null;
  };
}

export function digitsOnly(value: string): string {
  return (value || "").replace(/\D/g, "");
}

/** Máscara progressiva enquanto o usuário digita: (XX) XXXXX-XXXX. */
export function formatPhoneBR(value: string): string {
  const d = digitsOnly(value).slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Normaliza para envio (DDI 55 + DDD + número). */
export function normalizePhoneBR(value: string): {
  digits: string;
  e164: string;
  whatsapp: string;
} {
  let d = digitsOnly(value);
  if (d.length <= 11) d = "55" + d;
  return { digits: d, e164: `+${d}`, whatsapp: d };
}

export interface BuildLeadInput {
  contact: { nome: string; telefone: string };
  respostas: RespostaEntry[];
}

export function buildLeadPayload({ contact, respostas }: BuildLeadInput): LeadPayload {
  const resumo: Record<string, string | null> = {};
  for (const r of respostas) resumo[r.campo] = r.valor;

  const tel = normalizePhoneBR(contact.telefone);

  return {
    source: "portal-seesp",
    form: "cotacao-simplificada-seesp",
    submitted_at: new Date().toISOString(),
    lead: {
      nome: contact.nome.trim(),
      telefone: contact.telefone.trim(),
      telefone_e164: tel.e164,
      whatsapp: tel.whatsapp,
    },
    respostas,
    resumo,
    meta: {
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      pagina: typeof window !== "undefined" ? window.location.href : null,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
    },
  };
}
