import { MessageCircle } from "lucide-react";
import { buildWhatsappLink, WHATSAPP_NUMBER } from "../lib/whatsapp";

function formatPhone(n: string) {
  // 5511988053269 -> (11) 98805-3269
  const d = n.replace(/\D/g, "").slice(-11);
  if (d.length < 11) return n;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function Footer() {
  return (
    <footer className="relative bg-navy-950 border-t border-white/10 pb-28 pt-12 lg:pb-12 font-sans">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="https://res.cloudinary.com/dfwjwo2mz/image/upload/v1783580844/Logo_Seesp_ukt5nc.png"
              alt="SEESP"
              className="h-[16px] w-auto object-contain"
            />
            <span className="text-white/25 text-lg leading-none">×</span>
            <img src="/logos/elih-seguros-wordmark-navy.png" alt="Elih Seguros" className="h-6 w-auto object-contain brightness-0 invert" />
          </div>
          <a
            href={buildWhatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
            {formatPhone(WHATSAPP_NUMBER)}
          </a>
        </div>

        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-white/40">
          Portal de Benefícios SEESP × Elih Seguros. Valores e coberturas exibidos têm caráter
          informativo e estão sujeitos à análise de perfil, disponibilidade de rede e condições das
          operadoras. A Elih Seguros atua como consultoria de benefícios com isenção analítica.
        </p>

        <p className="mt-6 text-xs text-white/30">
          © {new Date().getFullYear()} Elih Seguros · Parceria SEESP. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
