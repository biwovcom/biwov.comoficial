"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";

export function MisionVision() {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard className="h-full p-8">
              <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                Misión
              </span>
              <p className="mt-3 text-base leading-relaxed text-text-secondary md:text-lg">
                Ayudamos a los empresarios a dejar de trabajar con
                herramientas sueltas y a unificarlas en un sistema digital
                ordenado, con pasos claros que les permitan entender cómo
                vender más y escalar su negocio.
              </p>
            </GlassCard>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GlassCard className="h-full p-8">
              <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                Visión 2031
              </span>
              <p className="mt-3 text-base leading-relaxed text-text-secondary md:text-lg">
                Ser la agencia referente en Latinoamérica en negocios
                conectados digitalmente para pequeñas y medianas empresas,
                reconocida por llevar a los negocios del desorden digital a
                sistemas que venden de forma organizada y escalable.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
