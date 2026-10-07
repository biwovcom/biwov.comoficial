"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Camera,
  MessageCircle,
  Sheet,
  Globe,
  Users,
  Megaphone,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const HERRAMIENTAS_SUELTAS = [
  { label: "Instagram", Icon: Camera },
  { label: "WhatsApp", Icon: MessageCircle },
  { label: "Excel", Icon: Sheet },
  { label: "Página web", Icon: Globe },
  { label: "CRM", Icon: Users },
  { label: "Publicidad", Icon: Megaphone },
];

export function Problem() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="El problema"
          title="Publicas y pautas, pero no vendes."
          description="Casi nunca es falta de esfuerzo. Es que cada parte funciona por su lado: el contenido no tiene un objetivo, la publicidad no llega a la gente correcta y los interesados se pierden en el WhatsApp. Cuando todo se conecta, el esfuerzo empieza a dar resultados."
        />

        <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
          {HERRAMIENTAS_SUELTAS.map((h, i) => (
            <motion.div
              key={h.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <GlassCard className="flex items-center gap-2 px-5 py-3 opacity-70">
                <span className="text-red-400/80">✕</span>
                <h.Icon className="h-4 w-4 text-text-secondary" />
                <span className="text-sm text-text-secondary">{h.label}</span>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="my-10 flex justify-center">
          <ArrowRight className="h-8 w-8 rotate-90 text-accent" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-xl"
        >
          <GlassCard className="glow flex items-center gap-3 border-accent/40 bg-accent/10 px-6 py-5 text-center">
            <Sparkles className="h-5 w-5 shrink-0 text-accent" />
            <p className="text-sm font-medium text-white md:text-base">
              biwov conecta todo para que tu negocio funcione solo.
            </p>
          </GlassCard>
        </motion.div>
      </Container>
    </section>
  );
}
