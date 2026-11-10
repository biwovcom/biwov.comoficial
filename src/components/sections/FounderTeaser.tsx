"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CIFRAS_KATHE } from "@/data/kathe";

export function FounderTeaser() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="card-universo group relative overflow-hidden rounded-[2rem] md:min-h-[520px]"
        >
          {/* La foto llena el bloque; su lado izquierdo oscuro sirve de fondo para el texto. */}
          <div className="relative aspect-[4/3] md:absolute md:inset-0 md:aspect-auto">
            <Image
              src="/kathe-fundadora.png"
              alt="Katherine Usma Aristizábal, fundadora de biwov_"
              fill
              quality={90}
              sizes="(max-width: 1280px) 100vw, 1250px"
              className="object-cover object-[72%_center] transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03] md:object-[right_center]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#081a2b] via-transparent to-transparent md:bg-gradient-to-r md:from-[#03101b] md:via-[#03101b]/70 md:to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col justify-center px-6 pb-10 pt-2 md:min-h-[520px] md:max-w-[52%] md:px-14 md:py-14">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent md:text-sm">
              Quién está detrás de biwov
            </span>
            <h2 className="mt-4 text-4xl font-medium leading-[1.04] text-white md:text-5xl">
              Katherine Usma Aristizábal
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/65 md:text-lg">
              Administradora de Negocios Internacionales y fundadora de biwov_. Con nuestro equipo
              ordenamos tu negocio digital para que crezca con claridad.
            </p>

            <dl className="mt-8 grid max-w-lg grid-cols-3 gap-3">
              {CIFRAS_KATHE.map((cifra, i) => (
                <motion.div
                  key={cifra.valor}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.12 }}
                  className="rounded-2xl border border-white/10 bg-[#03101b]/55 p-3 backdrop-blur-md transition-colors duration-300 hover:border-accent/50"
                >
                  <dt className="text-2xl font-semibold tracking-tight text-white md:text-3xl">{cifra.valor}</dt>
                  <dd className="mt-1 text-[11px] leading-snug text-white/55 md:text-xs">{cifra.etiqueta}</dd>
                </motion.div>
              ))}
            </dl>

            <Link
              href="/kathe"
              className="mt-9 inline-flex items-center gap-2 self-start rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#03101b] transition-transform duration-300 hover:scale-[1.03] md:text-base"
            >
              Conoce mi historia
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
