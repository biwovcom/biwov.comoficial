"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useQuoter } from "@/components/quoter/QuoterProvider";
import { linkWhatsApp } from "@/lib/panel/whatsapp";
import { WHATSAPP_BIWOV } from "@/lib/contacto";
import { DescargarPdfButton } from "./DescargarPdfButton";

export function Hero() {
  const { open } = useQuoter();

  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden pt-28 pb-16">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-accent/20 blur-[140px]" />

      <div className="absolute right-6 top-24 z-10 print:hidden">
        <DescargarPdfButton />
      </div>

      <Container className="relative grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="order-2 text-center lg:order-1 lg:text-left"
        >
          <span className="mb-6 inline-block rounded-full border border-border-glass bg-white/[0.03] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent">
            Fundadora de biwov_
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
            Katherine Usma
            <br />
            Aristizábal
          </h1>
          <p className="mt-3 text-base font-medium text-white/80 md:text-lg">
            Implementadora de Ecosistemas Digitales
          </p>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-text-secondary md:mx-0 md:text-lg">
            &ldquo;Convierto ideas en sistemas que funcionan.&rdquo;
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
            <Button size="lg" onClick={() => open()}>
              Agenda una asesoría
            </Button>
            <a href={linkWhatsApp(WHATSAPP_BIWOV)} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="secondary">
                Escríbeme por WhatsApp
              </Button>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative order-1 mx-auto aspect-[16/9] w-full max-w-xl lg:order-2 lg:max-w-none"
        >
          <Image
            src="/kathe.png"
            alt="Katherine Usma Aristizábal, fundadora de biwov_"
            fill
            priority
            sizes="(max-width: 1024px) 90vw, 50vw"
            className="object-cover [mask-image:radial-gradient(circle_at_30%_50%,black_42%,transparent_72%)] object-[20%_50%]"
          />
        </motion.div>
      </Container>
    </section>
  );
}
