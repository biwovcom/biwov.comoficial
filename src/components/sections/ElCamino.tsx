"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Marquee } from "@/components/ui/Marquee";
import { EL_CAMINO, PASOS_CAMINO_TITULO, ETIQUETAS_CAMINO } from "@/data/elCamino";

export function ElCamino() {
  return (
    <section id="como-conectamos-todo" className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="El camino"
          title="Desde que alguien te ve hasta que te paga"
          description="Así de simple es lo que organizamos contigo."
        />
      </Container>

      <div className="mt-14 scrollbar-none flex gap-4 overflow-x-auto px-6 pb-2 scroll-smooth snap-x snap-mandatory [mask-image:linear-gradient(to_right,black,black_90%,transparent)] md:justify-center md:px-0">
        {EL_CAMINO.map((paso) => {
          const i = paso.numero - 1;
          return (
            <div key={paso.numero} className="shrink-0 snap-start">
              <GlassCard className="h-full w-72 p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-sm font-semibold text-white">
                    {paso.numero}
                  </span>
                  <h3 className="text-base font-semibold text-white">{PASOS_CAMINO_TITULO[i]}</h3>
                </div>
                <p className="mt-3 text-sm text-text-secondary">{paso.pasa}</p>
                <p className="mt-3 text-xs font-medium text-accent">{paso.posible}</p>
              </GlassCard>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <Marquee
          items={ETIQUETAS_CAMINO}
          keyFn={(etiqueta) => etiqueta}
          reverse
          durationSeconds={24}
          renderItem={(etiqueta) => (
            <span className="rounded-full border border-border-glass bg-white/[0.03] px-3 py-1.5 text-xs text-text-secondary">
              {etiqueta}
            </span>
          )}
        />
      </div>
    </section>
  );
}
