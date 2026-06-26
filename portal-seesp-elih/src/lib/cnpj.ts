import { digitsOnly } from "./leadPayload";

export interface CNPJData {
  cnpj: string; // somente dígitos
  razao_social: string;
  nome_fantasia: string;
  situacao: string; // descricao_situacao_cadastral, ex: "ATIVA"
  porte: string; // ex: "MICRO EMPRESA"
  natureza_juridica: string;
  municipio: string;
  uf: string;
  cnae: string; // cnae_fiscal_descricao
  mei: boolean; // opcao_pelo_mei
  simples: boolean; // opcao_pelo_simples
}

/** Máscara progressiva enquanto o usuário digita: 00.000.000/0000-00. */
export function formatCNPJ(value: string): string {
  const d = digitsOnly(value).slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12)
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

function dvDigit(base: string): number {
  let sum = 0;
  let weight = 2;
  for (let i = base.length - 1; i >= 0; i--) {
    sum += Number(base[i]) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}

/** Valida um CNPJ pelos dígitos verificadores. Rejeita os 14 dígitos iguais. */
export function isValidCNPJ(value: string): boolean {
  const d = digitsOnly(value);
  if (d.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(d)) return false;

  const dv1 = dvDigit(d.slice(0, 12));
  if (dv1 !== Number(d[12])) return false;

  const dv2 = dvDigit(d.slice(0, 13));
  return dv2 === Number(d[13]);
}

export type FetchCNPJResult =
  | { ok: true; data: CNPJData }
  | { ok: false; error: string; status?: number };

/** Consulta o CNPJ diretamente via BrasilAPI do cliente. */
export async function fetchCNPJ(value: string): Promise<FetchCNPJResult> {
  const d = digitsOnly(value);
  if (!isValidCNPJ(d)) return { ok: false, error: "CNPJ inválido" };
  try {
    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${d}`, {
      headers: {
        Accept: "application/json",
      },
    });
    if (res.status === 404) {
      return { ok: false, error: "CNPJ não encontrado na Receita", status: 404 };
    }
    if (!res.ok) {
      return { ok: false, error: `Erro na consulta (HTTP ${res.status})`, status: res.status };
    }
    const raw = await res.json();
    const data: CNPJData = {
      cnpj: d,
      razao_social: raw.razao_social ?? "",
      nome_fantasia: raw.nome_fantasia ?? "",
      situacao: raw.descricao_situacao_cadastral ?? "",
      porte: raw.porte ?? "",
      natureza_juridica: raw.natureza_juridica ?? "",
      municipio: raw.municipio ?? "",
      uf: raw.uf ?? "",
      cnae: raw.cnae_fiscal_descricao ?? "",
      mei: Boolean(raw.opcao_pelo_mei),
      simples: Boolean(raw.opcao_pelo_simples),
    };
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "network error" };
  }
}
