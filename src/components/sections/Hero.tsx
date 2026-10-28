"use client";

import { motion } from "framer-motion";
import { TrendingUp, Globe, Workflow, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useQuoter } from "@/components/quoter/QuoterProvider";

const PILARES = [
  { Icon: TrendingUp, titulo: "Estrategia digital con propósito" },
  { Icon: Globe, titulo: "Webs y tiendas que venden" },
  { Icon: Workflow, titulo: "Automatizaciones con IA" },
  { Icon: Users, titulo: "Acompañamiento real" },
];

/** Panel geométrico de marca: el anillo y el triángulo del ícono de biwov,
 * en abstracto, como acento visual en vez de una foto que no tenemos. */
function BrandPanel() {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0a2642] via-[#15385a] to-[#2e5b7e] shadow-[0_30px_80px_-24px_rgba(10,38,66,0.45)] sm:rounded-[2.5rem]">
      <svg
        viewBox="0 0 400 300"
        className="absolute inset-0 h-full w-full"
        aria-hidden
        preserveAspectRatio="xMidYMid slice"
      >
        <circle cx="300" cy="90" r="90" fill="none" stroke="#00c2e8" strokeWidth="2" strokeOpacity="0.5" strokeDasharray="420 100" />
        <polygon points="150,230 230,230 190,160" fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="1.5" />
        <line x1="0" y1="260" x2="400" y2="180" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1" />
        <line x1="0" y1="300" x2="400" y2="230" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1" />
        {Array.from({ length: 6 }).map((_, row) =>
          Array.from({ length: 8 }).map((__, col) => (
            <circle
              key={`${row}-${col}`}
              cx={30 + col * 24}
              cy={210 + row * 16}
              r="1.3"
              fill="#ffffff"
              fillOpacity="0.08"
            />
          )),
        )}
      </svg>
    </div>
  );
}

export function Hero() {
  const { open } = useQuoter();

  return (
    <section className="relative overflow-hidden bg-bg-light pt-28 pb-16 md:pt-32 md:pb-24">
      <Container className="relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="mb-5 block text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Transformación digital, no marketing tradicional
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-text-on-light sm:text-5xl lg:text-6xl">
              Desde que te ven hasta que pagan.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-text-on-light-secondary md:text-lg">
              Te damos la estrategia, las guías y la publicidad para que tu
              negocio atraiga clientes con orden, sin que tengas que estar en
              todo.
            </p>
            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row">
              <Button size="lg" onClick={() => open()}>
                Haz tu diagnóstico gratis
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() =>
                  document.getElementById("planes")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Ver los planes
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          >
            <BrandPanel />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.25 }}
          className="mt-20 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-border-light pt-10 sm:grid-cols-4"
        >
          {PILARES.map(({ Icon, titulo }) => (
            <div key={titulo} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border-light text-bg-base">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              <span className="text-sm font-medium leading-snug text-text-on-light">
                {titulo}
              </span>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
