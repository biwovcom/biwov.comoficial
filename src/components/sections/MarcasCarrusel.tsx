"use client";

import { useEffect, useState, type ComponentType } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { ChatSimulacion } from "./ChatSimulacion";
import { SimulacionCampana, SimulacionEmail, SimulacionGHL, SimulacionMasivos } from "./SimulacionesSistema";

type TipoSimulacion = "chat" | "campana" | "ghl" | "masivos" | "email";

const SIMULACIONES: Record<TipoSimulacion, ComponentType<{ activo?: boolean }>> = {
  chat: ChatSimulacion,
  campana: SimulacionCampana,
  ghl: SimulacionGHL,
  masivos: SimulacionMasivos,
  email: SimulacionEmail,
};

/** Cuánto se queda el carrusel en cada simulación para que se vea completa. */
const DURACION_SIMULACION: Record<TipoSimulacion, number> = {
  chat: 13000,
  campana: 9000,
  ghl: 9000,
  masivos: 8000,
  email: 8000,
};

interface Marca {
  nombre: string;
  /** Texto que se ve en la tarjeta cerrada. */
  etiqueta: string;
  etiquetaClass: string;
  url: string;
  imagen?: string;
  simulacion?: TipoSimulacion;
}

const MARCAS: Marca[] = [
  {
    nombre: "Fashion Lash · Nagaraku",
    etiqueta: "NAGARAKU",
    etiquetaClass: "font-serif tracking-[0.25em]",
    url: "https://nagaraku.com.co/",
    imagen: "/marcas/nagaraku.webp",
  },
  {
    nombre: "Fashion Lash · Campañas en Meta",
    etiqueta: "Campañas · 7x",
    etiquetaClass: "font-semibold",
    url: "https://nagaraku.com.co/",
    simulacion: "campana",
  },
  {
    nombre: "Carolina Morales Academy",
    etiqueta: "Carolina Morales",
    etiquetaClass: "font-serif italic",
    url: "https://carolinamoralesacademy.com",
    imagen: "/marcas/carolina-morales.webp",
  },
  {
    nombre: "CRM en GoHighLevel",
    etiqueta: "GoHighLevel",
    etiquetaClass: "font-semibold",
    url: "/#servicios",
    simulacion: "ghl",
  },
  {
    nombre: "AGENTIX",
    etiqueta: "AGENTIX",
    etiquetaClass: "font-bold tracking-[0.18em]",
    url: "https://webinar.orlandosanchezmarketing.com",
    imagen: "/marcas/agentix.webp",
  },
  {
    nombre: "Mensajes masivos por WhatsApp",
    etiqueta: "WhatsApp masivo",
    etiquetaClass: "font-semibold",
    url: "/#servicios",
    simulacion: "masivos",
  },
  {
    nombre: "Lina Valencia Studio",
    etiqueta: "lina valencia",
    etiquetaClass: "font-serif italic lowercase",
    url: "https://linavalenciastudio.com",
    imagen: "/marcas/lina-valencia.webp",
  },
  {
    nombre: "Email marketing",
    etiqueta: "Email marketing",
    etiquetaClass: "font-semibold",
    url: "/#servicios",
    simulacion: "email",
  },
  {
    nombre: "Fashion Lash · Chatbot con IA",
    etiqueta: "Chatbot IA",
    etiquetaClass: "font-semibold",
    url: "https://nagaraku.com.co/",
    simulacion: "chat",
  },
];

const INTERVALO_MS = 3800;

function abreFuera(url: string) {
  return url.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};
}

export function MarcasCarrusel() {
  const [activa, setActiva] = useState(0);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (pausado) return;
    const sim = MARCAS[activa].simulacion;
    const espera = sim ? DURACION_SIMULACION[sim] : INTERVALO_MS;
    const id = window.setTimeout(() => setActiva((a) => (a + 1) % MARCAS.length), espera);
    return () => window.clearTimeout(id);
  }, [pausado, activa]);

  return (
    <section id="casos" className="scroll-mt-24 py-16 md:py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-accent md:text-sm">
            Negocios que confían en nosotros
          </span>
          <p className="mt-3 max-w-2xl text-base text-white/55 md:text-lg">
            <span className="font-medium text-white">Proyectos reales, resultados reales.</span> Descubra cómo
            ayudamos a nuestros clientes mediante sitios web, campañas digitales, CRM, automatización de
            WhatsApp y correo electrónico, y chatbots impulsados por Inteligencia Artificial.
          </p>
        </motion.div>
      </Container>

      {/* Escritorio: tarjetas que se expanden. La activa muestra el sitio real o la simulación en movimiento. */}
      <Container>
        <div
          onMouseLeave={() => setPausado(false)}
          className="mt-10 hidden h-[580px] gap-3 md:flex [mask-image:linear-gradient(to_right,transparent,black_2%,black_97%,transparent)]"
        >
          {MARCAS.map((m, i) => {
            const esActiva = i === activa;
            const Simulacion = m.simulacion ? SIMULACIONES[m.simulacion] : null;
            return (
              <a
                key={m.nombre}
                href={m.url}
                {...abreFuera(m.url)}
                onMouseEnter={() => {
                  setPausado(true);
                  setActiva(i);
                }}
                onFocus={() => setActiva(i)}
                aria-label={m.simulacion ? m.nombre : `Ver el sitio de ${m.nombre}`}
                style={{ flexGrow: esActiva ? 6.5 : 1 }}
                className="group relative min-w-0 basis-0 overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-gradient-to-b from-[#0d2b45] to-[#06182a] transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              >
                {Simulacion && (
                  <div className={cn("absolute inset-0 transition-opacity duration-700", esActiva ? "opacity-100" : "opacity-0")}>
                    <Simulacion activo={esActiva} />
                  </div>
                )}
                {m.imagen && (
                  <Image
                    src={m.imagen}
                    alt={`Sitio web de ${m.nombre}`}
                    fill
                    sizes="(max-width: 1280px) 70vw, 900px"
                    className={cn(
                      "object-cover object-top transition-all duration-700",
                      esActiva ? "scale-100 opacity-100" : "scale-105 opacity-0",
                    )}
                  />
                )}

                {/* Tarjeta cerrada: nombre en vertical para que nunca se corte. */}
                <div
                  className={cn(
                    "absolute inset-0 flex items-center justify-center bg-[radial-gradient(80%_60%_at_50%_40%,rgba(0,194,232,0.14),transparent_70%)] transition-opacity duration-500",
                    esActiva ? "opacity-0" : "opacity-100",
                  )}
                >
                  <span
                    className={cn(
                      "rotate-180 whitespace-nowrap text-xl text-white [writing-mode:vertical-rl] lg:text-2xl",
                      m.etiquetaClass,
                    )}
                  >
                    {m.etiqueta}
                  </span>
                  {m.simulacion && (
                    <span className="absolute bottom-5 h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_rgba(0,194,232,0.9)]" />
                  )}
                </div>

                {m.imagen && (
                  <span
                    className={cn(
                      "absolute bottom-5 left-5 rounded-full bg-[#03101b]/75 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition-all duration-500",
                      esActiva ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                    )}
                  >
                    {m.nombre}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </Container>

      {/* Móvil: carrusel deslizable con el sitio o la simulación visible. */}
      <div className="scrollbar-none mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 md:hidden">
        {MARCAS.map((m) => {
          const Simulacion = m.simulacion ? SIMULACIONES[m.simulacion] : null;
          return (
            <a
              key={m.nombre}
              href={m.url}
              {...abreFuera(m.url)}
              className="relative h-[460px] w-[84vw] shrink-0 snap-center overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-gradient-to-b from-[#0d2b45] to-[#06182a]"
            >
              {Simulacion ? (
                <Simulacion />
              ) : m.imagen ? (
                <Image src={m.imagen} alt={`Sitio web de ${m.nombre}`} fill sizes="85vw" className="object-cover object-top" />
              ) : null}
              {m.imagen && (
                <span className="absolute bottom-4 left-4 rounded-full bg-[#03101b]/75 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
                  {m.nombre}
                </span>
              )}
            </a>
          );
        })}
      </div>
    </section>
  );
}
