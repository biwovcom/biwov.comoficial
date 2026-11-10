"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CONOCIMIENTOS_KATHE, FORMACION_KATHE, PROFESION_KATHE, type ItemFormacion } from "@/data/kathe";
import { cn } from "@/lib/utils";

/**
 * "Logos" hechos con tipografía y el color de cada marca, para que el muro se
 * vea llamativo sin depender de archivos de logos externos.
 */
const LOGO: Record<ItemFormacion["estilo"], { fondo: string; texto: string }> = {
  udemy: { fondo: "bg-[#a435f0]", texto: "font-black lowercase tracking-[-0.04em] text-white" },
  invictus: { fondo: "bg-[#0d0d0d] ring-1 ring-[#c9a24a]/60", texto: "font-serif font-semibold uppercase tracking-[0.3em] text-[#e0bb62]" },
  hotmart: { fondo: "bg-[#f04e23]", texto: "font-extrabold lowercase tracking-[-0.03em] text-white" },
  polisura: { fondo: "bg-[#0b4fa3]", texto: "font-bold uppercase tracking-[0.12em] text-white" },
  javi: { fondo: "bg-gradient-to-br from-[#1a1206] to-[#3b2a0c] ring-1 ring-[#f2c14e]/50", texto: "font-serif font-bold italic text-[#f2c14e]" },
  silicon: { fondo: "bg-gradient-to-br from-[#0f172a] to-[#1e3a8a]", texto: "font-semibold tracking-[-0.02em] text-white" },
  neutro: { fondo: "bg-white/[0.06] ring-1 ring-white/10", texto: "font-medium text-white" },
};

export function Formacion() {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <SectionHeading eyebrow="Formación y conocimientos" title="Siempre estamos aprendiendo" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="card-universo mt-12 grid gap-8 rounded-[2rem] p-8 md:grid-cols-[auto_1fr] md:items-center md:gap-12 md:p-12"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15 text-accent">
            <GraduationCap className="h-8 w-8" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Profesión</p>
            <p className="mt-2 text-2xl font-medium tracking-[-0.02em] text-white md:text-4xl">{PROFESION_KATHE}</p>
            <p className="mt-4 text-base text-white/60">Con conocimientos en:</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {CONOCIMIENTOS_KATHE.map((c) => (
                <li key={c} className="rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-white">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {FORMACION_KATHE.map((item, i) => {
            const logo = LOGO[item.estilo];
            return (
              <motion.div
                key={`${item.institucion}-${item.detalle}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: (i % 4) * 0.07 }}
                className="card-universo group flex flex-col rounded-[1.75rem] p-2.5 transition-transform duration-500 hover:-translate-y-1"
              >
                <div
                  className={cn(
                    "flex h-28 items-center justify-center rounded-[1.25rem] px-4 text-center transition-transform duration-500 group-hover:scale-[1.02] md:h-32",
                    logo.fondo,
                  )}
                >
                  <span className={cn("text-2xl leading-tight md:text-[1.7rem]", logo.texto)}>{item.institucion}</span>
                </div>
                <div className="px-3 pb-3 pt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">{item.tipo}</p>
                  <p className="mt-1.5 text-base font-medium leading-snug text-white">{item.detalle}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
