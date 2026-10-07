"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { TRAYECTORIA } from "@/data/kathe";

export function Trayectoria() {
  const trackRef = useRef<HTMLDivElement>(null);

  const desplazar = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
    <section className="py-16 md:py-20">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <SectionHeading align="left" eyebrow="Trayectoria" title="Cómo he llegado hasta aquí" />
          <div className="hidden shrink-0 gap-2 md:flex">
            <button
              type="button"
              onClick={() => desplazar(-1)}
              aria-label="Anterior"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border-glass text-white transition-colors hover:bg-white/[0.06]"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => desplazar(1)}
              aria-label="Siguiente"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border-glass text-white transition-colors hover:bg-white/[0.06]"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </Container>

      <div
        ref={trackRef}
        className="scrollbar-none mt-10 flex gap-5 overflow-x-auto scroll-smooth px-6 pb-2 snap-x snap-mandatory md:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]"
      >
        {TRAYECTORIA.map((hito) => (
          <GlassCard key={hito.anio} className="w-72 shrink-0 snap-start p-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-accent">{hito.anio}</span>
            <h3 className="mt-1 text-lg font-semibold text-white">{hito.titulo}</h3>
            <p className="mt-2 text-sm text-text-secondary">{hito.detalle}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
