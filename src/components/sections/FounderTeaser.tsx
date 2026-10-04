"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CIFRAS_KATHE } from "@/data/kathe";

export function FounderTeaser() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid items-center gap-10 md:grid-cols-[auto_1fr]"
        >
          <div className="relative mx-auto aspect-square w-40 shrink-0 overflow-hidden rounded-full border border-accent/30 md:w-48">
            <Image
              src="/kathe.png"
              alt="Katherine Usma Aristizábal, fundadora de biwov_"
              fill
              sizes="200px"
              className="object-cover object-[15%_35%]"
            />
          </div>

          <div className="text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-wide text-accent">
              Quién está detrás de biwov
            </span>
            <h3 className="mt-2 text-xl font-semibold text-white md:text-2xl">
              Katherine Usma Aristizábal · Fundadora de biwov_
            </h3>
            <p className="mt-2 max-w-xl text-sm text-text-secondary md:text-base">
              Ordenamos tu negocio digital para que escale con claridad.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-6 md:justify-start">
              {CIFRAS_KATHE.map((cifra) => (
                <div key={cifra.valor}>
                  <p className="text-xl font-semibold text-accent">{cifra.valor}</p>
                </div>
              ))}
            </div>

            <Link href="/kathe" className="mt-6 inline-block">
              <Button variant="secondary">Conoce mi historia</Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
