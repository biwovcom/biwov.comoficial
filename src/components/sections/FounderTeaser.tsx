"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { CIFRAS_KATHE } from "@/data/kathe";

export function FounderTeaser() {
  return (
    <section className="py-16 md:py-24">
      <Container className="!max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="card-universo group overflow-hidden rounded-[2rem] p-3 md:p-4"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] sm:aspect-[1870/841]">
            <Image
              src="/kathe-fundadora.png"
              alt="Katherine Usma Aristizábal, fundadora de biwov_"
              fill
              quality={90}
              sizes="(max-width: 1280px) 100vw, 1250px"
              className="object-cover object-[72%_center] transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </div>

          <div className="grid gap-8 px-4 py-10 md:grid-cols-[1fr_1.1fr] md:items-end md:gap-14 md:px-10 md:py-12">
            <div>
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent md:text-sm">
              Quién está detrás de biwov
            </span>
            <h2 className="mt-4 text-4xl font-medium leading-[1.05] text-white md:text-5xl">
              Katherine Usma Aristizábal
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/60 md:text-lg">
              Fundadora de biwov_. Ordenamos tu negocio digital para que escale con claridad.
            </p>
            </div>

            <div>
            <dl className="grid grid-cols-3 gap-4">
              {CIFRAS_KATHE.map((cifra) => (
                <div key={cifra.valor}>
                  <dt className="text-2xl font-semibold tracking-tight text-white md:text-3xl">{cifra.valor}</dt>
                  <dd className="mt-1 text-xs leading-snug text-white/50 md:text-sm">{cifra.etiqueta}</dd>
                </div>
              ))}
            </dl>

            <Link
              href="/kathe"
              className="mt-8 inline-block border-b border-white/70 pb-1 text-base text-white transition-colors hover:border-accent hover:text-accent md:text-lg"
            >
              Conoce mi historia
            </Link>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
