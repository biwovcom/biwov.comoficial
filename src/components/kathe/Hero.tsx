"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { linkWhatsApp } from "@/lib/panel/whatsapp";
import { WHATSAPP_BIWOV } from "@/lib/contacto";
import { LINKS_PANEL } from "@/lib/panel/panelConfig";
import { DescargarPdfButton } from "./DescargarPdfButton";

export function Hero() {

  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-[#0b0f14] pt-28 pb-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,rgba(50,153,204,0.16),transparent_60%),radial-gradient(ellipse_60%_50%_at_90%_100%,rgba(13,59,102,0.35),transparent_65%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-accent/15 blur-[140px]" />

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
            Katherine Usma Aristizábal · Fundadora de biwov_
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
            Ayudamos a impulsar tu negocio
          </h1>
          <p className="mt-3 text-base font-medium text-white/80 md:text-lg">
            Implementadora de Ecosistemas Digitales
          </p>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-text-secondary md:mx-0 md:text-lg">
            &ldquo;Convierto ideas en sistemas que funcionan.&rdquo;
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
            <a href={LINKS_PANEL.calendario} target="_blank" rel="noopener noreferrer">
              <Button size="lg">Agenda una asesoría</Button>
            </a>
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
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 60% 70% at 35% 45%, rgba(15,18,24,0.6), transparent 70%)",
            }}
          />
          <Image
            src="/kathe.png"
            alt="Katherine Usma Aristizábal, fundadora de biwov_"
            fill
            priority
            sizes="(max-width: 1024px) 90vw, 50vw"
            className="object-cover object-[20%_50%]"
            style={{
              maskImage:
                "radial-gradient(ellipse 48% 62% at 35% 45%, black 45%, transparent 90%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 48% 62% at 35% 45%, black 45%, transparent 90%)",
            }}
          />
        </motion.div>
      </Container>
    </section>
  );
}
