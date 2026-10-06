import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { linkWhatsApp } from "@/lib/panel/whatsapp";
import {
  WHATSAPP_BIWOV,
  MENSAJE_WHATSAPP_BIWOV,
  INSTAGRAM_BIWOV,
  INSTAGRAM_KATHE,
} from "@/lib/contacto";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border-glass pt-12 pb-24 sm:pb-12">
      <Container className="flex flex-col items-center justify-between gap-6 text-center text-sm text-text-secondary md:flex-row md:text-left">
        <div className="flex items-center gap-2">
          <span className="font-logo text-lg font-bold text-white">biwov</span>
          <span>Todo tu negocio conectado</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <Link href="/contrato" className="hover:text-white">
            Términos y condiciones
          </Link>
          <Link href="/politica-datos" className="hover:text-white">
            Política de datos
          </Link>
          <a
            href={linkWhatsApp(WHATSAPP_BIWOV, MENSAJE_WHATSAPP_BIWOV)}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            WhatsApp
          </a>
          <a
            href={INSTAGRAM_BIWOV}
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram de biwov"
            className="flex items-center gap-1.5 hover:text-white"
          >
            <InstagramIcon className="h-4 w-4" />
            Instagram
          </a>
          <a
            href={INSTAGRAM_KATHE}
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram de Katherine"
            className="flex items-center gap-1.5 hover:text-white"
          >
            <InstagramIcon className="h-4 w-4" />
            Kathe
          </a>
        </div>
        <p>© {new Date().getFullYear()} biwov. Todos los derechos reservados.</p>
      </Container>
    </footer>
  );
}
