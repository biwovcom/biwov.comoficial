"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { FAQ } from "@/data/faq";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export function Faq() {
  const [abierta, setAbierta] = useState<number | null>(null);

  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeading eyebrow="Preguntas frecuentes" title="Lo que más nos preguntan" />

        <div className="mx-auto mt-12 max-w-2xl space-y-3">
          {FAQ.map((item, i) => {
            const estaAbierta = abierta === i;
            return (
              <GlassCard key={item.pregunta} className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => setAbierta(estaAbierta ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="text-sm font-medium text-white md:text-base">
                    {item.pregunta}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-text-secondary transition-transform",
                      estaAbierta && "rotate-180",
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {estaAbierta && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <p className="px-5 pb-5 text-sm text-text-secondary">{item.respuesta}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
