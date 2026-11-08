"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useQuoter } from "@/components/quoter/QuoterProvider";
import { LINKS_PANEL } from "@/lib/panel/panelConfig";
import { LogoMark } from "./LogoMark";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { linkWhatsApp } from "@/lib/panel/whatsapp";
import { WHATSAPP_BIWOV, MENSAJE_WHATSAPP_BIWOV } from "@/lib/contacto";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/#servicios", label: "Servicios" },
  { href: "/tienda", label: "Tienda" },
  { href: "/#casos", label: "Casos" },
  { href: "/blog", label: "Blog" },
  { href: "/kathe", label: "Fundadora" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { open } = useQuoter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cerrarYDiagnostico = () => {
    setMenuAbierto(false);
    open();
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || menuAbierto
          ? "border-b border-white/[0.06] bg-[#03101b]/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-20 items-center justify-between py-4 !max-w-7xl">
        <Link href="/" className="flex items-center gap-2 font-logo text-2xl font-bold text-white">
          <LogoMark className="h-7 w-7 text-white" />
          biwov_
        </Link>
        <nav className="hidden items-center gap-8 xl:gap-10 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium whitespace-nowrap text-white/85 transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-5 lg:flex">
          <button
            type="button"
            onClick={() => open()}
            className="text-[15px] font-medium whitespace-nowrap text-white/85 transition-colors hover:text-accent"
          >
            Diagnóstico gratis
          </button>
          <a
            href={linkWhatsApp(WHATSAPP_BIWOV, MENSAJE_WHATSAPP_BIWOV)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[15px] font-semibold text-[#03101b] transition-transform duration-300 hover:scale-[1.03]"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Hablemos
          </a>
        </div>
        <button
          type="button"
          onClick={() => setMenuAbierto((v) => !v)}
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          className="text-white lg:hidden"
        >
          {menuAbierto ? <X size={24} /> : <Menu size={24} />}
        </button>
      </Container>

      <AnimatePresence>
        {menuAbierto && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-white/[0.06] bg-[#03101b] lg:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuAbierto(false)}
                  className="rounded-xl px-3 py-3 text-base text-text-secondary transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <Button size="md" variant="secondary" className="mt-2 w-full" onClick={cerrarYDiagnostico}>
                Diagnóstico gratis
              </Button>
              <a
                href={LINKS_PANEL.calendario}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuAbierto(false)}
              >
                <Button size="md" className="mt-2 w-full">
                  Agenda una asesoría
                </Button>
              </a>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
