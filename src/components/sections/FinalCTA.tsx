"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useQuoter } from "@/components/quoter/QuoterProvider";

export function FinalCTA() {
  const { open } = useQuoter();

  return (
    <section className="py-24 md:py-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-brand px-8 py-16 text-center md:px-16 md:py-24"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_60%)]" />
          <h2 className="relative text-2xl font-semibold text-white sm:text-4xl md:text-5xl">
            ¿Listo para vender más?
          </h2>
          <div className="relative mt-8">
            <Button
              size="lg"
              variant="secondary"
              className="border-white/30 bg-white/10 hover:bg-white/20"
              onClick={() => open()}
            >
              Agenda una asesoría estratégica
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
