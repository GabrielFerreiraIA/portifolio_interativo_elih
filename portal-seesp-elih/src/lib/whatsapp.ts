/** Número oficial de atendimento (DDI 55 + DDD 11). Vem do flyer. */
export const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER ?? "5511988053269";

export interface QuoteContext {
  planoNome?: string;
  nome?: string;
  cidade?: string;
  paraQuem?: string;
  faixaEtaria?: string;
}

/** Monta o link wa.me com uma mensagem pré-preenchida e contextual. */
export function buildWhatsappLink(ctx: QuoteContext = {}): string {
  const linhas: string[] = [];
  linhas.push(
    ctx.planoNome
      ? `Olá! Sou associado(a) do SEESP e tenho interesse no *${ctx.planoNome}*.`
      : "Olá! Sou associado(a) do SEESP e gostaria de uma cotação dos benefícios."
  );
  if (ctx.nome) linhas.push(`Meu nome é ${ctx.nome}.`);
  if (ctx.cidade) linhas.push(`Cidade: ${ctx.cidade}.`);
  if (ctx.paraQuem) linhas.push(`Para: ${ctx.paraQuem}.`);
  if (ctx.faixaEtaria) linhas.push(`Faixa etária: ${ctx.faixaEtaria}.`);
  linhas.push("Pode me enviar a condição especial?");

  const texto = encodeURIComponent(linhas.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`;
}
