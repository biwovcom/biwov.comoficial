"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { QuoterModal } from "@/components/quoter/QuoterModal";

/**
 * El panel privado (/panel) tiene su propio chrome (Sidebar) y el
 * diagnóstico público (/diagnostico) es una página autocontenida a pantalla
 * completa — ninguno de los dos debe mostrar el navbar/footer/CTA del sitio
 * público de marketing.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const sinChrome = pathname?.startsWith("/panel") || pathname?.startsWith("/diagnostico");

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
