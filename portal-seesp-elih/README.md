# Portal de Benefícios SEESP × Elih Seguros

Site **mobile-first + PWA** que transforma os flyers da parceria SEESP × Elih num portal
interativo: banner de campanha → filtros inteligentes → vitrine de flyers → páginas de plano →
cotação via WhatsApp (+ webhook opcional para CRM/n8n).

Estética **Executive/Clinical** do design system oficial da Elih (obsidiana + branco clínico,
platina, vidro, borda metálica). Fontes: Inter · Space Grotesk · Playfair Display. **Sem vermelho, sem neon.**

## Rodando

```bash
npm install
npm run dev        # desenvolvimento (http://localhost:5173)
npm run build      # build de produção em /dist (gera PWA: sw.js + manifest)
npm run preview    # serve o build localmente
```

Deploy: publique a pasta `dist/` em qualquer host estático (Vercel, Netlify, GitHub Pages).
Por ser SPA, configure o host para servir `index.html` em qualquer rota (fallback).

## Trocar os flyers pelas artes novas

As imagens iniciais foram **extraídas do `ARTES SEESP.pdf`** (placeholders). Para atualizar,
basta substituir os arquivos em **`public/flyers/`** mantendo os nomes (proporção 4:5 recomendada):

| Arquivo | Plano |
|---|---|
| `01-capa.jpg` | Capa do hero |
| `02-odonto-master-i.jpg` | Odonto MasteR i |
| `03-seguro-vida.jpg` | Seguro de Vida |
| `04-saude-familia.jpg` | Plano de Saúde Família |
| `05-bluemed-viagem.jpg` | BlueMed Assistência Viagem |
| `06-saude-acessivel.jpg` | Plano de Saúde Smart |
| `07-saude-prevencao.jpg` | Plano Smart 200 SP |

Textos, preços e coberturas de cada plano ficam em **`src/data/plans.ts`** (edite à vontade).

## Configuração (`.env`)

Copie `.env.example` para `.env`:

```bash
VITE_WHATSAPP_NUMBER=5511988053269      # número de cotação (DDI+DDD+número)
VITE_LEAD_WEBHOOK_URL=                  # opcional: webhook n8n/CRM ELIH p/ receber leads
```

Sem `VITE_LEAD_WEBHOOK_URL`, a cotação funciona **só pelo WhatsApp** (mensagem pré-preenchida).
Com a URL preenchida, o formulário também faz `POST` do lead com `tag: "SEESP"`.

## Estrutura

```
src/
  data/plans.ts        ← conteúdo dos planos (fonte da verdade)
  lib/                 ← cn · whatsapp · lead · filter · motion
  components/          ← Navbar, Hero, FilterFinder, FlyerCarousel, PlanGrid,
                          WhyElih, CotacaoSection, QuoteBar, QuoteForm, Footer, ui/
  pages/               ← Home · PlanDetail (/plano/:slug)
public/flyers/         ← artes (trocáveis sem mexer no código)
public/icons/          ← ícones do PWA (gerados do logo Elih)
```

Stack: Vite + React + TypeScript + Tailwind 3 + Framer Motion + vite-plugin-pwa.
