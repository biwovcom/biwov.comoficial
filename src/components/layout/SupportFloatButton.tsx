import { MessageCircleQuestion } from "lucide-react";
import { linkWhatsApp } from "@/lib/panel/whatsapp";
import { WHATSAPP_BIWOV, MENSAJE_WHATSAPP_SOPORTE } from "@/lib/contacto";

export function SupportFloatButton() {
  return (
    <a
      href={linkWhatsApp(WHATSAPP_BIWOV, MENSAJE_WHATSAPP_SOPORTE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hablar con soporte"
      className="bg-gradient-brand fixed left-6 z-50 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/40 transition-transform hover:scale-105"
      style={{ bottom: "max(1.5rem, calc(env(safe-area-inset-bottom) + 0.75rem))" }}
    >
      <MessageCircleQuestion className="h-5 w-5" />
      <span className="hidden sm:inline">Hablar con soporte</span>
    </a>
  );
}
