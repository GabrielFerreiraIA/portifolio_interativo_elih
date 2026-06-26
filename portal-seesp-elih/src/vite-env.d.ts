/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  /** Número do WhatsApp (DDI+DDD+número). Padrão: 5511988053269. */
  readonly VITE_WHATSAPP_NUMBER?: string;
  /** URL do webhook (n8n / CRM ELIH) para envio de leads. Opcional. */
  readonly VITE_LEAD_WEBHOOK_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
