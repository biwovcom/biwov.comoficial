"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useQuoter } from "@/components/quoter/QuoterProvider";

export function FinalCTA() {
  const { open } = useQuoter();

  return (
    <section className="py-16 md:py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative isolate overflow-hidden rounded-[2.5rem] px-8 py-16 text-center md:px-16 md:py-24"
        >
          <Image
            src="https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=1600&q=70"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 1200px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#0a2642]/85" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,194,232,0.18),transparent_60%)]" />
          <h2 className="relative text-2xl font-semibold text-white sm:text-4xl md:text-5xl">
            ¿No sabes por dónde empezar?
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-sm text-white/80 md:text-base">
            Empecemos por entender tu negocio. Responde unas preguntas rápidas y te decimos qué
            necesita tu negocio hoy.
          </p>
          <div className="relative mt-8">
            <Button size="lg" variant="white" onClick={() => open()}>
              Haz tu diagnóstico gratis
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
