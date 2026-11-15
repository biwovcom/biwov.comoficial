"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, Brain, Check, ChevronDown, ClipboardCheck, FileText, Images, ListChecks, Megaphone, PenLine,
  RefreshCw, ShieldCheck, Sparkles, Target, Users, Workflow, X, type LucideIcon,
} from "lucide-react";
import { FORMAS_PAGO, MESES_MINIMOS, PLANES_CLIENTES } from "@/data/portafolioClientes";
import { FooterClaro, HeaderClaro, waBiwov } from "@/components/claro/ChromeClaro";
import { formatCopEnMoneda, type Moneda } from "@/lib/moneda";
import { useTRM } from "@/hooks/useTRM";
import { cn } from "@/lib/utils";

const MSG = "Hola, quiero mi agencia de agentes de IA de biwov.";
const CORAL = "#ff7a59";
const MENTA = "#9be8c8";
const AMARILLO = "#ffd96a";

const aparecer = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
};

/** Tu equipo real de agentes (los mismos de la oficina de biwov). */
const AGENTES: { id: string; nombre: string; rol: string; lider?: boolean; nuevo?: boolean }[] = [
  { id: "allen", nombre: "Allen", rol: "Coordinador · tu mano derecha", lider: true },
  { id: "hormozi", nombre: "Hormozi", rol: "Estratega comercial" },
  { id: "ogilvy", nombre: "Ogilvy", rol: "Director de contenido y guiones" },
  { id: "barbara", nombre: "Bárbara", rol: "Trafficker Meta Ads" },
  { id: "scher", nombre: "Scher", rol: "Diseñadora de marca", nuevo: true },
  { id: "toffler", nombre: "Toffler", rol: "Radar de tendencias", nuevo: true },
  { id: "drucker", nombre: "Drucker", rol: "Auditor de negocio y redes" },
  { id: "brunson", nombre: "Brunson", rol: "Landing pages y embudos" },
  { id: "zig", nombre: "Zig", rol: "Seguimiento de prospectos" },
  { id: "margarita", nombre: "Margarita", rol: "Closer de ventas" },
  { id: "murch", nombre: "Murch", rol: "Editor de video" },
  { id: "mike", nombre: "Mike", rol: "Infoproductos" },
  { id: "camilo", nombre: "Camilo", rol: "Contratos y documentos" },
];

const Avatar = ({ id, size = 64, className }: { id: string; size?: number; className?: string }) => (
  <Image src={`/agentes/${id}.svg`} alt="" width={size} height={size} className={cn("rounded-full", className)} unoptimized />
);

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#0a2642]/10 bg-white px-4 py-1.5 text-sm font-semibold shadow-sm">
      <Sparkles className="h-4 w-4" style={{ color: CORAL }} />
      {children}
    </span>
  );
}

const BENTO: { t: string; p: string; i: LucideIcon; bg: string; dark?: boolean }[] = [
  { t: "Cerebro de tu marca", p: "Los documentos clave de tu negocio para que cada entrega salga 100% personalizada.", i: Brain, bg: CORAL, dark: true },
  { t: "Flujos de trabajo", p: "Del caos al orden: campañas, guiones y planes listos en minutos, no en días.", i: Workflow, bg: MENTA },
  { t: "Piezas y diseños", p: "Carruseles, anuncios y manuales de marca hechos con criterio de diseñador.", i: Images, bg: AMARILLO },
  { t: "Tareas listas", p: "Pide en una frase lo que antes te tomaba horas. Tú solo apruebas.", i: ListChecks, bg: "#0a2642", dark: true },
];

const CEREBRO = [
  { doc: "Ficha maestra de la marca", tag: "Actualizada", i: FileText },
  { doc: "Cliente ideal y su forma de hablar", tag: "3 perfiles", i: Users },
  { doc: "Servicios, precios y ofertas", tag: "Catálogo", i: ClipboardCheck },
  { doc: "Objetivos y plan del mes", tag: "En curso", i: Target },
];

/** Ejemplos de entregables (marcas ficticias, marcados como ejemplo). */
const EJEMPLOS = [
  { tipo: "Guion de reel", marca: "Café Andino", fondo: "bg-[#fff4ec]", titulo: "Tu café no se enfría por la mañana. Se enfría por la falta de rito.", pie: "Gancho · 3 escenas · caption" },
  { tipo: "Carrusel", marca: "Clínica Sonríe", fondo: "bg-[#eaf8fd]", titulo: "5 señales de que tu sonrisa pide una valoración", pie: "7 láminas · texto y diseño" },
  { tipo: "Anuncio", marca: "Hotel Mirador", fondo: "bg-[#fff8dc]", titulo: "Un fin de semana entre montañas, a 30 minutos de la ciudad", pie: "3 variantes para probar" },
  { tipo: "Manual de marca", marca: "Taller Ruana", fondo: "bg-[#eefaf3]", titulo: "Logo, paleta y tipografías con la historia de la marca", pie: "Hecho por Scher" },
  { tipo: "Plan de contenido", marca: "Moda Kaldas", fondo: "bg-[#f3efff]", titulo: "12 publicaciones del mes con su objetivo y su guion", pie: "Calendario mensual" },
  { tipo: "Radar semanal", marca: "biwov", fondo: "bg-[#eef3f8]", titulo: "Lo que cambió en Meta, TikTok e IA esta semana", pie: "Hecho por Toffler" },
];

const POR_QUE = [
  { t: "Método de una agencia real", p: "Los agentes trabajan con los métodos que biwov usa con sus clientes.", i: ClipboardCheck },
  { t: "Contexto real de tu negocio", p: "Leen el cerebro de tu marca antes de cada tarea.", i: Target },
  { t: "Entregables listos", p: "Guiones, planes, campañas y diseños completos, no ideas sueltas.", i: FileText },
  { t: "Tú apruebas todo", p: "Nada se publica ni se envía solo.", i: ShieldCheck },
  { t: "Aprende contigo", p: "La memoria mejora con cada campaña y cada aprobación.", i: RefreshCw },
  { t: "Acompañamiento en español", p: "Te lo instalamos, capacitamos y lo mejoramos cada mes.", i: Users },
];

const FAQ = [
  { q: "¿En qué se diferencia de usar ChatGPT o Claude por mi cuenta?", a: "Un chat responde lo que le preguntas. La agencia de agentes ya sabe qué hacer: tiene la memoria de tu marca, especialistas con métodos probados y un coordinador que organiza el trabajo. Recibes entregables completos, listos para aprobar." },
  { q: "¿Necesito saber de marketing?", a: "No. Los agentes trabajan con la estrategia y los métodos de biwov. Tú decides y apruebas. En la instalación capacitamos a tu equipo." },
  { q: "¿Qué necesito para usarla?", a: "Un computador con internet y una suscripción de Claude a tu nombre (desde aprox. US$20 al mes según el uso), que pagas directo. Nosotros hacemos la instalación." },
  { q: "¿Los diseños los hace una IA de imágenes?", a: "No. Scher, la diseñadora de marca, estudia tu empresa y construye el logo y la identidad en vectores con criterio de diseño, sin generadores de imágenes de IA." },
  { q: "¿Los agentes publican o responden mensajes solos?", a: "No. Preparan el trabajo y lo dejan esperando tu aprobación. Publicar y responder a tus clientes sigue siendo decisión de tu equipo." },
  { q: "¿Qué pasa con mis datos?", a: "La memoria de tu marca es solo tuya y no se comparte con otras marcas. Si cancelas, te entregamos una copia de tu información." },
  { q: "¿Puedo cancelar?", a: `La permanencia mínima es de ${MESES_MINIMOS} meses; después es mes a mes. Al cancelar se desactiva el acceso a los agentes, las actualizaciones y el soporte, y te entregamos la copia de tu información.` },
];

function Pregunta({ q, a }: { q: string; a: string }) {
  const [abierta, setAbierta] = useState(false);
  return (
    <div className="rounded-2xl border border-[#0a2642]/10 bg-white">
      <button type="button" onClick={() => setAbierta((v) => !v)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-heading text-lg font-bold">
        {q}
        <ChevronDown className={cn("h-5 w-5 flex-none transition-transform", abierta && "rotate-180")} style={{ color: CORAL }} />
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

/** Oficina ilustrada: los agentes trabajando en sus escritorios. */
function Oficina() {
  const puestos = AGENTES.slice(0, 8);
  return (
    <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-[#e9f7fc] to-[#d4eef7] p-6 md:p-10">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[repeating-linear-gradient(90deg,#c6e6f1_0,#c6e6f1_2px,transparent_2px,transparent_80px)] opacity-60" />
      <div className="relative grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4">
        {puestos.map((a, k) => (
          <div key={a.id} className="flex flex-col items-center">
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2.4 + (k % 3) * 0.4, repeat: Infinity, ease: "easeInOut", delay: k * 0.2 }} className="relative z-10">
              <Avatar id={a.id} size={72} className="shadow-lg ring-4 ring-white" />
              <motion.span
                animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8] }}
                transition={{ duration: 3.2, repeat: Infinity, delay: k * 0.7 }}
                className="absolute -right-12 -top-3 whitespace-nowrap rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#0a2642] shadow"
              >
                {["escribiendo…", "listo ✓", "diseñando…", "analizando…"][k % 4]}
              </motion.span>
            </motion.div>
            <div className="-mt-3 w-full max-w-[150px] rounded-xl bg-white px-3 pb-3 pt-5 text-center shadow-md">
              <div className="mx-auto mb-2 h-10 w-16 rounded-md bg-[#0a2642] p-1">
                <motion.div animate={{ width: ["20%", "90%", "20%"] }} transition={{ duration: 3 + k * 0.3, repeat: Infinity }} className="h-1 rounded bg-[#00c2e8]" />
                <div className="mt-1 h-1 w-3/4 rounded bg-white/30" />
                <div className="mt-1 h-1 w-1/2 rounded bg-white/30" />
              </div>
              <p className="text-xs font-extrabold">{a.nombre}</p>
              <p className="text-[10px] text-[#0a2642]/55">{a.rol}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AgenciaIA() {
  const { trm } = useTRM();
  const [moneda, setMoneda] = useState<Moneda>("COP");
  const [anual, setAnual] = useState(false);
  const planes = PLANES_CLIENTES.filter((p) => p.escalon === "agentes");
  const dtoAnual = FORMAS_PAGO.find((f) => f.id === "anual")!.descuento;
  const precio = (cop: number, usd?: number) => {
    const factor = anual ? 12 * (1 - dtoAnual) : 1;
    if (moneda === "USD" && usd) return `US$${Math.round(usd * factor)}`;
    return formatCopEnMoneda(Math.round((cop * factor) / 1000) * 1000, moneda, trm);
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-white text-[#0a2642]">
      <HeaderClaro cta="Empezar ahora" mensaje={MSG} />

      {/* ───────── HERO ───────── */}
      <section className="relative">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#00c2e826_0,transparent_62%)]" />
        {[
          { id: "ogilvy", c: "left-[6%] top-24" },
          { id: "scher", c: "right-[7%] top-32" },
          { id: "barbara", c: "left-[11%] top-[360px]" },
          { id: "toffler", c: "right-[12%] top-[380px]" },
        ].map((f, k) => (
          <motion.div
            key={f.id}
            className={cn("absolute hidden lg:block", f.c)}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1, y: [0, -14, 0] }}
            transition={{ opacity: { delay: 0.4 + k * 0.1 }, scale: { delay: 0.4 + k * 0.1 }, y: { duration: 4 + k, repeat: Infinity, ease: "easeInOut" } }}
          >
            <Avatar id={f.id} size={84} className="shadow-xl ring-4 ring-white" />
          </motion.div>
        ))}
        <div className="relative mx-auto max-w-5xl px-5 pb-10 pt-16 text-center md:px-8 md:pt-24">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#0a2642]/10 bg-white px-2 py-1.5 pr-4 text-sm font-semibold shadow-sm">
              <span className="rounded-full bg-[#0a2642] px-3 py-0.5 text-xs font-bold text-white">Nuevo</span>
              <Sparkles className="h-4 w-4" style={{ color: CORAL }} /> Tu agencia de marketing con IA
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.7 }} className="mt-6 font-heading text-5xl font-extrabold leading-[1.02] tracking-tight md:text-[84px]">
            Tu agencia de marketing <span style={{ color: CORAL }}>con agentes de IA</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="mx-auto mt-6 max-w-2xl text-lg text-[#0a2642]/65 md:text-xl">
            Un equipo de {AGENTES.length} agentes que piensa, crea y prepara tu marketing con la memoria de tu marca, para que te enfoques en hacer crecer tu negocio.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="mt-9 flex flex-wrap justify-center gap-3">
            <a href="#planes" className="inline-flex items-center gap-2 rounded-full px-8 py-4 font-bold text-white shadow-xl transition-transform hover:-translate-y-0.5" style={{ background: CORAL, boxShadow: `0 18px 40px -12px ${CORAL}88` }}>
              Empezar ahora <ArrowRight className="h-5 w-5" />
            </a>
            <a href="#ejemplos" className="rounded-full border border-[#0a2642]/15 bg-white px-8 py-4 font-bold transition-colors hover:border-[#0a2642]/40">
              Ver ejemplos
            </a>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-2 text-sm font-semibold text-[#0a2642]/70">
            {[`${AGENTES.length} agentes especialistas`, "Cerebro de tu marca", "Método biwov", "Tú apruebas todo"].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <Check className="h-4 w-4 rounded-full p-0.5 text-white" style={{ background: CORAL }} /> {t}
              </span>
            ))}
          </motion.div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-4 px-5 pb-20 sm:grid-cols-2 md:px-8 lg:grid-cols-4">
          {BENTO.map((b, k) => {
            const I = b.i;
            return (
              <motion.div
                key={b.t}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + k * 0.08, duration: 0.6 }}
                whileHover={{ y: -8, rotate: k % 2 ? 0.6 : -0.6 }}
                className="rounded-[28px] p-7 shadow-lg"
                style={{ background: b.bg, color: b.dark ? "#fff" : "#0a2642" }}
              >
                <span className={cn("flex h-14 w-14 items-center justify-center rounded-2xl", b.dark ? "bg-white/20" : "bg-white")}>
                  <I className="h-7 w-7" style={{ color: b.dark ? "#fff" : "#0a2642" }} />
                </span>
                <h3 className="mt-6 font-heading text-2xl font-extrabold leading-tight">{b.t}</h3>
                <p className={cn("mt-2 text-[15px] leading-relaxed", b.dark ? "text-white/85" : "text-[#0a2642]/75")}>{b.p}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ───────── CEREBRO ───────── */}
      <section className="bg-[#f6f8fa] py-20">
        <motion.div {...aparecer} className="mx-auto max-w-3xl px-5 text-center">
          <Pill>Todo en un solo lugar</Pill>
          <h2 className="mt-5 font-heading text-4xl font-extrabold md:text-6xl">
            Todo empieza en <span style={{ color: CORAL }}>el cerebro</span>
          </h2>
          <p className="mt-4 text-lg text-[#0a2642]/65">Los documentos clave de tu negocio hacen que cada tarea salga como si la hubiera hecho alguien de tu equipo.</p>
        </motion.div>
        <motion.div {...aparecer} className="mx-auto mt-12 grid max-w-6xl overflow-hidden rounded-[32px] border border-[#0a2642]/8 bg-white shadow-xl shadow-[#0a2642]/5 md:grid-cols-2">
          <div className="p-8 md:p-12">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: `${CORAL}22` }}>
              <Brain className="h-7 w-7" style={{ color: CORAL }} />
            </span>
            <h3 className="mt-6 font-heading text-3xl font-extrabold">El cerebro que trabaja como tú</h3>
            <p className="mt-3 text-lg text-[#0a2642]/65">Aprende tu marca, tu tono y tus objetivos. Entre más lo usas, mejor te conoce.</p>
            <ul className="mt-6 space-y-3">
              {["Tu marca, tono y propuesta de valor", "Cliente ideal y objetivos de negocio", "Servicios, ofertas y precios", "Lo que ya funcionó en tus campañas"].map((t) => (
                <li key={t} className="flex items-center gap-3 font-medium">
                  <Check className="h-5 w-5 rounded-full border-2 p-0.5" style={{ color: CORAL, borderColor: CORAL }} /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3 bg-[#fbfcfd] p-8 md:p-12">
            {CEREBRO.map((c, k) => {
              const I = c.i;
              return (
                <motion.div
                  key={c.doc}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + k * 0.1 }}
                  whileHover={{ x: 6 }}
                  className="flex items-center justify-between rounded-2xl border border-[#0a2642]/8 bg-white px-5 py-4 shadow-sm"
                >
                  <span className="flex items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${CORAL}1f` }}>
                      <I className="h-5 w-5" style={{ color: CORAL }} />
                    </span>
                    <span>
                      <span className="block font-bold">{c.doc}</span>
                      <span className="text-sm text-[#0a2642]/50">{c.tag}</span>
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#0a2642]/30" />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ───────── DE UNA IDEA A PIEZAS ───────── */}
      <section className="mx-auto max-w-6xl px-5 py-24 md:px-8">
        <motion.div {...aparecer} className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-4xl font-extrabold md:text-6xl">
            De una idea a piezas <span style={{ color: CORAL }}>listas, desde el chat</span>
          </h2>
          <p className="mt-4 text-lg text-[#0a2642]/65">Describe lo que necesitas y tu equipo prepara guiones, campañas y diseños alineados con tu marca.</p>
        </motion.div>
        <div className="mt-14 grid items-center gap-10 md:grid-cols-2">
          <motion.div {...aparecer}>
            <h3 className="font-heading text-2xl font-extrabold">Tu equipo creativo, listo cuando lo necesites</h3>
            <ul className="mt-6 space-y-4">
              {[
                { t: "Guiones de reels con gancho y escenas", i: PenLine },
                { t: "Carruseles y piezas para redes", i: Images },
                { t: "Anuncios y estructura de campañas", i: Megaphone },
                { t: "Logo y manual de marca (sin IA de imágenes)", i: Sparkles },
              ].map(({ t, i: I }) => (
                <li key={t} className="flex items-center gap-4 text-lg font-medium">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${CORAL}1f` }}>
                    <I className="h-5 w-5" style={{ color: CORAL }} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div {...aparecer} className="overflow-hidden rounded-[28px] border border-[#0a2642]/10 bg-white shadow-2xl shadow-[#0a2642]/10">
            <div className="flex items-center gap-2 border-b border-[#0a2642]/8 px-5 py-3">
              <span className="h-3 w-3 rounded-full" style={{ background: CORAL }} />
              <span className="h-3 w-3 rounded-full bg-[#ffd96a]" />
              <span className="h-3 w-3 rounded-full bg-[#d6dde4]" />
              <span className="ml-2 text-sm font-semibold text-[#0a2642]/50">biwov Agentes · Chat</span>
            </div>
            <div className="space-y-4 p-6">
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm px-4 py-3 text-[15px] font-medium text-white" style={{ background: CORAL }}>
                Créame una campaña de lanzamiento: un carrusel, un anuncio y 3 guiones.
              </div>
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="flex gap-3">
                <Avatar id="allen" size={40} />
                <div>
                  <p className="text-[15px]">¡Listo! Ogilvy, Bárbara y Scher prepararon estas piezas con tu marca. Quedan esperando tu aprobación:</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      { t: "Carrusel", bg: AMARILLO, r: -3 },
                      { t: "Anuncio", bg: CORAL, r: 2, w: true },
                      { t: "3 guiones", bg: MENTA, r: -1 },
                    ].map((c, k) => (
                      <motion.span
                        key={c.t}
                        initial={{ opacity: 0, y: 14, rotate: 0 }}
                        whileInView={{ opacity: 1, y: 0, rotate: c.r }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.9 + k * 0.15, type: "spring" }}
                        className="rounded-2xl px-5 py-3 font-bold shadow-md"
                        style={{ background: c.bg, color: c.w ? "#fff" : "#0a2642" }}
                      >
                        {c.t}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────── EJEMPLOS (en movimiento) ───────── */}
      <section id="ejemplos" className="scroll-mt-20 bg-[#f6f8fa] py-20">
        <motion.div {...aparecer} className="mx-auto max-w-4xl px-5 text-center">
          <h2 className="font-heading text-4xl font-extrabold md:text-6xl">Así se ven las entregas de tu equipo</h2>
          <p className="mt-4 text-[#0a2642]/60">Ejemplos con marcas ficticias para que veas el tipo de trabajo. Los de tu marca salen con tu información.</p>
        </motion.div>
        <div className="relative mt-12 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
          <motion.div className="flex w-max gap-5 px-5" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 45, repeat: Infinity, ease: "linear" }}>
            {[...EJEMPLOS, ...EJEMPLOS].map((e, k) => (
              <div key={k} className={cn("relative flex h-[340px] w-[280px] flex-none flex-col rounded-[28px] p-6 shadow-lg", e.fondo)}>
                <span className="absolute right-4 top-4 rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0a2642]/60">Ejemplo</span>
                <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: CORAL }}>
                  {e.tipo}
                </span>
                <span className="mt-1 text-sm font-semibold text-[#0a2642]/50">{e.marca}</span>
                <p className="mt-6 font-heading text-2xl font-extrabold leading-tight">{e.titulo}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0a2642]/50">{e.pie}</span>
                  <span className="h-1.5 w-12 rounded-full bg-[#00c2e8]" />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────── EQUIPO ───────── */}
      <section id="equipo" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24 md:px-8">
        <motion.div {...aparecer} className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-4xl font-extrabold md:text-6xl">Conoce a tu equipo de {AGENTES.length} expertos en IA</h2>
          <p className="mt-4 text-lg text-[#0a2642]/65">Cada agente domina su especialidad y Allen los coordina para ejecutar tu marketing 360°.</p>
        </motion.div>
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {AGENTES.map((a, k) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (k % 5) * 0.06 }}
              whileHover={{ y: -8 }}
              className={cn("relative flex flex-col items-center rounded-3xl border px-4 py-7 text-center transition-shadow hover:shadow-xl", a.lider ? "border-transparent bg-[#0a2642] text-white" : "border-[#0a2642]/8 bg-white")}
            >
              {a.nuevo && <span className="absolute -top-3 rounded-full bg-[#0a2642] px-3 py-0.5 text-[11px] font-bold text-white">NUEVO</span>}
              <Avatar id={a.id} size={88} className={cn("ring-4", a.lider ? "ring-[#ff7a59]/60" : "ring-[#f1f4f7]")} />
              <p className="mt-4 font-heading text-lg font-extrabold">{a.nombre}</p>
              <p className={cn("mt-1 text-sm", a.lider ? "text-white/70" : "text-[#0a2642]/55")}>{a.rol}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────── OFICINA ───────── */}
      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        <motion.div {...aparecer} className="mb-10 grid items-end gap-6 md:grid-cols-2">
          <div>
            <Pill>Tu propia oficina</Pill>
            <h2 className="mt-4 font-heading text-4xl font-extrabold md:text-5xl">Una oficina para tu marca, con tu equipo trabajando</h2>
          </div>
          <p className="text-lg text-[#0a2642]/65">Cada cliente tiene su oficina de agentes: ves quién está trabajando, qué entregó y qué espera tu aprobación. También te avisan por Telegram, desde el celular.</p>
        </motion.div>
        <motion.div {...aparecer}>
          <Oficina />
        </motion.div>
      </section>

      {/* ───────── BENTO EQUIPO ───────── */}
      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        <motion.div {...aparecer} className="relative overflow-hidden rounded-[32px] p-8 text-white md:p-12" style={{ background: CORAL }}>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-xl">
              <Users className="h-10 w-10 rounded-2xl bg-white/20 p-2" />
              <h3 className="mt-5 font-heading text-4xl font-extrabold">{AGENTES.length} agentes de IA</h3>
              <p className="mt-3 text-lg text-white/90">Tu equipo completo, listo cuando lo necesites y sin nómina. Entrenados con los métodos de biwov.</p>
            </div>
            <div className="flex -space-x-4">
              {AGENTES.slice(0, 5).map((a) => (
                <Avatar key={a.id} id={a.id} size={68} className="ring-4 ring-[#ff7a59]" />
              ))}
              <span className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-white font-heading text-lg font-extrabold text-[#0a2642] ring-4 ring-[#ff7a59]">+{AGENTES.length - 5}</span>
            </div>
          </div>
        </motion.div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            { t: "Tareas en una frase", p: "Haz en minutos lo que antes tomaba horas.", bg: AMARILLO, i: ListChecks },
            { t: "Flujos inteligentes", p: "El coordinador reparte el trabajo entre especialistas.", bg: "#0a2642", dark: true, i: Workflow },
            { t: "Memoria que aprende", p: "Recuerda tu marca y mejora con cada aprobación.", bg: MENTA, i: Brain },
          ].map((b, k) => {
            const I = b.i;
            return (
              <motion.div key={b.t} {...aparecer} transition={{ ...aparecer.transition, delay: k * 0.08 }} whileHover={{ y: -6 }} className="rounded-[28px] p-8" style={{ background: b.bg, color: b.dark ? "#fff" : "#0a2642" }}>
                <span className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", b.dark ? "bg-white/15" : "bg-white/60")}>
                  <I className="h-6 w-6" style={{ color: b.dark ? CORAL : "#0a2642" }} />
                </span>
                <h3 className="mt-5 font-heading text-2xl font-extrabold">{b.t}</h3>
                <p className={cn("mt-2", b.dark ? "text-white/75" : "text-[#0a2642]/75")}>{b.p}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ───────── POR QUÉ ───────── */}
      <section className="bg-[#f6f8fa] py-24">
        <motion.div {...aparecer} className="mx-auto max-w-3xl px-5 text-center">
          <h2 className="font-heading text-4xl font-extrabold md:text-6xl">¿Por qué no se parece a ninguna otra IA?</h2>
          <p className="mt-4 text-lg text-[#0a2642]/65">La mayoría de herramientas responden a lo que les pides. Tu equipo ya sabe qué hacer, cómo y cuándo.</p>
        </motion.div>
        <div className="mx-auto mt-14 grid max-w-6xl gap-5 px-5 md:grid-cols-3 md:px-8">
          {POR_QUE.map((d, k) => {
            const I = d.i;
            return (
              <motion.div key={d.t} {...aparecer} transition={{ ...aparecer.transition, delay: (k % 3) * 0.08 }} whileHover={{ y: -6 }} className="rounded-[28px] border border-[#0a2642]/8 bg-white p-8 shadow-sm">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: `${CORAL}1f` }}>
                  <I className="h-6 w-6" style={{ color: CORAL }} />
                </span>
                <h3 className="mt-6 font-heading text-xl font-extrabold">{d.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#0a2642]/65">{d.p}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ───────── BANDA OSCURA ───────── */}
      <section className="relative overflow-hidden bg-[#0b1320] py-24 text-center text-white">
        <div className="mx-auto flex max-w-md justify-center gap-3">
          {[
            { t: "Carrusel", bg: AMARILLO, r: -6, c: "#0a2642" },
            { t: "Anuncio", bg: CORAL, r: 0, c: "#fff" },
            { t: "Guion", bg: MENTA, r: 6, c: "#0a2642" },
          ].map((c, k) => (
            <motion.span key={c.t} animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, delay: k * 0.4 }} className="rounded-2xl px-6 py-3 font-bold shadow-xl" style={{ background: c.bg, color: c.c, rotate: c.r }}>
              {c.t}
            </motion.span>
          ))}
        </div>
        <motion.h2 {...aparecer} className="mx-auto mt-10 max-w-3xl px-5 font-heading text-4xl font-extrabold md:text-6xl">
          Recupera tu tiempo <span style={{ color: CORAL }}>cada semana</span>
        </motion.h2>
        <p className="mx-auto mt-5 max-w-xl px-5 text-lg text-white/70">Tu equipo de agentes prepara el trabajo; tú te enfocas en lo que solo tú puedes hacer: hacer crecer tu negocio.</p>
        <a href="#planes" className="mt-9 inline-flex items-center gap-2 rounded-full px-8 py-4 font-bold text-white transition-transform hover:-translate-y-0.5" style={{ background: CORAL }}>
          Empezar ahora <ArrowRight className="h-5 w-5" />
        </a>
      </section>

      {/* ───────── PLANES ───────── */}
      <section id="planes" className="scroll-mt-20 bg-[#fff6f2] py-24">
        <motion.div {...aparecer} className="mx-auto max-w-3xl px-5 text-center">
          <Pill>Planes de precio</Pill>
          <h2 className="mt-5 font-heading text-4xl font-extrabold md:text-6xl">
            Elige el plan que mejor <span style={{ color: CORAL }}>se adapte a ti</span>
          </h2>
          <p className="mt-4 text-lg text-[#0a2642]/65">Ambos te dan tu equipo de agentes. Solo uno incluye diseñadora de marca, radar y acompañamiento mensual.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <div className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 font-semibold shadow-sm">
              <span className={anual ? "text-[#0a2642]/40" : "text-[#0a2642]"}>Mensual</span>
              <button type="button" aria-label="Cambiar entre mensual y anual" onClick={() => setAnual((v) => !v)} className="relative h-7 w-12 rounded-full transition-colors" style={{ background: anual ? CORAL : "#0a264226" }}>
                <motion.span layout className={cn("absolute top-1 h-5 w-5 rounded-full bg-white shadow", anual ? "right-1" : "left-1")} />
              </button>
              <span className={anual ? "text-[#0a2642]" : "text-[#0a2642]/40"}>Anual</span>
              <span className="rounded-full px-2 py-0.5 text-xs font-bold text-white" style={{ background: CORAL }}>
                -{Math.round(dtoAnual * 100)}%
              </span>
            </div>
            <div className="inline-flex rounded-full bg-white p-1 text-sm font-semibold shadow-sm">
              {(["COP", "USD"] as Moneda[]).map((m) => (
                <button key={m} type="button" onClick={() => setMoneda(m)} className={cn("rounded-full px-4 py-1.5", moneda === m ? "bg-[#0a2642] text-white" : "text-[#0a2642]/60")}>
                  {m === "COP" ? "Pesos" : "Dólares"}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 px-5 md:grid-cols-2 md:px-8">
          {planes.map((p, k) => (
            <motion.div
              key={p.slug}
              {...aparecer}
              transition={{ ...aparecer.transition, delay: k * 0.1 }}
              className={cn("relative flex flex-col rounded-[32px] bg-white p-9", p.destacado ? "border-2 shadow-xl" : "shadow-sm")}
              style={p.destacado ? { borderColor: CORAL } : undefined}
            >
              {p.destacado && (
                <span className="absolute left-9 top-0 -translate-y-1/2 rounded-full px-4 py-1 text-xs font-bold text-white" style={{ background: CORAL }}>
                  ★ RECOMENDADO
                </span>
              )}
              <h3 className="font-heading text-3xl font-extrabold">{p.nombre.replace("biwov Agentes · ", "")}</h3>
              <p className="mt-2 text-[#0a2642]/55">{p.gancho}</p>
              <p className="mt-6 font-heading text-5xl font-extrabold tracking-tight md:text-6xl">
                {precio(p.precio, p.usd)}
                <span className="text-lg font-semibold text-[#0a2642]/45">{anual ? " /año" : " /mes"}</span>
              </p>
              {anual && (
                <p className="mt-1 text-sm font-semibold" style={{ color: CORAL }}>
                  Ahorras el {Math.round(dtoAnual * 100)}% pagando el año
                </p>
              )}
              {p.adicional && (
                <p className="mt-2 text-sm text-[#0a2642]/60">
                  + {p.adicional.label}: {formatCopEnMoneda(p.adicional.precio, moneda, trm)}
                </p>
              )}
              <div className="my-6 h-px bg-[#0a2642]/10" />
              <ul className="flex-1 space-y-3">
                {p.incluye.flatMap((g) => g.items).map((it) => (
                  <li key={it} className="flex gap-3 text-[15px]">
                    <Check className="mt-0.5 h-5 w-5 flex-none rounded-full border-2 p-0.5" style={{ color: CORAL, borderColor: CORAL }} /> {it}
                  </li>
                ))}
              </ul>
              <a href={waBiwov(p.mensajeWhatsApp)} target="_blank" rel="noopener noreferrer" className="mt-8 rounded-full px-6 py-4 text-center font-bold uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5" style={{ background: CORAL }}>
                Activar {p.nombre.replace("biwov Agentes · ", "")}
              </a>
              <p className="mt-3 text-center text-xs text-[#0a2642]/50">
                {anual ? "Pago anual por adelantado." : `Mensual. Permanencia mínima de ${MESES_MINIMOS} meses.`} {p.costosTerceros[0]}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div {...aparecer} className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-sm">
          <table className="w-full text-left text-[15px]">
            <thead>
              <tr className="border-b border-[#0a2642]/8">
                <th className="px-6 py-5 font-heading text-lg font-extrabold">Comparar planes</th>
                <th className="px-4 py-5 text-center font-heading font-extrabold">Esencial</th>
                <th className="bg-[#fff6f2] px-4 py-5 text-center font-heading font-extrabold" style={{ color: CORAL }}>
                  Pro
                </th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["Marcas", "1", "Hasta 3"],
                  ["Estratega, guionista, copywriter, creativo y analista", true, true],
                  ["Scher · diseñadora de marca", false, true],
                  ["Bárbara · trafficker, auditor y seguimiento", false, true],
                  ["Toffler · radar semanal de novedades", false, true],
                  ["Avisos y tareas por Telegram", false, true],
                  ["Reunión mensual con Kathe", false, true],
                ] as [string, string | boolean, string | boolean][]
              ).map(([f, e, p]) => (
                <tr key={f} className="border-b border-[#0a2642]/6 last:border-0">
                  <td className="px-6 py-4">{f}</td>
                  {[e, p].map((v, i) => (
                    <td key={i} className={cn("px-4 py-4 text-center", i === 1 && "bg-[#fff6f2]")}>
                      {typeof v === "string" ? <span className="font-semibold">{v}</span> : v ? <Check className="mx-auto h-5 w-5" style={{ color: CORAL }} /> : <X className="mx-auto h-5 w-5 text-[#0a2642]/25" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
        <p className="mt-8 px-5 text-center text-[#0a2642]/65">
          ¿Prefieres que nuestro equipo lo haga todo por ti?{" "}
          <Link href="/planes/agencia-completa" className="inline-flex items-center gap-1 font-bold text-[#0a2642] underline underline-offset-4">
            Mira el plan Agencia Completa <ArrowRight className="h-4 w-4" />
          </Link>
        </p>
      </section>

      {/* ───────── TRABAJOS REALES ───────── */}
      <section className="mx-auto max-w-6xl px-5 py-24 md:px-8">
        <motion.div {...aparecer} className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-4xl font-extrabold md:text-5xl">Trabajos reales de biwov</h2>
          <p className="mt-4 text-[#0a2642]/65">Proyectos que ya hicimos para nuestros clientes. Los testimonios de biwov Agentes los publicaremos con la autorización de cada cliente.</p>
        </motion.div>
        <motion.div {...aparecer} className="mt-12 grid items-center gap-8 overflow-hidden rounded-[32px] bg-[#0a2642] p-6 text-white md:grid-cols-2 md:p-10">
          <div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#8fdff0]">Caso real</span>
            <h3 className="mt-4 font-heading text-3xl font-extrabold">Fashion Lash</h3>
            <p className="mt-3 text-white/75">Tienda en línea y chatbot de WhatsApp para atender a sus clientas al instante. Hecho por biwov.</p>
          </div>
          <div className="relative h-64 overflow-hidden rounded-2xl md:h-72">
            <Image src="/casos/fashion-lash-desktop.webp" alt="Sitio web de Fashion Lash hecho por biwov" fill className="object-cover object-top" />
          </div>
        </motion.div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="bg-[#f6f8fa] py-24">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <motion.h2 {...aparecer} className="text-center font-heading text-4xl font-extrabold md:text-5xl">
            Preguntas frecuentes
          </motion.h2>
          <div className="mt-10 space-y-3">
            {FAQ.map((f) => (
              <Pregunta key={f.q} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────── CTA FINAL ───────── */}
      <section className="relative overflow-hidden py-24 text-center">
        <div className="flex justify-center -space-x-3">
          {AGENTES.slice(0, 7).map((a, k) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: k * 0.06 }}>
              <Avatar id={a.id} size={64} className="ring-4 ring-white" />
            </motion.div>
          ))}
        </div>
        <motion.h2 {...aparecer} className="mx-auto mt-8 max-w-3xl px-5 font-heading text-4xl font-extrabold md:text-6xl">
          Empieza a ejecutar tu marketing hoy
        </motion.h2>
        <p className="mx-auto mt-5 max-w-xl px-5 text-lg text-[#0a2642]/65">Tu equipo de agentes, con la memoria de tu marca, listo para trabajar contigo.</p>
        <a href={waBiwov(MSG)} target="_blank" rel="noopener noreferrer" className="mt-9 inline-flex items-center gap-2 rounded-full px-9 py-4 font-bold text-white shadow-xl transition-transform hover:-translate-y-0.5" style={{ background: CORAL }}>
          Quiero mi agencia de agentes <ArrowRight className="h-5 w-5" />
        </a>
      </section>

      <FooterClaro />
    </div>
  );
}
