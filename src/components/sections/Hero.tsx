"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FlowAnimation } from "./FlowAnimation";
import { useQuoter } from "@/components/quoter/QuoterProvider";

export function Hero() {
  const { open } = useQuoter();

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-16">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-accent/20 blur-[140px]" />

      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="mb-6 inline-block rounded-full border border-border-glass bg-white/[0.03] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent">
            Todo conectado, para vender más
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
            Hacemos que tu negocio venda más, sin que tengas que hacerlo todo tú.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
            Conectamos tus redes, tu WhatsApp, tus ventas y la inteligencia
            artificial, para que todo funcione junto y tengas más tiempo
            libre.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" onClick={() => open()}>
              Agenda una asesoría
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() =>
                document
                  .getElementById("como-conectamos-todo")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Descubre cómo funciona
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="mt-20"
        >
          <FlowAnimation />
        </motion.div>
      </Container>
    </section>
  );
}
