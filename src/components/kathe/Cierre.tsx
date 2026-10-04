"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useQuoter } from "@/components/quoter/QuoterProvider";
import { linkWhatsApp } from "@/lib/panel/whatsapp";
import { WHATSAPP_BIWOV, INSTAGRAM_KATHE } from "@/lib/contacto";

export function Cierre() {
  const { open } = useQuoter();

  return (
    <section className="py-16 md:py-20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-brand px-8 py-16 text-center md:px-16 md:py-24"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_60%)]" />
          <p className="relative mx-auto max-w-xl text-lg font-medium text-white sm:text-xl">
            &ldquo;Trabajo en equipo, me encanta el orden y disfruto ver cómo
            una idea se convierte en un sistema que vende.&rdquo;
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href={linkWhatsApp(WHATSAPP_BIWOV)} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="secondary"
                className="border-white/30 bg-white/10 hover:bg-white/20"
              >
                WhatsApp
              </Button>
            </a>
            <a href={INSTAGRAM_KATHE} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="secondary"
                className="border-white/30 bg-white/10 hover:bg-white/20"
              >
                Instagram
              </Button>
            </a>
            <Button size="lg" onClick={() => open()}>
              Agenda una asesoría
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
