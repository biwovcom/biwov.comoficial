"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useQuoter } from "@/components/quoter/QuoterProvider";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/#planes", label: "Planes" },
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/#casos", label: "Casos de éxito" },
  { href: "/#testimonios", label: "Testimonios" },
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

  const cerrarYAgendar = () => {
    setMenuAbierto(false);
    open();
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || menuAbierto
          ? "border-b border-border-glass bg-bg-base/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-18 items-center justify-between py-4">
        <Link href="/" className="font-logo text-xl font-bold text-white">
          biwov
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-secondary transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Button size="md" variant="secondary" onClick={() => open()}>
            Diagnóstico gratis
          </Button>
          <Button size="md" onClick={() => open()}>
            Agenda una asesoría
          </Button>
        </div>
        <button
          type="button"
          onClick={() => setMenuAbierto((v) => !v)}
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          className="text-white md:hidden"
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
            className="overflow-hidden border-t border-border-glass bg-bg-base md:hidden"
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
              <Button size="md" variant="secondary" className="mt-2 w-full" onClick={cerrarYAgendar}>
                Diagnóstico gratis
              </Button>
              <Button size="md" className="mt-2 w-full" onClick={cerrarYAgendar}>
                Agenda una asesoría
              </Button>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
