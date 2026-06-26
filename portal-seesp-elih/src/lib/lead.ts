/**
 * Envio opcional do lead para um webhook (n8n / CRM ELIH).
 * Defina VITE_LEAD_WEBHOOK_URL no .env para ativar.
 * Sem a URL, a função apenas retorna false (fluxo WhatsApp continua normal).
 */

import { type LeadPayload as CanonicalPayload } from "./leadPayload";

export interface LeadPayload {
  nome: string;
  whatsapp: string;
  cidade?: string;
  faixaEtaria?: string;
  dependentes?: string;
  jaPossuiPlano?: string;
  planoInteresse?: string;
}

const WEBHOOK_URL = import.meta.env.VITE_LEAD_WEBHOOK_URL as string | undefined;

export function isWebhookConfigured(): boolean {
  return Boolean(WEBHOOK_URL);
}

export async function sendLead(payload: LeadPayload): Promise<boolean> {
  if (!WEBHOOK_URL) return false;
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        origem: "portal-seesp",
        tag: "SEESP",
        enviadoEm: new Date().toISOString(),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function sendCanonicalLead(payload: CanonicalPayload): Promise<boolean> {
  if (!WEBHOOK_URL) return false;
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}
