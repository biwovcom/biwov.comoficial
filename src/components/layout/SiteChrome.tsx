"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { QuoterModal } from "@/components/quoter/QuoterModal";

/**
 * El panel privado (/panel) tiene su propio chrome (Sidebar); el
 * diagnóstico público (/diagnostico) y la cotización para el cliente
 * (/cotizacion) son páginas autocontenidas a pantalla completa — ninguno debe
 * mostrar el navbar/footer/CTA del sitio público de marketing.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const sinChrome =
    pathname?.startsWith("/panel") ||
    pathname?.startsWith("/diagnostico") ||
    pathname?.startsWith("/cotizacion");

  if (sinChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <QuoterModal />
    </>
  );
}
