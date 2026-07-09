/**
 * Fonte da verdade dos planos — derivada das 7 artes do ARTES SEESP.pdf.
 * Campos sem dado no PDF ficam editáveis aqui (placeholders marcados).
 * Trocar as imagens em /public/flyers/ não exige mudar este arquivo.
 */

export type Categoria = "saude" | "odonto" | "vida" | "viagem";
export type ParaQuem = "eu" | "eu-dependentes" | "familia";
export type Regiao = "capital" | "grande-sp" | "litoral" | "interior";
export type Prioridade = "preco" | "cobertura" | "rede" | "simples";

export interface Cobertura {
  consultas?: boolean;
  exames?: boolean;
  internacao?: boolean;
  urgencia?: boolean;
  odonto?: boolean;
  reembolso?: boolean;
  rede?: string;
}

export interface Plan {
  slug: string;
  nome: string;
  operadora?: string;
  /** Slogan curto da operadora (ex.: "Saúde Consciente", "sorrindo com você"). */
  slogan?: string;
  categoria: Categoria;
  /** Rótulo curto da categoria para chips/badges. */
  categoriaLabel: string;
  /** Frase de impacto do flyer. */
  chamada: string;
  /** Subtítulo curto. */
  resumo: string;
  /** "A partir de" exibido nos cards (já formatado). */
  faixaPreco: string;
  /** Detalhe completo de preço/condição. */
  precoDetalhe: string;
  /** Plano/categoria específico do flyer (ex.: "Smart 200 SP", "Plano Master I"). */
  planoLabel?: string;
  /** Formas de pagamento, quando o flyer especifica (cartão/boleto). */
  pagamento?: string;
  paraQuem: ParaQuem[];
  regioes: Regiao[];
  prioridades: Prioridade[];
  destaques: string[];
  cobertura: Cobertura;
  /** Categorias/planos disponíveis no flyer (ex.: Essencial, Conforto, Bem-estar, Select). */
  categorias?: string[];
  /** Lista explícita de coberturas do flyer (renderizada como checklist na página). */
  coberturas?: string[];
  /** Observações da condição especial SEESP. */
  condicaoSeesp: string;
  /** Letra miúda / observações do flyer (ex.: "*Valores referentes ao plano…"). */
  obs?: string;
  /** Caminho da arte (placeholder = extraída do PDF). */
  flyerImg: string;
  /** URL do banner principal (horizontal 4:3) para a página de detalhes. */
  bannerImg: string;
  tags: string[];
}

export const CATEGORIA_LABEL: Record<Categoria, string> = {
  saude: "Plano de Saúde",
  odonto: "Odontológico",
  vida: "Seguro de Vida",
  viagem: "Assistência Viagem",
};

export const PARA_QUEM_LABEL: Record<ParaQuem, string> = {
  eu: "Só para mim",
  "eu-dependentes": "Eu + dependentes",
  familia: "Família",
};

export const REGIAO_LABEL: Record<Regiao, string> = {
  capital: "Capital",
  "grande-sp": "Grande SP",
  litoral: "Litoral",
  interior: "Interior",
};

export const PRIORIDADE_LABEL: Record<Prioridade, string> = {
  preco: "Menor preço",
  cobertura: "Melhor cobertura",
  rede: "Melhor rede",
  simples: "Contratação simples",
};

/** Arte de capa (somente para o hero). */
export const heroFlyer = "/flyers/01-capa.jpg";

export const plans: Plan[] = [
  {
    slug: "saude-ameplan",
    nome: "Ameplan Saúde",
    operadora: "Ameplan",
    slogan: "Parceria e confiança",
    categoria: "saude",
    categoriaLabel: CATEGORIA_LABEL.saude,
    chamada: "Cuidar da saúde é investir na vida.",
    resumo: "Plano de saúde com condição especial para associados do SEESP.",
    faixaPreco: "R$ 109,14/mês",
    precoDetalhe: "Planos a partir de R$ 109,14 por mês.",
    paraQuem: ["eu", "eu-dependentes", "familia"],
    regioes: ["capital", "grande-sp"],
    prioridades: ["preco", "simples"],
    destaques: ["Rede de qualidade", "Atendimento humanizado", "Cuidado que acompanha você"],
    cobertura: { consultas: true, exames: true, urgencia: true, rede: "Rede referenciada Ameplan" },
    condicaoSeesp:
      "Condição especial para associados do SEESP, com consultoria especializada Elih Seguros. Ameplan + Elih Seguros: benefícios que protegem o que mais importa.",
    obs: "Valores e coberturas sujeitos a análise de perfil.",
    flyerImg: "https://res.cloudinary.com/dfwjwo2mz/image/upload/v1783588998/VERTICAL_AMEPLAN_eo2h6o.png",
    bannerImg: "https://res.cloudinary.com/dfwjwo2mz/image/upload/v1783589014/HORIZONTAL_AMEPLAN_pk0pjn.png",
    tags: ["Mais econômico", "Indicado para começar"],
  },
  {
    slug: "saude-sao-cristovao",
    nome: "São Cristóvão Saúde",
    operadora: "São Cristóvão Saúde",
    categoria: "saude",
    categoriaLabel: CATEGORIA_LABEL.saude,
    chamada: "Plano de saúde para cuidar de quem mais importa.",
    resumo: "Quatro categorias — Essencial, Conforto, Bem-estar e Select — com rede própria e credenciada.",
    faixaPreco: "R$ 232,81/mês",
    precoDetalhe: "Planos a partir de R$ 232,81/mês (categoria Essencial, adesão).",
    planoLabel: "Categoria Essencial (adesão)",
    paraQuem: ["eu-dependentes", "familia"],
    regioes: ["capital", "grande-sp", "interior"],
    prioridades: ["cobertura", "rede"],
    destaques: ["Rede própria e credenciada", "Referência em saúde e bem-estar", "Tradição, excelência e humanização"],
    cobertura: { consultas: true, exames: true, internacao: true, urgencia: true, rede: "Rede própria e credenciada — varia por categoria" },
    categorias: ["Essencial", "Conforto", "Bem-estar", "Select"],
    condicaoSeesp:
      "Condição especial para associados SEESP, com consultoria Elih Seguros. Categorias disponíveis: Essencial, Conforto, Bem-estar e Select. Valor inicial referente à categoria Essencial (adesão).",
    obs: "Valores e coberturas sujeitos a análise.",
    flyerImg: "https://res.cloudinary.com/dfwjwo2mz/image/upload/v1783588999/VERTICAL_SAOCRISTOVAO_diwjrv.png",
    bannerImg: "https://res.cloudinary.com/dfwjwo2mz/image/upload/v1783589017/HORIZONTAL_S%C3%83O_CRISTOVAO_nudxlq.png",
    tags: ["Mais escolhido", "Para a família toda"],
  },
  {
    slug: "saude-hapvida",
    nome: "Hapvida Saúde",
    operadora: "Hapvida",
    categoria: "saude",
    categoriaLabel: CATEGORIA_LABEL.saude,
    chamada: "Prevenção vale mais. Sua família também.",
    resumo: "Mais prevenção e segurança para você e sua família todos os dias.",
    faixaPreco: "R$ 280,26/mês",
    precoDetalhe: "Plano Smart 200 SP a partir de R$ 280,26/mês.",
    planoLabel: "Smart 200 SP",
    paraQuem: ["eu", "eu-dependentes", "familia"],
    regioes: ["capital", "grande-sp"],
    prioridades: ["cobertura", "rede"],
    destaques: [
      "Plano familiar: cuidado para todos que importam",
      "Mais prevenção: acompanhamento e bem-estar",
      "Mais segurança: proteção hoje e para o amanhã",
    ],
    cobertura: { consultas: true, exames: true, internacao: true, urgencia: true, rede: "Rede Hapvida — São Paulo" },
    condicaoSeesp:
      "Condição especial para associados SEESP, com consultoria Elih Seguros — curadoria premium.",
    obs: "Plano Smart 200 SP. Valores e coberturas sujeitos a análise.",
    flyerImg: "https://res.cloudinary.com/dfwjwo2mz/image/upload/v1783589002/VERTICAL_HAPVIDA_libdwl.png",
    bannerImg: "https://res.cloudinary.com/dfwjwo2mz/image/upload/v1783589016/HORIZONTAL_HAPVIDA_vdzxcx.png",
    tags: ["Cobertura reforçada", "Curadoria premium"],
  },
  {
    slug: "saude-bluemed",
    nome: "Blue Med Saúde",
    operadora: "Blue Med",
    slogan: "Saúde Consciente",
    categoria: "saude",
    categoriaLabel: CATEGORIA_LABEL.saude,
    chamada: "Vai viajar? Sua saúde vai junto.",
    resumo: "Cobertura na Capital e no Litoral — tranquilidade em casa e durante suas viagens.",
    faixaPreco: "R$ 183,18/mês",
    precoDetalhe: "A partir de R$ 183,18 por mês.",
    paraQuem: ["eu", "eu-dependentes", "familia"],
    regioes: ["capital", "litoral"],
    prioridades: ["cobertura", "simples"],
    destaques: ["Cobertura na Capital e no Litoral", "Atendimento humanizado", "Mais acesso, menos fila"],
    cobertura: { consultas: true, urgencia: true, rede: "Blue Med — Capital e Litoral" },
    condicaoSeesp:
      "Condição especial para associados SEESP, com consultoria Elih Seguros. Com a Blue Med você conta com cobertura na Capital e no Litoral, para ter tranquilidade em casa e durante suas viagens.",
    flyerImg: "https://res.cloudinary.com/dfwjwo2mz/image/upload/v1783588999/VERTICAL_BLUEMED_nxdlig.png",
    bannerImg: "https://res.cloudinary.com/dfwjwo2mz/image/upload/v1783589015/HORIZONTAL_BLUEMED_epg6o5.png",
    tags: ["Cobre litoral e capital", "Ideal para quem viaja"],
  },
  {
    slug: "odonto-dentalpar",
    nome: "DentalPar Master I",
    operadora: "DentalPar",
    slogan: "Sorrindo com você",
    categoria: "odonto",
    categoriaLabel: CATEGORIA_LABEL.odonto,
    chamada: "Sorrindo com você, da prevenção à ortodontia.",
    resumo: "Plano odontológico Master I completo: emergência 24h, ortodontia, endodontia e muito mais.",
    faixaPreco: "3× R$ 140 no cartão",
    precoDetalhe: "Por apenas 3× de R$ 140,00 no cartão ou 3× de R$ 150,00 no boleto.",
    planoLabel: "Plano Odontológico Master I",
    pagamento: "3× de R$ 140,00 no cartão ou 3× de R$ 150,00 no boleto",
    paraQuem: ["eu", "eu-dependentes", "familia"],
    regioes: ["capital", "grande-sp", "litoral", "interior"],
    prioridades: ["cobertura", "simples"],
    destaques: ["Emergência e Urgências 24h", "Ortodontia e Endodontia inclusas", "9 frentes de cobertura"],
    cobertura: {
      consultas: true,
      urgencia: true,
      odonto: true,
      rede: "Rede odontológica credenciada",
    },
    coberturas: [
      "Emergência 24h",
      "Urgências 24h",
      "Consultas",
      "Radiografias",
      "Odontopediatria",
      "Periodontia",
      "Cirurgias",
      "Endodontia",
      "Ortodontia",
    ],
    condicaoSeesp:
      "Condição especial para associados SEESP, com consultoria Elih Seguros. Plano Odontológico Master I.",
    flyerImg: "https://res.cloudinary.com/dfwjwo2mz/image/upload/v1783588999/VERTICAL_DENTALPAR_qrdcqx.png",
    bannerImg: "https://res.cloudinary.com/dfwjwo2mz/image/upload/v1783589015/HORIZONTAL_DENTALPAR_miewgv.png",
    tags: ["Inclui ortodontia", "Cobertura completa"],
  },
  {
    slug: "vida-mag",
    nome: "MAG Seguro de Vida",
    operadora: "MAG Seguros",
    categoria: "vida",
    categoriaLabel: CATEGORIA_LABEL.vida,
    chamada: "Proteção para sua família.",
    resumo: "Seguro de vida MAG em parceria com o SEESP e consultoria Elih Seguros.",
    faixaPreco: "R$ 60/mês",
    precoDetalhe: "Seguro de vida MAG a partir de R$ 60,00 mensais.",
    planoLabel: "Plano Essencial 60",
    paraQuem: ["eu", "familia"],
    regioes: ["capital", "grande-sp", "litoral", "interior"],
    prioridades: ["preco", "simples"],
    destaques: [
      "Proteção para o que mais importa",
      "Tranquilidade para viver o presente",
      "Segurança para o futuro da sua família",
    ],
    cobertura: { rede: "Cobertura nacional" },
    condicaoSeesp:
      "Condição especial para associados do SEESP, com consultoria Elih Seguros. Em parceria com o Sindicato dos Enfermeiros do Estado de São Paulo (SEESP).",
    obs: "Valores referentes ao plano Essencial 60. Condições e coberturas sujeitas a análise.",
    flyerImg: "https://res.cloudinary.com/dfwjwo2mz/image/upload/v1783589002/VERTICAL_MAG_vlurvm.png",
    bannerImg: "https://res.cloudinary.com/dfwjwo2mz/image/upload/v1783589017/HORIZONTAL_MAG_klnihi.png",
    tags: ["Mais acessível", "Tranquilidade para a família"],
  },
];

export function getPlan(slug: string): Plan | undefined {
  return plans.find((p) => p.slug === slug);
}
