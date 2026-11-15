"use client";

import { PORTAL_CLIENTES } from "@/data/hotmart";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LogoMark } from "@/components/layout/LogoMark";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { WHATSAPP_BIWOV } from "@/lib/contacto";
import { cn } from "@/lib/utils";

/** Enlace de WhatsApp de biwov con un mensaje escrito. */
export const waBiwov = (mensaje: string) =>
  `https://wa.me/${WHATSAPP_BIWOV.replace(/\D/g, "")}?text=${encodeURIComponent(mensaje)}`;

const LINKS = [
  { href: "/planes", label: "Planes" },
  { href: "/agencia-ia", label: "Agencia de agentes IA" },
  { href: "/blog", label: "Blog" },
  { href: "/kathe", label: "Fundadora" },
];

/** Encabezado claro (fondo blanco) para las páginas de clientes: /planes y /agencia-ia. */
export function HeaderClaro({ cta = "Hablemos", mensaje = "Hola, quiero conocer los planes de biwov." }: { cta?: string; mensaje?: string }) {
  const [scroll, setScroll] = useState(false);
  useEffect(() => {
    const on = () => setScroll(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scroll ? "border-[#0a2642]/10 bg-white/85 backdrop-blur-xl" : "border-transparent bg-white",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 font-logo text-2xl font-bold text-[#0a2642]">
          <LogoMark className="h-7 w-7 text-[#00c2e8]" />
          biwov_
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-semibold text-[#0a2642]/70 transition-colors hover:text-[#0a2642]">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
        <a
          href={PORTAL_CLIENTES}
          className="hidden rounded-full border border-[#0a2642]/15 px-4 py-2.5 text-sm font-semibold text-[#0a2642] transition-colors hover:border-[#00c2e8] sm:inline-flex"
        >
          Iniciar sesión
        </a>
        <a
          href={waBiwov(mensaje)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#0a2642] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0a2642]/20 transition-transform hover:-translate-y-0.5"
        >
          <WhatsAppIcon className="h-4 w-4" />
          {cta}
        </a>
        </div>
      </div>
    </header>
  );
}

export function FooterClaro() {
  return (
    <footer className="border-t border-[#0a2642]/10 bg-[#f6f9fc]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <Link href="/" className="flex items-center gap-2 font-logo text-xl font-bold text-[#0a2642]">
            <LogoMark className="h-6 w-6 text-[#00c2e8]" />
            biwov_
          </Link>
          <p className="mt-2 max-w-sm text-sm text-[#0a2642]/60">
            Agencia de ecosistemas digitales con agentes de IA. La IA trabaja; nuestro equipo supervisa.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-[#0a2642]/70">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-[#0a2642]">
              {l.label}
            </Link>
          ))}
          <Link href="/politica-datos" className="hover:text-[#0a2642]">
            Política de datos
          </Link>
        </div>
        <p className="text-xs text-[#0a2642]/50">© {new Date().getFullYear()} biwov · Manizales, Colombia</p>
      </div>
    </footer>
  );
}
