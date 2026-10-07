"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Historia() {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <SectionHeading eyebrow="Mi historia" title="De redes sociales a ecosistemas completos" />
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-8 max-w-2xl text-center text-base leading-relaxed text-text-secondary md:text-lg"
        >
          Empecé manejando redes sociales para una mueblería en Manizales.
          Hoy diseño ecosistemas donde marketing, ventas y automatización
          trabajan como uno solo — con el orden y la planeación que me
          apasionan.
        </motion.p>
      </Container>
    </section>
  );
}
