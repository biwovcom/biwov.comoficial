"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { linkWhatsApp } from "@/lib/panel/whatsapp";
import { WHATSAPP_BIWOV, INSTAGRAM_KATHE } from "@/lib/contacto";
import { LINKS_PANEL } from "@/lib/panel/panelConfig";

export function Cierre() {
  return (
    <section className="py-20 md:py-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="card-universo grid items-center gap-10 rounded-[2.25rem] px-7 py-14 md:grid-cols-2 md:gap-16 md:px-16 md:py-24"
        >
          <p className="text-3xl font-medium leading-[1.12] tracking-[-0.03em] text-white sm:text-4xl md:text-[2.8rem]">
            &ldquo;Trabajamos en equipo, nos encanta el orden y disfrutamos ver cómo una idea se convierte en{" "}
            <span className="text-accent">un sistema que vende.</span>&rdquo;
          </p>
          <div>
            <p className="text-lg leading-relaxed text-white/60 md:text-xl">
              Si quieres ordenar tu negocio digital, escríbenos o agenda una asesoría y lo
              miramos juntos.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
              <a
                href={linkWhatsApp(WHATSAPP_BIWOV)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-semibold text-[#03101b] transition-transform duration-300 hover:scale-[1.03] md:text-lg"
              >
                <WhatsAppIcon className="h-6 w-6" />
                Escríbenos
              </a>
              <a
                href={LINKS_PANEL.calendario}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-white/70 pb-1 text-base text-white transition-colors hover:border-accent hover:text-accent md:text-lg"
              >
                Agenda una asesoría
              </a>
              <a
                href={INSTAGRAM_KATHE}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-white/70 pb-1 text-base text-white transition-colors hover:border-accent hover:text-accent md:text-lg"
              >
                Instagram
              </a>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
