"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Globe, Workflow, Megaphone, Users, GraduationCap } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SERVICIOS_RESUMEN } from "@/data/servicios";

const ICONOS = [TrendingUp, Globe, Workflow, Megaphone, Users, GraduationCap];

export function Servicios() {
  return (
    <section id="servicios" className="bg-bg-light py-16 md:py-24">
      <Container>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Lo que hacemos
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-text-on-light sm:text-4xl">
              Nuestros servicios
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-text-on-light-secondary md:text-base">
              Diseñamos ecosistemas digitales inteligentes, adaptados a los objetivos de tu
              negocio.
            </p>
          </div>
          <Link
            href="/#planes"
            className="shrink-0 text-sm font-semibold text-bg-base underline-offset-4 hover:underline"
          >
            Ver todos los servicios →
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICIOS_RESUMEN.map((servicio, i) => {
            const Icon = ICONOS[i];
            return (
              <motion.div
                key={servicio.titulo}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="group overflow-hidden rounded-2xl border border-border-light bg-bg-light-elevated transition-shadow hover:shadow-[0_16px_40px_-20px_rgba(10,38,66,0.3)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={servicio.imagen}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a2642]/25 to-transparent" />
                </div>
                <div className="flex items-center gap-3 p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border-light text-bg-base">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  </span>
                  <h3 className="text-sm font-semibold text-text-on-light">{servicio.titulo}</h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
