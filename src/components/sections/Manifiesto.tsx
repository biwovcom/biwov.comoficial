"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";

const PIEZAS = [
  { clave: "Estrategia", resto: "que convierte ideas en un plan claro." },
  { clave: "Contenido", resto: "que hace que te recuerden y te elijan." },
  { clave: "Campañas", resto: "que traen a la gente correcta." },
  { clave: "Automatizaciones con IA", resto: "que atienden y hacen seguimiento por ti." },
];

export function Manifiesto() {
  return (
    <section className="py-24 md:py-36">
      <Container className="!max-w-7xl grid gap-14 md:grid-cols-2 md:gap-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl font-medium leading-[1.03] text-white sm:text-5xl md:text-6xl lg:text-[4.25rem]"
        >
          Un negocio crece cuando todo se conecta.
        </motion.h2>

        <div className="space-y-5 md:pt-3">
          {PIEZAS.map((p, i) => (
            <motion.p
              key={p.clave}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
              className="text-xl leading-snug tracking-[-0.02em] text-white/45 md:text-[1.7rem]"
            >
              <span className="text-accent">{p.clave}</span> {p.resto}
            </motion.p>
          ))}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: PIEZAS.length * 0.12 + 0.1 }}
            className="pt-5 text-xl tracking-[-0.02em] text-white md:text-[1.7rem]"
          >
            Cuatro piezas. <span className="text-accent">Un solo sistema.</span>
          </motion.p>
        </div>
      </Container>
    </section>
  );
}
