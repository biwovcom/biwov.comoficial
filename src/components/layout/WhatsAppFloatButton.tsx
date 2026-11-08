import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { linkWhatsApp } from "@/lib/panel/whatsapp";
import { WHATSAPP_BIWOV, MENSAJE_WHATSAPP_BIWOV } from "@/lib/contacto";

export function WhatsAppFloatButton() {
  return (
    <a
      href={linkWhatsApp(WHATSAPP_BIWOV, MENSAJE_WHATSAPP_BIWOV)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 transition-transform hover:scale-110"
      style={{ bottom: "max(1.5rem, calc(env(safe-area-inset-bottom) + 0.75rem))" }}
    >
<WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
