"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { linkWhatsApp } from "@/lib/panel/whatsapp";
import { WHATSAPP_BIWOV } from "@/lib/contacto";
import { LINKS_PANEL } from "@/lib/panel/panelConfig";
import { DescargarPdfButton } from "./DescargarPdfButton";

export function Hero() {

  return (
    <section className="relative isolate flex flex-col overflow-hidden bg-[#03101b] pb-14 pt-[340px] sm:pt-[420px] md:min-h-[100svh] md:justify-center md:pb-20 md:pt-32">
      <div className="absolute inset-x-0 top-0 h-[400px] sm:h-[480px] md:inset-0 md:h-auto">
      <Image
        src="/kathe-banner.png"
        alt="Katherine Usma Aristizábal, fundadora de biwov_"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[68%_top] md:object-[right_center] print:hidden"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#03101b] via-[#03101b]/20 to-transparent md:bg-gradient-to-r md:from-[#03101b] md:via-[#03101b]/60 md:to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg-base to-transparent" />

      <div className="absolute right-6 top-24 z-10 print:hidden">
        <DescargarPdfButton />
      </div>

      <Container className="relative z-10 !max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-[56rem]"
        >
          <span className="mb-6 block text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Katherine Usma Aristizábal · Fundadora de biwov_
          </span>
          <h1 className="text-[2.6rem] font-semibold leading-[1] tracking-[-0.045em] text-white sm:text-6xl md:text-[4rem] xl:text-[5rem]">
            Convierto ideas
            <br />
            <span className="text-accent md:whitespace-nowrap">en sistemas que venden.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-white/80 md:text-xl md:leading-relaxed">
            Implementadora de ecosistemas digitales: estrategia, contenido, campañas y
            automatizaciones con IA para que tu negocio crezca con orden.
          </p>
          <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10">
            <a
              href={linkWhatsApp(WHATSAPP_BIWOV)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-base font-semibold text-[#03101b] transition-transform duration-300 hover:scale-[1.02] md:px-9 md:py-5 md:text-lg"
            >
              <WhatsAppIcon className="h-6 w-6" />
              Escríbeme por WhatsApp
            </a>
            <a
              href={LINKS_PANEL.calendario}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-white/70 pb-1 text-base text-white transition-colors hover:border-accent hover:text-accent md:text-lg"
            >
              Agenda una asesoría
            </a>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
