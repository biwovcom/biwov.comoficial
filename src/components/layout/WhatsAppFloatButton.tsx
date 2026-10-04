import { linkWhatsApp } from "@/lib/panel/whatsapp";
import { WHATSAPP_BIWOV, MENSAJE_WHATSAPP_BIWOV } from "@/lib/contacto";

export function WhatsAppFloatButton() {
  return (
    <a
      href={linkWhatsApp(WHATSAPP_BIWOV, MENSAJE_WHATSAPP_BIWOV)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 transition-transform hover:scale-110"
    >
      <svg viewBox="0 0 32 32" fill="currentColor" className="h-7 w-7">
        <path d="M16.004 3C9.374 3 4 8.374 4 15.004c0 2.52.74 4.868 2.01 6.834L4.5 28.5l6.84-1.796a11.94 11.94 0 0 0 4.664.96h.005c6.63 0 12.004-5.374 12.004-12.004C28.013 8.374 22.64 3 16.004 3Zm0 21.78h-.004a9.72 9.72 0 0 1-4.957-1.36l-.355-.21-3.69.97.985-3.598-.232-.37a9.73 9.73 0 0 1-1.49-5.208c0-5.374 4.374-9.748 9.75-9.748 2.605 0 5.052 1.015 6.893 2.858a9.676 9.676 0 0 1 2.855 6.896c0 5.374-4.375 9.748-9.754 9.748Zm5.345-7.297c-.293-.147-1.735-.857-2.004-.955-.268-.098-.464-.147-.66.147-.195.293-.757.955-.928 1.15-.17.195-.342.22-.634.073-.293-.147-1.237-.456-2.357-1.455-.872-.777-1.46-1.737-1.63-2.03-.17-.293-.018-.452.13-.6.146-.146.342-.38.513-.57.17-.195.228-.33.342-.55.11-.22.056-.405-.038-.552-.098-.147-.855-2.06-1.17-2.82-.306-.74-.618-.64-.85-.65l-.72-.013c-.244 0-.64.09-.878.33-.238.238-.908.887-.908 2.164 0 1.276.93 2.51 1.06 2.685.13.17 1.787 2.722 4.33 3.713 2.543.99 2.543.66 3.003.618.46-.04 1.49-.608 1.7-1.197.21-.587.21-1.093.146-1.197-.062-.11-.244-.172-.513-.293Z" />
      </svg>
    </a>
  );
}
