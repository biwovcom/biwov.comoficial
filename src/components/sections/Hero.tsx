"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { linkWhatsApp } from "@/lib/panel/whatsapp";
import { WHATSAPP_BIWOV, MENSAJE_WHATSAPP_BIWOV } from "@/lib/contacto";

const CIFRAS = [
  { valor: "+10", etiqueta: "negocios acompañados" },
  { valor: "3 años", etiqueta: "construyendo ecosistemas digitales" },
  { valor: "~7x", etiqueta: "retorno en pauta (caso FashionLash)" },
];

export function Hero() {
  return (
    <section className="relative isolate flex flex-col overflow-hidden bg-[#03101b] pb-14 pt-[340px] sm:pt-[420px] md:min-h-[min(100svh,980px)] md:justify-center md:pb-20 md:pt-32">
      {/* Foto de Kathe a sangre: en escritorio ocupa el lado derecho; en móvil queda arriba, detrás del texto. */}
      <div className="absolute inset-x-0 top-0 h-[400px] sm:h-[480px] md:inset-0 md:h-auto">
      <Image
        src="/kathe-banner.png"
        alt="Katherine Usma Aristizábal, fundadora de biwov_"
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover object-[68%_top] md:object-[right_center]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#03101b] via-[#03101b]/20 to-transparent md:bg-gradient-to-r md:from-[#03101b] md:via-[#03101b]/60 md:to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg-deep to-transparent" />

      <Container className="relative z-10 !max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-[54rem]"
        >
          <h1 className="text-[2.6rem] font-semibold leading-[1] tracking-[-0.045em] text-white sm:text-6xl md:text-[4rem] xl:text-[5rem]">
            Tu negocio puede
            <br />
            <span className="text-accent md:whitespace-nowrap">vender más y mejor.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-xl md:leading-relaxed">
            Estrategia, contenido, campañas y automatizaciones con IA conectadas en un solo
            sistema, para que vendas más trabajando con menos esfuerzo.
          </p>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="mt-9 grid max-w-2xl grid-cols-3 gap-4 sm:gap-10"
        >
          {CIFRAS.map((c) => (
            <div key={c.etiqueta}>
              <dt className="text-2xl font-semibold tracking-tight text-white md:text-4xl">{c.valor}</dt>
              <dd className="mt-1 text-xs leading-snug text-white/70 md:text-base">{c.etiqueta}</dd>
            </div>
          ))}
        </motion.dl>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.35 }}
          className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10"
        >
          <a
            href={linkWhatsApp(WHATSAPP_BIWOV, MENSAJE_WHATSAPP_BIWOV)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-base font-semibold text-[#03101b] transition-transform duration-300 hover:scale-[1.02] md:px-9 md:py-5 md:text-lg"
          >
            <WhatsAppIcon className="h-6 w-6" />
            Quiero hablar sobre mi negocio
          </a>
          <a
            href="#servicios"
            className="border-b border-white/70 pb-1 text-base text-white transition-colors hover:border-accent hover:text-accent md:text-lg"
          >
            Conoce nuestros servicios
          </a>
        </motion.div>
        <p className="mt-5 text-sm text-white/55">Te respondemos por WhatsApp.</p>
      </Container>
    </section>
  );
}
