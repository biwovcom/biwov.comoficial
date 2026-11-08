import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { linkWhatsApp } from "@/lib/panel/whatsapp";
import { LogoMark } from "./LogoMark";
import {
  WHATSAPP_BIWOV,
  MENSAJE_WHATSAPP_BIWOV,
  INSTAGRAM_BIWOV,
  INSTAGRAM_KATHE,
} from "@/lib/contacto";

const ECOSISTEMA = [
  { href: "/#servicios", label: "Servicios" },
  { href: "/tienda#planes", label: "Planes" },
  { href: "/tienda", label: "Tienda" },
  { href: "/#casos", label: "Casos" },
  { href: "/kathe", label: "Fundadora" },
];

export function Footer() {
  const whatsapp = linkWhatsApp(WHATSAPP_BIWOV, MENSAJE_WHATSAPP_BIWOV);
  const enlace = "text-[15px] text-white/55 transition-colors hover:text-white";

  return (
    <footer className="border-t border-white/[0.06] bg-[#020b13] pt-20 pb-28 sm:pb-14">
      <Container className="!max-w-7xl">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2 font-logo text-2xl font-bold text-white">
              <LogoMark className="h-7 w-7 text-white" />
              biwov_
            </Link>
            <p className="mt-10 max-w-md text-2xl font-medium leading-snug tracking-[-0.02em] text-white md:text-3xl">
              Ideas para que tu negocio venda más y mejor.
            </p>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/55">
              Escríbenos y te contamos qué necesita tu negocio hoy: estrategia, contenido, campañas o
              automatización.
            </p>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#03101b] transition-transform duration-300 hover:scale-[1.03]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Escríbenos por WhatsApp
            </a>
          </div>

          <div>
            <p className="text-base font-semibold text-white">Ecosistema</p>
            <ul className="mt-5 space-y-3">
              {ECOSISTEMA.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={enlace}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-base font-semibold text-white">Atención</p>
            <ul className="mt-5 space-y-3">
              <li>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={enlace}>
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={INSTAGRAM_BIWOV} target="_blank" rel="noopener noreferrer" className={enlace}>
                  Instagram biwov
                </a>
              </li>
              <li>
                <a href={INSTAGRAM_KATHE} target="_blank" rel="noopener noreferrer" className={enlace}>
                  Instagram Kathe
                </a>
              </li>
              <li>
                <Link href="/contrato" className={enlace}>
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/politica-datos" className={enlace}>
                  Política de datos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex items-center gap-2 border-t border-white/[0.06] pt-7 text-sm text-white/40">
          <span>© {new Date().getFullYear()} biwov. Todos los derechos reservados.</span>
          <Link href="/panel/login" aria-label="Acceso privado" className="opacity-30 transition-opacity hover:opacity-70">
            <LockKeyhole className="h-3 w-3" />
          </Link>
        </div>
      </Container>
    </footer>
  );
}
