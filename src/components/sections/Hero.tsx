"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { TrendingUp, Globe, Workflow, Megaphone, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useQuoter } from "@/components/quoter/QuoterProvider";

const PILARES = [
  { Icon: TrendingUp, titulo: "Estrategia digital" },
  { Icon: Globe, titulo: "Web y tiendas" },
  { Icon: Workflow, titulo: "Automatizaciones con IA" },
  { Icon: Megaphone, titulo: "Campañas que convierten" },
  { Icon: Users, titulo: "Acompañamiento real" },
];

export function Hero() {
  const { open } = useQuoter();

  return (
    <section className="relative isolate flex min-h-[640px] flex-col justify-end overflow-hidden pt-36 pb-10 md:min-h-[760px] md:pt-44 md:pb-14">
      <Image
        src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1920&q=75"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a2642] via-[#0a2642]/85 to-[#0a2642]/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a2642] via-transparent to-[#0a2642]/30" />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-xl"
        >
          <span className="mb-5 block text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Transformación digital, no marketing tradicional
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]">
            Tu negocio merece un sistema.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/75 md:text-lg">
            Estrategia, tecnología y acompañamiento para que vendas más y
            trabajes con menos esfuerzo.
          </p>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row">
            <Button size="lg" variant="white" onClick={() => open()}>
              Hablemos
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() =>
                document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Conoce nuestros servicios
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="mt-16 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/15 pt-6 md:mt-20"
        >
          {PILARES.map(({ Icon, titulo }) => (
            <div key={titulo} className="flex items-center gap-2">
              <Icon className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
              <span className="text-xs font-medium text-white/80 sm:text-sm">{titulo}</span>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
