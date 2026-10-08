"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppFloatButton } from "./WhatsAppFloatButton";
import { SupportFloatButton } from "./SupportFloatButton";
import { QuoterModal } from "@/components/quoter/QuoterModal";
import { useQuoter } from "@/components/quoter/QuoterProvider";

/**
 * El panel privado (/panel) tiene su propio chrome (Sidebar); el
 * diagnóstico público (/diagnostico) y la cotización para el cliente
 * (/cotizacion) son páginas autocontenidas a pantalla completa — ninguno debe
 * mostrar el navbar/footer/CTA del sitio público de marketing.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { open } = useQuoter();
  const sinChrome =
    pathname?.startsWith("/panel") ||
    pathname?.startsWith("/diagnostico") ||
    pathname?.startsWith("/cotizacion");

  // Permite compartir un link directo (ej: biwov.com/?diagnostico=1) que
  // abre de una vez el formulario del diagnóstico gratis, sin que el
  // prospecto tenga que encontrar el botón. "agenda" se mantiene por
  // compatibilidad con links que ya se hayan compartido antes.
  useEffect(() => {
    if (sinChrome) return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("diagnostico") || params.has("agenda")) {
      open();
    }
  }, [sinChrome, open]);

  if (sinChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <QuoterModal />
      <WhatsAppFloatButton />
      <SupportFloatButton />
    </>
  );
}
