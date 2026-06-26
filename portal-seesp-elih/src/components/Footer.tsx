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
    <footer className="relative bg-obsidian border-t border-platinum/10 pb-28 pt-12 lg:pb-12">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="https://res.cloudinary.com/dfwjwo2mz/image/upload/v1782452435/Design_sem_nome_fqoiow.png"
              alt="SEESP"
              className="h-[16px] w-auto object-contain"
            />
            <span className="text-platinum/30 text-lg leading-none">×</span>
            <img src="/logos/elih-logo.png" alt="Elih Seguros" className="h-6 w-auto object-contain" />
          </div>
          <a
            href={buildWhatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-platinum/70 hover:text-pristine transition-colors"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
            {formatPhone(WHATSAPP_NUMBER)}
          </a>
        </div>

        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-platinum/40">
          Portal de Benefícios SEESP × Elih Seguros. Valores e coberturas exibidos têm caráter
          informativo e estão sujeitos à análise de perfil, disponibilidade de rede e condições das
          operadoras. A Elih Seguros atua como consultoria de benefícios com isenção analítica.
        </p>

        <p className="mt-6 text-xs text-platinum/35">
          © {new Date().getFullYear()} Elih Seguros · Parceria SEESP. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
