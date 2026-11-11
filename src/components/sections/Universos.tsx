"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Bot, Camera, Clapperboard, Filter, Megaphone, MessageCircle, UserCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { useQuoter } from "@/components/quoter/QuoterProvider";
import { PLANES } from "@/data/planes";
import { NIVELES_PRODUCCION } from "@/data/addOns";
import { linkWhatsApp } from "@/lib/panel/whatsapp";
import { WHATSAPP_BIWOV, MENSAJE_WHATSAPP_BIWOV } from "@/lib/contacto";
import { cn } from "@/lib/utils";

const formatoCop = (n: number) => `$${n.toLocaleString("es-CO")}`;

const BTN_BLANCO =
  "inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#03101b] transition-transform duration-300 hover:scale-[1.03] md:text-base";
const BTN_BORDE =
  "inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:border-accent hover:text-accent md:text-base";

function Tarjeta({
  numero,
  etiqueta,
  titulo,
  texto,
  media,
  acciones,
  delay = 0,
}: {
  numero: string;
  etiqueta: string;
  titulo: string;
  texto: string;
  media: ReactNode;
  acciones: ReactNode;
  delay?: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className="card-universo group flex flex-col rounded-[2rem] p-3 transition-transform duration-500 hover:-translate-y-1 md:p-4"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">{media}</div>
      <div className="flex flex-1 flex-col px-3 pb-4 pt-7 md:px-6 md:pb-6">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent md:text-sm">
          {numero} · {etiqueta}
        </span>
        <h3 className="mt-3 text-3xl font-medium leading-[1.08] text-white md:text-[2.4rem]">{titulo}</h3>
        <p className="mt-4 max-w-md text-base leading-relaxed text-white/60 md:text-lg">{texto}</p>
        <div className="mt-8 flex flex-wrap gap-3">{acciones}</div>
      </div>
    </motion.article>
  );
}

function Orbitas() {
  return (
    <>
      <div className="absolute left-1/2 top-1/2 h-[135%] w-[95%] -translate-x-1/2 -translate-y-1/2 animate-[spin_60s_linear_infinite] rounded-full border border-accent/15" />
      <div className="absolute left-1/2 top-1/2 h-[95%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" />
    </>
  );
}

function MediaPlanes() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(70%_60%_at_50%_45%,rgba(0,194,232,0.12),transparent_70%)]">
      <Orbitas />
      <div className="relative w-[78%] max-w-sm space-y-3">
        {PLANES.filter((p) => p.recomendado || p.id === "direccion" || p.id === "gestion-esencial").map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, x: i % 2 ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
            className={cn(
              "flex items-center justify-between rounded-2xl border px-4 py-3 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md",
              plan.recomendado
                ? "border-accent/60 bg-[#0e3150] md:scale-105"
                : "border-white/10 bg-[#0a2642]/90",
            )}
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                {plan.linea === "direccion" ? "Tú ejecutas" : "Lo hacemos por ti"}
              </p>
              <p className="text-base font-semibold text-white">{plan.nombre}</p>
            </div>
            <p className="text-sm font-semibold text-white">
              {formatoCop(plan.precioDesde.cop)}
              <span className="text-xs font-normal text-white/50"> /mes</span>
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const CHIPS_SISTEMA = [
  { label: "CRM", pos: "left-[6%] top-[18%]" },
  { label: "IA", pos: "right-[8%] top-[22%]" },
  { label: "Pauta en Meta", pos: "left-[3%] bottom-[22%]" },
  { label: "Contenido", pos: "right-[4%] bottom-[16%]" },
  { label: "Web", pos: "left-[30%] top-[4%]" },
];

const PASOS_FLUJO = [
  { Icon: Megaphone, texto: "Llega un interesado desde Meta" },
  { Icon: Bot, texto: "El asistente con IA responde" },
  { Icon: Filter, texto: "Filtra a los curiosos" },
  { Icon: UserCheck, texto: "Te pasa a quien sí va a comprar" },
];

function MediaAutomatizacion() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(70%_60%_at_50%_45%,rgba(0,194,232,0.12),transparent_70%)]">
      <Orbitas />
      {CHIPS_SISTEMA.map((c) => (
        <span
          key={c.label}
          className={cn(
            "absolute hidden rounded-full border border-white/10 bg-[#081a2b]/80 px-4 py-2 text-sm text-white/40 sm:block",
            c.pos,
          )}
        >
          {c.label}
        </span>
      ))}
      <div className="relative w-[70%] max-w-xs">
        <span className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/70 bg-[#03101b] px-5 py-2 text-sm font-medium text-white md:text-base">
          Automatización
        </span>
        <div className="rounded-2xl bg-[#f4f6f8] p-3 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] md:p-4">
          <p className="mb-3 px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0a5f7a]">
            Flujo · Nuevo interesado
          </p>
          <div className="space-y-2">
            {PASOS_FLUJO.map(({ Icon, texto }, i) => (
              <motion.div
                key={texto}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.35 }}
                className="flex items-center gap-2.5 rounded-xl border border-black/[0.06] bg-white px-3 py-2"
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                    i === 0 ? "bg-[#0a2642] text-white" : "bg-[#e6f7fb] text-[#0a5f7a]",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-medium text-[#0d1420] md:text-[13px]">{texto}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MediaContenido() {
  const start = NIVELES_PRODUCCION[0];
  return (
    <>
      <Image
        src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=70"
        alt="Producción de contenido con cámara profesional"
        fill
        sizes="(max-width: 768px) 100vw, 600px"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#03101b]/90 via-[#03101b]/20 to-transparent" />
      <div className="absolute bottom-5 left-5 right-5 md:bottom-7 md:left-7">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          <Camera className="h-4 w-4" /> Producción
        </p>
        <p className="mt-1 text-xl font-medium text-white md:text-2xl">
          {start.reels} videos editados · {start.tiempoProduccion.toLowerCase()} de grabación
        </p>
        <p className="mt-1 flex items-center gap-2 text-sm text-white/70">
          <Clapperboard className="h-4 w-4" /> Desde {formatoCop(start.precio.cop)} COP por producción
        </p>
      </div>
    </>
  );
}

function MediaWeb() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,rgba(0,194,232,0.12),transparent_70%)]">
      <div className="absolute left-[7%] top-[12%] w-[80%] overflow-hidden rounded-xl border border-white/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] transition-transform duration-700 group-hover:-translate-y-1">
        <div className="flex items-center gap-1 bg-[#0d2238] px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-white/25" />
          <span className="h-2 w-2 rounded-full bg-white/25" />
          <span className="h-2 w-2 rounded-full bg-white/25" />
          <span className="ml-3 truncate text-[10px] text-white/40">nagaraku.com.co</span>
        </div>
        <div className="relative aspect-[16/10]">
          <Image src="/casos/fashion-lash-desktop.webp" alt="Tienda virtual nagaraku.com.co" fill sizes="500px" className="object-cover object-top" />
        </div>
      </div>
      <div className="absolute bottom-[8%] right-[6%] w-[24%] overflow-hidden rounded-[1.1rem] border-4 border-[#0d2238] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.9)] transition-transform duration-700 group-hover:-translate-y-2">
        <div className="relative aspect-[9/17]">
          <Image src="/casos/fashion-lash-mobile.webp" alt="Tienda nagaraku.com.co en celular" fill sizes="160px" className="object-cover object-top" />
        </div>
      </div>
    </div>
  );
}

export function Universos() {
  const { open } = useQuoter();
  const whatsapp = linkWhatsApp(WHATSAPP_BIWOV, MENSAJE_WHATSAPP_BIWOV);

  return (
    <section id="servicios" className="scroll-mt-24 py-12 md:py-20">
      <Container className="!max-w-7xl grid gap-5 md:grid-cols-2 md:gap-6">
        <Tarjeta
          numero="01"
          etiqueta="Planes mensuales"
          titulo="Te dirigimos o lo hacemos por ti"
          texto="Elige entre planes de dirección estratégica, donde tú ejecutas y nosotros te guiamos, o planes de gestión, donde manejamos tus redes por ti."
          media={<MediaPlanes />}
          acciones={
            <>
              <Link href="/tienda#gestion" className={BTN_BLANCO}>
                Ver planes
              </Link>
              <button type="button" onClick={() => open()} className={BTN_BORDE}>
                Diagnóstico gratis
              </button>
            </>
          }
        />
        <Tarjeta
          numero="02"
          etiqueta="Automatización e IA"
          titulo="Tu WhatsApp atiende aunque no estés"
          texto="Asistentes con IA, CRM y seguimiento automático para que ningún interesado se quede sin respuesta."
          delay={0.1}
          media={<MediaAutomatizacion />}
          acciones={
            <>
              <Link href="/tienda#automatizacion" className={BTN_BLANCO}>
                Ver precios
              </Link>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={BTN_BORDE}>
                <WhatsAppIcon className="h-5 w-5" />
                Hablemos
              </a>
            </>
          }
        />
        <Tarjeta
          numero="03"
          etiqueta="Producción de contenido"
          titulo="Contenido que hace que te elijan"
          texto="Nosotros grabamos y editamos con guion y dirección creativa, o tú grabas y nosotros te guiamos y editamos."
          media={<MediaContenido />}
          acciones={
            <Link href="/tienda#produccion" className={BTN_BLANCO}>
              Ver paquetes
            </Link>
          }
        />
        <Tarjeta
          numero="04"
          etiqueta="Web y tiendas"
          titulo="Páginas que convierten visitas en clientes"
          texto="Landing pages, sitios y tiendas virtuales conectadas a tu WhatsApp, tus campañas y tu CRM."
          delay={0.1}
          media={<MediaWeb />}
          acciones={
            <>
              <Link href="/tienda#ecosistemas" className={BTN_BLANCO}>
                Ver precios
              </Link>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={BTN_BORDE}>
                <MessageCircle className="h-4 w-4" />
                Cotizar mi página
              </a>
            </>
          }
        />
      </Container>
    </section>
  );
}
