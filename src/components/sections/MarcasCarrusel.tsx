"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { ChatSimulacion } from "./ChatSimulacion";

interface Marca {
  nombre: string;
  /** Cómo se escribe el "logo" en la tarjeta inactiva. */
  wordmark: string;
  wordmarkClass: string;
  url: string;
  imagen?: string;
  /** En vez de una captura, muestra la simulación animada del chatbot. */
  simulacion?: boolean;
}

const MARCAS: Marca[] = [
  {
    nombre: "Fashion Lash · Nagaraku",
    wordmark: "NAGARAKU",
    wordmarkClass: "font-serif tracking-[0.3em]",
    url: "https://nagaraku.com.co/",
    imagen: "/marcas/nagaraku.webp",
  },
  {
    nombre: "Carolina Morales Academy",
    wordmark: "Carolina Morales",
    wordmarkClass: "font-serif italic",
    url: "https://carolinamoralesacademy.com",
    imagen: "/marcas/carolina-morales.webp",
  },
  {
    nombre: "AGENTIX",
    wordmark: "AGENTIX",
    wordmarkClass: "font-bold tracking-[0.18em]",
    url: "https://webinar.orlandosanchezmarketing.com",
    imagen: "/marcas/agentix.webp",
  },
  {
    nombre: "Lina Valencia Studio",
    wordmark: "lina valencia",
    wordmarkClass: "font-serif italic lowercase",
    url: "https://linavalenciastudio.com",
    imagen: "/marcas/lina-valencia.webp",
  },
  {
    nombre: "Fashion Lash · Chatbot con IA",
    wordmark: "Chatbot IA",
    wordmarkClass: "font-semibold tracking-[-0.02em]",
    url: "https://nagaraku.com.co/",
    simulacion: true,
  },
];

const INTERVALO_MS = 3800;

export function MarcasCarrusel() {
  const [activa, setActiva] = useState(0);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (pausado) return;
    // La simulación del chatbot necesita más tiempo para que se vea la conversación completa.
    const espera = MARCAS[activa].simulacion ? 13000 : INTERVALO_MS;
    const id = window.setTimeout(() => setActiva((a) => (a + 1) % MARCAS.length), espera);
    return () => window.clearTimeout(id);
  }, [pausado, activa]);

  return (
    <section id="casos" className="scroll-mt-24 py-16 md:py-24">
      <Container className="!max-w-7xl">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="block text-xs font-semibold uppercase tracking-[0.22em] text-accent md:text-sm"
        >
          Negocios que confían en nosotros
        </motion.span>
      </Container>

      {/* Escritorio: tarjetas que se expanden (la activa muestra el sitio real). */}
      <Container className="!max-w-7xl">
        <div
          onMouseLeave={() => setPausado(false)}
          className="mt-10 hidden h-[560px] gap-4 md:flex [mask-image:linear-gradient(to_right,transparent,black_3%,black_96%,transparent)]"
        >
          {MARCAS.map((m, i) => {
            const esActiva = i === activa;
            return (
              <a
                key={m.nombre}
                href={m.url}
                target={m.url.startsWith("http") ? "_blank" : undefined}
                rel={m.url.startsWith("http") ? "noopener noreferrer" : undefined}
                onMouseEnter={() => {
                  setPausado(true);
                  setActiva(i);
                }}
                onFocus={() => setActiva(i)}
                aria-label={m.simulacion ? m.nombre : `Ver el sitio de ${m.nombre}`}
                style={{ flexGrow: esActiva ? 3.2 : 1 }}
                className="group relative min-w-0 basis-0 overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-gradient-to-b from-[#0d2b45] to-[#06182a] transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              >
                {m.simulacion && (
                  <div className={cn("absolute inset-0 transition-opacity duration-700", esActiva ? "opacity-100" : "opacity-0")}>
                    <ChatSimulacion activo={esActiva} />
                  </div>
                )}
                {m.imagen && (
                  <Image
                    src={m.imagen}
                    alt={`Sitio web de ${m.nombre}`}
                    fill
                    sizes="(max-width: 1280px) 60vw, 800px"
                    className={cn(
                      "object-cover object-top transition-all duration-700",
                      esActiva ? "scale-100 opacity-100" : "scale-105 opacity-0",
                    )}
                  />
                )}

                {/* Estado inactivo: "logo" sobre azul, como en la referencia. */}
                <div
                  className={cn(
                    "absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(80%_60%_at_50%_40%,rgba(0,194,232,0.14),transparent_70%)] px-4 text-center transition-opacity duration-500",
                    esActiva && (m.imagen || m.simulacion) ? "opacity-0" : "opacity-100",
                  )}
                >
                  <span className={cn("text-2xl text-white md:text-3xl", m.wordmarkClass)}>
                    {m.wordmark}
                  </span>
                  <span className="absolute bottom-8 text-sm text-white/60">{m.nombre}</span>
                </div>

                <span
                  className={cn(
                    "absolute bottom-5 left-5 rounded-full bg-[#03101b]/75 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition-all duration-500",
                    esActiva && m.imagen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                  )}
                >
                  {m.nombre}
                </span>
              </a>
            );
          })}
        </div>
      </Container>

      {/* Móvil: carrusel deslizable con el sitio visible. */}
      <div className="scrollbar-none mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 md:hidden">
        {MARCAS.map((m) => (
          <a
            key={m.nombre}
            href={m.url}
            target={m.url.startsWith("http") ? "_blank" : undefined}
            rel={m.url.startsWith("http") ? "noopener noreferrer" : undefined}
            className="relative h-[420px] w-[78vw] shrink-0 snap-center overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-gradient-to-b from-[#0d2b45] to-[#06182a]"
          >
            {m.simulacion ? (
              <ChatSimulacion />
            ) : m.imagen ? (
              <Image src={m.imagen} alt={`Sitio web de ${m.nombre}`} fill sizes="80vw" className="object-cover object-top" />
            ) : (
              <span className={cn("absolute inset-0 flex items-center justify-center text-3xl text-white", m.wordmarkClass)}>
                {m.wordmark}
              </span>
            )}
            {!m.simulacion && (
              <span className="absolute bottom-4 left-4 rounded-full bg-[#03101b]/75 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
                {m.nombre}
              </span>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
