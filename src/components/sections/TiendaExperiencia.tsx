"use client";

import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import { TiendaCatalogo } from "./TiendaCatalogo";
import { Container } from "@/components/ui/Container";
import { COMPLEMENTOS } from "@/data/complementos";
import { useTRM } from "@/hooks/useTRM";
import type { Moneda } from "@/lib/moneda";

// La asesoría 1 a 1 es lo único que no tiene tarjeta en el catálogo.
const ASESORIA = COMPLEMENTOS.find((c) => c.titulo === "Asesoría personalizada");

export function TiendaExperiencia() {
  const [moneda, setMoneda] = useState<Moneda>("COP");
  const { trm } = useTRM();

  return (
    <>
      <TiendaCatalogo moneda={moneda} setMoneda={setMoneda} trm={trm} />
      {ASESORIA && (
        <section className="pb-20">
          <Container>
            <div className="card-universo grid gap-10 rounded-[2.25rem] px-7 py-12 md:grid-cols-2 md:gap-16 md:px-14 md:py-16">
              <div>
                <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-accent md:text-sm">
                  Asesoría personalizada
                </span>
                <h2 className="mt-5 text-4xl font-medium leading-[1.04] text-white sm:text-5xl">
                  ¿Prefieres hacerlo tú? <span className="text-accent">Te guiamos 1 a 1.</span>
                </h2>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-white/60">{ASESORIA.detalle}</p>
                {ASESORIA.linkAgendar && (
                  <a
                    href={ASESORIA.linkAgendar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-base font-semibold text-[#03101b] transition-transform duration-300 hover:scale-[1.03]"
                  >
                    <CalendarCheck className="h-5 w-5" />
                    {ASESORIA.textoBotonAgendar ?? "Agendar"}
                  </a>
                )}
              </div>
              <div>
                <ul className="space-y-4">
                  {ASESORIA.items?.map((it) => (
                    <li key={it.label} className="flex gap-3 text-base leading-relaxed text-white/80 md:text-lg">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {it.label}
                    </li>
                  ))}
                </ul>
                {ASESORIA.nota && <p className="mt-6 text-sm text-white/50">{ASESORIA.nota}</p>}
              </div>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
