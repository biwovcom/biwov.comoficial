import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";
import { cargarCotizacionPublica } from "@/lib/panel/cotizacionPublica";
import { CotizacionCliente } from "./CotizacionCliente";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Propuesta — biwov_",
  robots: { index: false, follow: false },
};

export default async function CotizacionPublicaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseClient();
  if (!supabase) notFound();

  const cotizacion = await cargarCotizacionPublica(supabase, id);
  if (!cotizacion) notFound();

  return (
    <div className="flex min-h-screen justify-center bg-bg-base px-4 py-16">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <p className="text-2xl font-semibold text-white">
            biwov<span className="text-accent">_</span>
          </p>
          <p className="mt-1 text-sm text-text-secondary">Propuesta comercial</p>
        </div>
        <CotizacionCliente cotizacion={cotizacion} />
      </div>
    </div>
  );
}
