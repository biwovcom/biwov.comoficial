"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, Brain, Check, ChevronDown, Clapperboard, ClipboardCheck, Compass, Film, Handshake, LineChart, Megaphone,
  MessageCircle, PenLine, Search, ShieldCheck, Sparkles, Target, Users, Workflow, type LucideIcon,
} from "lucide-react";
import { PLANES_CLIENTES } from "@/data/portafolioClientes";
import { FooterClaro, HeaderClaro, waBiwov } from "@/components/claro/ChromeClaro";
import { precioPlan } from "@/components/claro/iconosPlan";
import { useTRM } from "@/hooks/useTRM";
import type { Moneda } from "@/lib/moneda";
import { cn } from "@/lib/utils";

const MSG = "Hola, quiero mi agencia de agentes de IA de biwov.";

const aparecer = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function Etiqueta({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex rounded-full bg-[#00c2e8]/12 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#0089a8]">{children}</span>;
}

const AGENTES: { rol: string; hace: string; icono: LucideIcon; lider?: boolean }[] = [
  { rol: "Coordinador", hace: "Recibe tus pedidos, reparte el trabajo y te avisa por Telegram", icono: Workflow, lider: true },
  { rol: "Estratega", hace: "Diagnóstico, cliente ideal, oferta, embudo y plan del mes", icono: Compass },
  { rol: "Guionista", hace: "Guiones de reels con el método biwov: gancho, escenas y caption", icono: Clapperboard },
  { rol: "Copywriter", hace: "Captions, carruseles, anuncios y textos que venden", icono: PenLine },
  { rol: "Creativo", hace: "Ideas, conceptos de campaña y series de contenido", icono: Sparkles },
  { rol: "Trafficker", hace: "Estructura y optimiza tus campañas en Meta", icono: Megaphone },
  { rol: "Auditor", hace: "Audita tu marca, tus redes y tu competencia", icono: Search },
  { rol: "Investigador", hace: "Mercado, tendencias y competencia, con fuentes", icono: LineChart },
  { rol: "Seguimiento", hace: "Detecta prospectos listos para comprar", icono: Target },
  { rol: "Closer", hace: "Guiones de cierre y manejo de objeciones", icono: Handshake },
  { rol: "Editor de video", hace: "Limpia silencios y tomas falsas de tus videos", icono: Film },
  { rol: "Lanzamientos", hace: "Fases, cronograma y piezas de cada lanzamiento", icono: Users },
];

const CEREBRO = [
  { doc: "Ficha maestra de la marca", tag: "Actualizada" },
  { doc: "Cliente ideal y su forma de hablar", tag: "3 perfiles" },
  { doc: "Servicios, precios y ofertas", tag: "Catálogo" },
  { doc: "Guía de guiones y contenido", tag: "Método biwov" },
  { doc: "Plan de trabajo del mes", tag: "En curso" },
  { doc: "Aprendizajes de cada campaña", tag: "Historial" },
];

const DIFERENCIAS = [
  { t: "Método de una agencia real", p: "Los agentes trabajan con los mismos métodos que usamos con nuestros clientes en biwov, no con respuestas genéricas." },
  { t: "Memoria de tu marca", p: "Cada agente lee el cerebro de tu empresa: tu cliente, tu tono, tus precios y lo que ya funcionó." },
  { t: "Entregables listos para usar", p: "Guiones con escenas, copys, planes y campañas completos, no ideas sueltas." },
  { t: "Tú apruebas todo", p: "Nada se publica ni se envía solo. Cada entrega queda esperando tu aprobación." },
  { t: "Un equipo, no un chat", p: "Un coordinador reparte el trabajo entre especialistas, como en una agencia." },
  { t: "Acompañamiento en español", p: "Te lo instalamos, capacitamos a tu equipo y lo mejoramos cada mes desde Colombia." },
];

const PASOS = [
  { t: "Diagnóstico de tu marca", p: "Respondes el cuestionario de inicio y revisamos tu empresa y tus redes." },
  { t: "Instalamos tu oficina", p: "Montamos los agentes en tu computador y cargamos el cerebro de tu marca." },
  { t: "Tu equipo pide, los agentes entregan", p: "Pides por la oficina o por Telegram; tú revisas y apruebas." },
  { t: "Mejora cada mes", p: "Actualizamos métodos y memoria con lo que aprende tu marca." },
];

const FAQ = [
  {
    q: "¿En qué se diferencia de usar ChatGPT o Claude por mi cuenta?",
    a: "Un chat responde lo que le preguntas. La agencia de agentes ya sabe qué hacer: tiene la memoria de tu marca, especialistas con métodos probados y un coordinador que organiza el trabajo. Recibes entregables completos, listos para aprobar.",
  },
  {
    q: "¿Necesito saber de marketing?",
    a: "No. Los agentes trabajan con la estrategia y los métodos de biwov. Tú decides y apruebas. En la instalación capacitamos a tu equipo para pedir bien.",
  },
  {
    q: "¿Qué necesito para usarla?",
    a: "Un computador con Windows o Mac e internet, y una suscripción de Claude a tu nombre (desde aprox. US$20 al mes según el uso). Nosotros hacemos la instalación.",
  },
  {
    q: "¿Mis datos quedan privados?",
    a: "Sí. La oficina y la memoria de tu marca quedan en tu propia cuenta y tu computador. Nada de tu información se comparte con otras marcas.",
  },
  {
    q: "¿Los agentes publican o responden mensajes solos?",
    a: "No. Preparan el trabajo y lo dejan esperando tu aprobación. Publicar y responder a tus clientes sigue siendo decisión de tu equipo.",
  },
  {
    q: "¿Puedo cancelar?",
    a: "El compromiso mínimo es de 3 meses; después es mes a mes. Si cancelas, conservas lo que se creó, y se detienen las actualizaciones, el mantenimiento de la memoria y el soporte.",
  },
];

function Pregunta({ q, a }: { q: string; a: string }) {
  const [abierta, setAbierta] = useState(false);
  return (
    <div className="rounded-2xl border border-[#0a2642]/10 bg-white">
      <button type="button" onClick={() => setAbierta((v) => !v)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-heading text-lg font-bold">
        {q}
        <ChevronDown className={cn("h-5 w-5 flex-none text-[#00a3c4] transition-transform", abierta && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {abierta && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="px-6 pb-6 text-[15px] leading-relaxed text-[#0a2642]/70">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AgenciaIA() {
  const { trm } = useTRM();
  const [moneda, setMoneda] = useState<Moneda>("COP");
  const planes = PLANES_CLIENTES.filter((p) => p.escalon === "agentes");

  return (
    <div className="min-h-screen overflow-x-clip bg-white text-[#0a2642]">
      <HeaderClaro cta="Quiero mi agencia" mensaje={MSG} />

      {/* HERO */}
      <section className="relative">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#00c2e833_0,transparent_65%)]" />
        <div className="relative mx-auto max-w-5xl px-5 pb-12 pt-16 text-center md:px-8 md:pt-24">
          <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-[#00c2e8]/30 bg-white px-4 py-1.5 text-sm font-semibold shadow-sm">
            <span className="rounded-full bg-[#00c2e8] px-2 py-0.5 text-[11px] font-bold text-[#03101b]">Nuevo</span>
            biwov Agentes
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.7 }}
            className="mt-6 font-heading text-5xl font-extrabold leading-[1.02] tracking-tight md:text-7xl"
          >
            Tu agencia de marketing con <span className="bg-gradient-to-r from-[#0a2642] via-[#11558f] to-[#00c2e8] bg-clip-text text-transparent">agentes de IA</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="mx-auto mt-6 max-w-2xl text-lg text-[#0a2642]/70 md:text-xl">
            Un equipo de agentes que piensa, crea y prepara tu marketing con la memoria de tu marca. La IA trabaja; tú apruebas.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="mt-9 flex flex-wrap justify-center gap-3">
            <a href="#planes" className="rounded-full bg-[#0a2642] px-7 py-4 font-bold text-white shadow-xl shadow-[#0a2642]/25 transition-transform hover:-translate-y-0.5">
              Quiero mi agencia
            </a>
            <a href="#equipo" className="rounded-full border border-[#0a2642]/15 bg-white px-7 py-4 font-bold transition-colors hover:border-[#00c2e8]">
              Conocer el equipo
            </a>
          </motion.div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 px-5 pb-20 md:grid-cols-4 md:px-8">
          {[
            { t: "Cerebro de tu marca", i: Brain },
            { t: "Método biwov", i: ClipboardCheck },
            { t: `${AGENTES.length} especialistas`, i: Users },
            { t: "Tú apruebas todo", i: ShieldCheck },
          ].map(({ t, i: I }, k) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + k * 0.07 }}
              className="flex items-center gap-3 rounded-2xl border border-[#0a2642]/10 bg-white px-4 py-4 shadow-sm"
            >
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-[#00c2e8]/12 text-[#0089a8]">
                <I className="h-5 w-5" />
              </span>
              <span className="text-sm font-bold">{t}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CEREBRO */}
      <section className="bg-[#f4f9fc]">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:px-8">
          <motion.div {...aparecer}>
            <Etiqueta>El corazón</Etiqueta>
            <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight md:text-5xl">Un cerebro que trabaja como tu marca</h2>
            <p className="mt-4 text-lg text-[#0a2642]/70">
              Todo empieza en la memoria de tu empresa. Cada agente la consulta antes de trabajar, por eso cada guion, copy o campaña suena a ti. Entre más la usas, mejor te conoce.
            </p>
            <ul className="mt-6 space-y-3">
              {["Tu cliente ideal y sus palabras exactas", "Tus servicios, precios y ofertas", "Lo que ya funcionó y lo que no", "El plan de trabajo de cada mes"].map((t) => (
                <li key={t} className="flex items-center gap-3 font-medium">
                  <Check className="h-5 w-5 text-[#00c2e8]" /> {t}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div {...aparecer} className="rounded-[28px] border border-[#0a2642]/10 bg-white p-6 shadow-2xl shadow-[#0a2642]/10">
            <div className="flex items-center gap-2 border-b border-[#0a2642]/10 pb-4">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-sm font-bold">Cerebro de tu marca</span>
            </div>
            <ul className="mt-4 space-y-2">
              {CEREBRO.map((c, k) => (
                <motion.li
                  key={c.doc}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + k * 0.08 }}
                  className="flex items-center justify-between rounded-xl bg-[#f4f9fc] px-4 py-3"
                >
                  <span className="flex items-center gap-3 text-sm font-semibold">
                    <Brain className="h-4 w-4 text-[#00a3c4]" /> {c.doc}
                  </span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-[#0089a8]">{c.tag}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* PIDE Y APRUEBA */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:px-8">
        <motion.div {...aparecer} className="order-2 rounded-[28px] bg-[#0a2642] p-6 text-white shadow-2xl shadow-[#0a2642]/25 md:order-1">
          <div className="flex items-center gap-2 text-sm font-bold text-white/70">
            <MessageCircle className="h-4 w-4 text-[#00c2e8]" /> Oficina de agentes
          </div>
          <div className="mt-5 space-y-4">
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-[#00c2e8] px-4 py-3 text-sm font-medium text-[#03101b]">
              Necesito 3 guiones de reels para la campaña de diciembre, con su caption.
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="max-w-[90%] rounded-2xl rounded-bl-sm bg-white/10 px-4 py-3 text-sm"
            >
              <p className="font-bold text-[#8fdff0]">Guionista</p>
              <p className="mt-1 text-white/85">Listo. Te dejo 3 guiones con gancho, escenas, texto en pantalla y caption. Quedan esperando tu aprobación.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Guiones", "Captions", "Plan de historias"].map((c) => (
                  <span key={c} className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">
                    {c}
                  </span>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1 }}
              className="flex items-center gap-2 text-xs font-semibold text-white/60"
            >
              <ShieldCheck className="h-4 w-4 text-[#00c2e8]" /> Nada se publica sin tu aprobación
            </motion.div>
          </div>
        </motion.div>
        <motion.div {...aparecer} className="order-1 md:order-2">
          <Etiqueta>Cómo se trabaja</Etiqueta>
          <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight md:text-5xl">Pides en una frase. Recibes el trabajo listo.</h2>
          <p className="mt-4 text-lg text-[#0a2642]/70">
            Sin explicar todo cada vez y sin herramientas sueltas. El coordinador entiende el pedido, lo pasa al especialista y te entrega el resultado para aprobar.
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-3">
            {["Guiones y escenas", "Copys y captions", "Planes de contenido", "Estructura de campañas", "Auditorías de redes", "Guiones de cierre"].map((t) => (
              <li key={t} className="flex items-center gap-2 rounded-xl bg-[#f4f9fc] px-3 py-2.5 text-sm font-semibold">
                <Check className="h-4 w-4 text-[#00c2e8]" /> {t}
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* EQUIPO */}
      <section id="equipo" className="bg-[#f4f9fc] scroll-mt-20">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8">
          <motion.div {...aparecer} className="text-center">
            <Etiqueta>Tu equipo</Etiqueta>
            <h2 className="mt-4 font-heading text-3xl font-extrabold md:text-5xl">Conoce a tus {AGENTES.length} especialistas</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[#0a2642]/70">Cada agente domina su área y un coordinador los organiza, como en una agencia de verdad.</p>
          </motion.div>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {AGENTES.map((a, k) => {
              const I = a.icono;
              return (
                <motion.div
                  key={a.rol}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (k % 4) * 0.06 }}
                  whileHover={{ y: -6 }}
                  className={cn(
                    "rounded-3xl p-5 shadow-sm transition-shadow hover:shadow-xl",
                    a.lider ? "bg-[#0a2642] text-white" : "border border-[#0a2642]/10 bg-white",
                  )}
                >
                  <span className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", a.lider ? "bg-[#00c2e8] text-[#03101b]" : "bg-[#00c2e8]/12 text-[#0089a8]")}>
                    <I className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-heading text-lg font-extrabold">{a.rol}</h3>
                  <p className={cn("mt-1 text-sm leading-relaxed", a.lider ? "text-white/70" : "text-[#0a2642]/65")}>{a.hace}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DIFERENCIAS */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <motion.div {...aparecer} className="text-center">
          <Etiqueta>Por qué es distinto</Etiqueta>
          <h2 className="mt-4 font-heading text-3xl font-extrabold md:text-5xl">No es otra herramienta de IA</h2>
        </motion.div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {DIFERENCIAS.map((d, k) => (
            <motion.div key={d.t} {...aparecer} transition={{ ...aparecer.transition, delay: (k % 3) * 0.08 }} className="rounded-3xl border border-[#0a2642]/10 p-7">
              <span className="font-heading text-sm font-black text-[#00a3c4]">0{k + 1}</span>
              <h3 className="mt-2 font-heading text-xl font-extrabold">{d.t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#0a2642]/70">{d.p}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PASOS */}
      <section className="bg-[#0a2642] text-white">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8">
          <motion.h2 {...aparecer} className="text-center font-heading text-3xl font-extrabold md:text-5xl">
            De cero a tu agencia en 4 pasos
          </motion.h2>
          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {PASOS.map((p, k) => (
              <motion.div key={p.t} {...aparecer} transition={{ ...aparecer.transition, delay: k * 0.1 }} className="rounded-3xl bg-white/5 p-6">
                <span className="font-heading text-4xl font-black text-[#00c2e8]">0{k + 1}</span>
                <h3 className="mt-3 font-heading text-lg font-extrabold">{p.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{p.p}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section id="planes" className="mx-auto max-w-5xl scroll-mt-20 px-5 py-20 md:px-8">
        <motion.div {...aparecer} className="text-center">
          <Etiqueta>Planes</Etiqueta>
          <h2 className="mt-4 font-heading text-3xl font-extrabold md:text-5xl">Elige tu agencia de agentes</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#0a2642]/70">Un pago de instalación y una mensualidad fija. Tu marketing a la mano, sin contratar una agencia.</p>
          <div className="mt-5 inline-flex rounded-full border border-[#0a2642]/10 p-1 text-sm font-semibold">
            {(["COP", "USD"] as Moneda[]).map((m) => (
              <button key={m} type="button" onClick={() => setMoneda(m)} className={cn("rounded-full px-4 py-1.5", moneda === m ? "bg-[#0a2642] text-white" : "text-[#0a2642]/60")}>
                {m === "COP" ? "Pesos" : "Dólares"}
              </button>
            ))}
          </div>
        </motion.div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {planes.map((p, k) => (
            <motion.div
              key={p.slug}
              {...aparecer}
              transition={{ ...aparecer.transition, delay: k * 0.1 }}
              className={cn(
                "relative flex flex-col rounded-[28px] p-8",
                p.destacado ? "bg-[#0a2642] text-white shadow-2xl shadow-[#0a2642]/30" : "border border-[#0a2642]/10 bg-white shadow-sm",
              )}
            >
              {p.destacado && <span className="absolute right-6 top-6 rounded-full bg-[#00c2e8] px-3 py-1 text-xs font-bold text-[#03101b]">Recomendado</span>}
              <h3 className="font-heading text-2xl font-extrabold">{p.nombre.replace("biwov Agentes · ", "")}</h3>
              <p className={cn("mt-2 text-sm", p.destacado ? "text-white/70" : "text-[#0a2642]/65")}>{p.gancho}</p>
              <p className="mt-6 font-heading text-5xl font-extrabold">
                {precioPlan(p, moneda, trm)}
                <span className={cn("text-base font-semibold", p.destacado ? "text-white/60" : "text-[#0a2642]/50")}> {p.unidad}</span>
              </p>
              {p.adicional && (
                <p className={cn("mt-2 text-sm", p.destacado ? "text-[#8fdff0]" : "text-[#0089a8]")}>
                  + {p.adicional.label}: {precioPlan({ precio: p.adicional.precio }, moneda, trm)}
                </p>
              )}
              <ul className="mt-6 flex-1 space-y-2.5">
                {p.incluye.flatMap((g) => g.items).map((it) => (
                  <li key={it} className="flex gap-3 text-[15px]">
                    <Check className="mt-0.5 h-5 w-5 flex-none text-[#00c2e8]" /> {it}
                  </li>
                ))}
              </ul>
              <a
                href={waBiwov(p.mensajeWhatsApp)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "mt-8 rounded-full px-6 py-4 text-center font-bold transition-transform hover:-translate-y-0.5",
                  p.destacado ? "bg-white text-[#0a2642]" : "bg-[#0a2642] text-white",
                )}
              >
                Activar {p.nombre.replace("biwov Agentes · ", "")}
              </a>
              <p className={cn("mt-3 text-center text-xs", p.destacado ? "text-white/50" : "text-[#0a2642]/50")}>{p.noIncluye[0]}</p>
            </motion.div>
          ))}
        </div>
        <motion.p {...aparecer} className="mt-8 text-center text-[#0a2642]/70">
          ¿Prefieres que nuestro equipo lo haga todo por ti?{" "}
          <Link href="/planes/agencia-completa" className="inline-flex items-center gap-1 font-bold text-[#0a2642] underline decoration-[#00c2e8] underline-offset-4">
            Mira el plan Agencia Completa <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.p>
      </section>

      {/* FAQ */}
      <section className="bg-[#f4f9fc]">
        <div className="mx-auto max-w-3xl px-5 py-20 md:px-8">
          <motion.h2 {...aparecer} className="text-center font-heading text-3xl font-extrabold md:text-5xl">
            Preguntas frecuentes
          </motion.h2>
          <div className="mt-10 space-y-3">
            {FAQ.map((f) => (
              <Pregunta key={f.q} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#00c2e826_0,transparent_65%)]" />
        <motion.div {...aparecer} className="relative mx-auto max-w-3xl px-5 py-24 text-center md:px-8">
          <h2 className="font-heading text-4xl font-extrabold leading-tight md:text-6xl">Empieza a ejecutar tu marketing hoy</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-[#0a2642]/70">Tu equipo de agentes, con la memoria de tu marca, listo para trabajar contigo.</p>
          <a
            href={waBiwov(MSG)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 inline-flex rounded-full bg-[#0a2642] px-9 py-4 font-bold text-white shadow-xl shadow-[#0a2642]/25 transition-transform hover:-translate-y-0.5"
          >
            Quiero mi agencia de agentes
          </a>
        </motion.div>
      </section>

      <FooterClaro />
    </div>
  );
}
