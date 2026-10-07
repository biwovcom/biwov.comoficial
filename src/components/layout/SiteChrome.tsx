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

  // Permite compartir un link directo (ej: biwov.com/?agenda=1) que abre
  // de una vez el formulario "Agenda una asesoría", sin que el prospecto
  // tenga que encontrar el botón.
  useEffect(() => {
    if (sinChrome) return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("agenda")) {
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
