"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const LIMA = "#c6f432";
const CIAN = "#00c2e8";
const DURACION = 6000;

/** Capítulos del video: cada uno es una pantalla real del portal del cliente. */
const ESCENAS = [
  { tab: "Inicio", t: "Entras a tu oficina", p: "Ves el avance, la etapa de tu proyecto y lo que espera tu aprobación." },
  { tab: "Pedir a mi equipo", t: "Pides en una frase", p: "Escribes lo que necesitas, como le hablarías a tu equipo." },
  { tab: "Inicio", t: "Tu equipo trabaja", p: "Allen reparte el trabajo y ves en vivo quién está trabajando." },
  { tab: "Entregas", t: "Revisas y apruebas", p: "Lees la entrega completa y la apruebas o pides cambios." },
  { tab: "Mi equipo", t: "Te avisan al celular", p: "Cada entrega y cada pregunta te llega por Telegram." },
];
const TABS = ["Inicio", "Pedir a mi equipo", "Entregas", "Plan de trabajo", "Mi marca", "Mi equipo"];
const PEDIDO = "Necesito 3 guiones de reels para lanzar el café de temporada.";

const Av = ({ id, s = 28 }: { id: string; s?: number }) => (
  <Image src={`/agentes/${id}.svg`} alt="" width={s} height={s} className="flex-none rounded-full bg-white" unoptimized />
);

/** Cursor animado: va a (x, y) en % de la pantalla y hace clic. */
function Cursor({ ruta }: { ruta: { x: number; y: number; t: number; clic?: boolean }[] }) {
  return (
    <motion.div
      className="pointer-events-none absolute z-20"
      initial={{ left: `${ruta[0].x}%`, top: `${ruta[0].y}%` }}
      animate={{ left: ruta.map((r) => `${r.x}%`), top: ruta.map((r) => `${r.y}%`), scale: ruta.map((r) => (r.clic ? 0.75 : 1)) }}
      transition={{ duration: DURACION / 1000 - 0.4, times: ruta.map((r) => r.t), ease: "easeInOut" }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" className="drop-shadow-lg">
        <path d="M4 2l16 9-7 2-3 7z" fill="#fff" stroke="#0a2642" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}

const Pill = ({ c, children, dot }: { c: "lima" | "cian" | "ok" | "gris"; children: React.ReactNode; dot?: boolean }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-extrabold md:text-[10px]",
      c === "lima" && "bg-[#c6f432] text-[#0a2642]",
      c === "cian" && "bg-[#d9f6fd] text-[#00708f]",
      c === "ok" && "bg-[#ecfccb] text-[#3f6212]",
      c === "gris" && "bg-[#e2e8f0] text-[#475569]",
    )}
  >
    {dot && <motion.i className="h-1.5 w-1.5 rounded-full bg-current" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }} />}
    {children}
  </span>
);

function PantallaInicio() {
  return (
    <div className="space-y-2 p-3 md:space-y-3 md:p-4">
      <div className="flex items-center justify-between rounded-xl bg-[linear-gradient(120deg,#0a2642,#12355a_60%,#0089b3)] p-3 text-white md:p-4">
        <div>
          <p className="text-[9px] font-bold text-[#8fdff0] md:text-[11px]">Hola, Laura 👋</p>
          <p className="max-w-[260px] font-heading text-xs font-extrabold leading-tight md:text-base">Tu equipo de agentes está trabajando para Café Andino</p>
          <motion.span animate={{ scale: [1, 1, 0.9, 1] }} transition={{ duration: 0.5, delay: 4.6 }} className="mt-2 inline-block rounded-full bg-[#c6f432] px-3 py-1 text-[9px] font-extrabold text-[#0a2642] md:text-[11px]">
            ✦ Pedirle algo a mi equipo
          </motion.span>
        </div>
        <svg viewBox="0 0 120 120" className="h-14 w-14 md:h-20 md:w-20">
          <circle cx="60" cy="60" r="50" stroke="#ffffff22" strokeWidth="12" fill="none" />
          <motion.circle cx="60" cy="60" r="50" stroke={LIMA} strokeWidth="12" fill="none" strokeLinecap="round" transform="rotate(-90 60 60)" initial={{ strokeDasharray: "0 314" }} animate={{ strokeDasharray: "141 314" }} transition={{ duration: 1.6, delay: 0.3 }} />
          <text x="60" y="68" textAnchor="middle" fill="#fff" fontSize="26" fontWeight="800">45%</text>
        </svg>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["Propuesta", "Estrategia", "Producción", "Revisión", "Publicado", "Seguim.", "Cerrado"].map((e, i) => (
          <div key={e} className={cn("truncate rounded-md px-1 py-1 text-center text-[7px] font-bold md:text-[9px]", i < 2 ? "bg-white text-[#0a2642]" : i === 2 ? "bg-[#0a2642] text-white" : "bg-white/70 text-[#0a2642]/40")}>
            {i < 2 ? "✓ " : ""}{e}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {[["2", "Por aprobar", "bg-[#c6f432]"], ["3", "En proceso", "bg-[#d9f6fd]"], ["14", "Aprobadas", "bg-white"], ["6/11", "Plan del mes", "bg-white"]].map(([n, l, c], k) => (
          <motion.div key={l} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + k * 0.12 }} className={cn("rounded-lg p-2", c)}>
            <b className="block font-heading text-sm md:text-lg">{n}</b>
            <span className="text-[8px] font-semibold text-[#0a2642]/60 md:text-[10px]">{l}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PantallaPedir() {
  return (
    <div className="grid h-full gap-2 p-3 md:grid-cols-[1.5fr_1fr] md:p-4">
      <div className="rounded-xl bg-white p-3">
        <p className="font-heading text-sm font-extrabold md:text-lg">¿Qué necesitas hoy?</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {["Guiones de reels", "Carrusel", "Campaña en Meta", "Plan del mes"].map((c, k) => (
            <motion.span key={c} animate={k === 0 ? { backgroundColor: ["#eef9fd", "#eef9fd", LIMA] } : {}} transition={{ duration: 1.4, times: [0, 0.7, 1] }} className="rounded-full border border-[#00c2e840] bg-[#eef9fd] px-2 py-0.5 text-[8px] font-bold md:text-[10px]">
              {c}
            </motion.span>
          ))}
        </div>
        <div className="mt-2 min-h-[48px] rounded-lg border-2 border-[#00c2e8] p-2 text-[10px] md:min-h-[64px] md:text-xs">
          {PEDIDO.split("").map((c, k) => (
            <motion.span key={k} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 + k * 0.035 }}>
              {c}
            </motion.span>
          ))}
        </div>
        <motion.span animate={{ scale: [1, 1, 0.9, 1] }} transition={{ duration: 0.4, delay: 4.7 }} className="mt-2 inline-block rounded-full bg-[#c6f432] px-3 py-1 text-[9px] font-extrabold md:text-[11px]">
          Enviar a mi equipo →
        </motion.span>
      </div>
      <div className="hidden rounded-xl bg-[#0a2642] p-3 text-white md:block">
        <p className="text-xs font-extrabold">Así funciona</p>
        {["Pides en una frase", "Allen reparte el trabajo", "Los agentes leen tu marca", "Tú apruebas"].map((s, i) => (
          <div key={s} className="mt-2 flex items-center gap-2 text-[10px] font-semibold">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#c6f432] text-[9px] font-extrabold text-[#0a2642]">{i + 1}</span>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

function PantallaTrabajando() {
  const filas = [
    { id: "allen", n: "Allen", t: "Repartir: 3 guiones de reels", e: "ok" as const, l: "Listo ✓", d: 0.3 },
    { id: "ogilvy", n: "Ogilvy", t: "3 guiones · café de temporada", e: "cian" as const, l: "Trabajando", d: 1.1 },
    { id: "scher", n: "Scher", t: "Portadas para los 3 reels", e: "cian" as const, l: "Trabajando", d: 1.8 },
    { id: "barbara", n: "Bárbara", t: "Copys para pauta", e: "gris" as const, l: "En cola", d: 2.5 },
  ];
  return (
    <div className="p-3 md:p-4">
      <div className="rounded-xl bg-white p-3">
        <p className="font-heading text-sm font-extrabold md:text-base">Tu equipo ahora</p>
        {filas.map((f) => (
          <motion.div key={f.id} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: f.d }} className="flex items-center gap-2 border-b border-[#0a2642]/5 py-2 last:border-0">
            <Av id={f.id} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-bold md:text-xs">{f.t}</p>
              <p className="text-[9px] text-[#0a2642]/50">{f.n}</p>
            </div>
            <Pill c={f.e} dot={f.e === "cian"}>{f.l}</Pill>
          </motion.div>
        ))}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.4 }} className="mt-1 text-center text-[9px] text-[#0a2642]/45">
          Leyendo: ficha de marca · cliente ideal · precios · plan del mes
        </motion.p>
      </div>
    </div>
  );
}

function PantallaEntregas() {
  return (
    <div className="space-y-2 p-3 md:p-4">
      <div className="flex gap-1">
        {["Para revisar 2", "En proceso 1", "Aprobadas 14"].map((f, i) => (
          <span key={f} className={cn("rounded-full px-2 py-0.5 text-[8px] font-bold md:text-[10px]", i === 0 ? "bg-[#0a2642] text-white" : "bg-white text-[#0a2642]/60")}>{f}</span>
        ))}
      </div>
      <div className="rounded-xl bg-white p-3">
        <div className="flex items-center gap-2">
          <Av id="ogilvy" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-bold md:text-xs">3 guiones · café de temporada</p>
            <p className="text-[9px] text-[#0a2642]/50">Ogilvy · hoy</p>
          </div>
          <motion.span initial={{ opacity: 1 }} animate={{ opacity: [1, 1, 0] }} transition={{ duration: 4.4, times: [0, 0.97, 1] }}>
            <Pill c="lima">Lista para aprobar</Pill>
          </motion.span>
        </div>
        <div className="mt-2 space-y-1 border-t border-[#0a2642]/5 pt-2 text-[9px] leading-snug md:text-[11px]">
          <p className="font-heading font-extrabold">Guion 1 · Gancho</p>
          <p>«Tu café no se enfría por la mañana. Se enfría por la falta de rito.»</p>
          <p className="text-[#0a2642]/55">Escena 1: taza humeante en primer plano · Escena 2: la mano que muele el grano…</p>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <motion.span animate={{ scale: [1, 1, 0.88, 1] }} transition={{ duration: 0.4, delay: 4.1 }} className="rounded-full bg-[#c6f432] px-3 py-1 text-[9px] font-extrabold md:text-[11px]">✓ Aprobar</motion.span>
          <span className="rounded-full border border-[#0a2642]/20 px-3 py-1 text-[9px] font-bold md:text-[11px]">Pedir cambios</span>
          <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 4.5, type: "spring" }} className="ml-auto">
            <Pill c="ok">Aprobada ✓</Pill>
          </motion.span>
        </div>
      </div>
    </div>
  );
}

function PantallaTelegram() {
  return (
    <div className="grid h-full grid-cols-2 items-center gap-3 p-3 md:p-4">
      <div className="grid grid-cols-2 gap-1.5">
        {[["allen", "Allen"], ["ogilvy", "Ogilvy"], ["scher", "Scher"], ["barbara", "Bárbara"]].map(([id, n], k) => (
          <div key={id} className={cn("flex flex-col items-center rounded-lg p-2", k === 0 ? "bg-[#0a2642] text-white" : "bg-white")}>
            <Av id={id} s={30} />
            <p className="mt-1 text-[9px] font-bold">{n}</p>
            {k === 1 ? <Pill c="cian" dot>En tu proyecto</Pill> : <Pill c="gris">Disponible</Pill>}
          </div>
        ))}
      </div>
      <motion.div initial={{ y: 40, opacity: 0, rotate: 4 }} animate={{ y: 0, opacity: 1, rotate: 0 }} transition={{ delay: 0.6, type: "spring" }} className="mx-auto w-[130px] rounded-[22px] border-4 border-[#0a2642] bg-[#e7f3ea] p-2 shadow-2xl md:w-[160px]">
        <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-[#0a2642]/30" />
        {[
          { t: "Ogilvy terminó \"3 guiones · café de temporada\". Está esperando tu aprobación.", d: 1.2 },
          { t: "✓ Aprobaste los guiones. Bárbara prepara los copys para la pauta.", d: 2.6 },
        ].map((m) => (
          <motion.div key={m.t} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: m.d }} className="mb-1.5 flex gap-1 rounded-lg bg-white p-1.5 text-[7.5px] leading-snug shadow md:text-[9px]">
            <span className="flex h-4 w-4 flex-none items-center justify-center rounded-full bg-[#229ED9] text-white"><Send className="h-2 w-2" /></span>
            {m.t}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

const PANTALLAS = [PantallaInicio, PantallaPedir, PantallaTrabajando, PantallaEntregas, PantallaTelegram];
const RUTAS = [
  [{ x: 70, y: 80, t: 0 }, { x: 30, y: 45, t: 0.6 }, { x: 18, y: 41, t: 0.78, clic: true }, { x: 18, y: 41, t: 1 }],
  [{ x: 20, y: 40, t: 0 }, { x: 14, y: 40, t: 0.18, clic: true }, { x: 40, y: 60, t: 0.6 }, { x: 15, y: 78, t: 0.8, clic: true }, { x: 15, y: 78, t: 1 }],
  [{ x: 15, y: 80, t: 0 }, { x: 80, y: 55, t: 0.5 }, { x: 85, y: 70, t: 1 }],
  [{ x: 70, y: 30, t: 0 }, { x: 40, y: 70, t: 0.5 }, { x: 13, y: 80, t: 0.7, clic: true }, { x: 13, y: 80, t: 1 }],
  [{ x: 30, y: 70, t: 0 }, { x: 70, y: 50, t: 0.6 }, { x: 72, y: 52, t: 1 }],
];

/** "Video" de la plataforma por dentro: las pantallas del portal del cliente con una marca ficticia. */
export function DemoAgencia() {
  const [n, setN] = useState(0);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (pausado) return;
    const t = setTimeout(() => setN((v) => (v + 1) % ESCENAS.length), DURACION);
    return () => clearTimeout(t);
  }, [n, pausado]);

  const Pantalla = PANTALLAS[n];
  return (
    <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
      <div className="overflow-hidden rounded-3xl border border-[#0a2642]/10 bg-[#0a2642] shadow-2xl shadow-[#0a2642]/25">
        {/* barra del navegador */}
        <div className="flex items-center gap-2 bg-[#061a2e] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: CIAN }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: LIMA }} />
          <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
          <span className="ml-3 flex-1 truncate rounded-md bg-white/10 px-3 py-1 text-[10px] text-white/60">biwov-oficina.web.app · Oficina de Café Andino</span>
          <button type="button" onClick={() => setPausado((v) => !v)} aria-label={pausado ? "Reproducir" : "Pausar"} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
            {pausado ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          </button>
        </div>
        {/* barra del portal */}
        <div className="flex items-center gap-2 px-4 pt-2.5 text-white">
          <span className="font-heading text-sm font-extrabold">biwov<span style={{ color: LIMA }}>_</span></span>
          <span className="rounded-full bg-white/10 px-2 text-[9px] font-bold">Agentes</span>
          <span className="ml-auto rounded-full bg-[#c6f432] px-2 py-0.5 text-[9px] font-extrabold text-[#0a2642]">? Ayuda</span>
        </div>
        <div className="flex gap-3 overflow-hidden border-b border-white/10 px-4 text-[9px] font-bold text-white/55 md:text-[11px]">
          {TABS.map((t) => (
            <span key={t} className={cn("whitespace-nowrap border-b-2 py-2", t === ESCENAS[n].tab ? "border-[#c6f432] text-white" : "border-transparent")}>
              {t}
              {t === "Entregas" && <span className="ml-1 rounded-full bg-[#c6f432] px-1 text-[8px] text-[#0a2642]">2</span>}
            </span>
          ))}
        </div>
        {/* pantalla */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#f3f7fa] text-[#0a2642]">
          <AnimatePresence mode="wait">
            <motion.div key={n} initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="absolute inset-0">
              <Pantalla />
              {!pausado && <Cursor ruta={RUTAS[n]} />}
            </motion.div>
          </AnimatePresence>
          <span className="absolute bottom-2 right-3 rounded-full bg-white/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#0a2642]/50">Ejemplo · marca ficticia</span>
        </div>
        {/* línea de tiempo */}
        <div className="flex gap-1.5 px-4 py-3">
          {ESCENAS.map((e, k) => (
            <button key={e.t} type="button" aria-label={e.t} onClick={() => setN(k)} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
              {k < n && <span className="block h-full w-full" style={{ background: CIAN }} />}
              {k === n && (
                <motion.span key={`${n}-${pausado}`} className="block h-full" style={{ background: LIMA }} initial={{ width: pausado ? "100%" : "0%" }} animate={{ width: "100%" }} transition={{ duration: pausado ? 0 : DURACION / 1000, ease: "linear" }} />
              )}
            </button>
          ))}
        </div>
      </div>

      <ol className="flex flex-col justify-center gap-2">
        {ESCENAS.map((e, k) => (
          <li key={e.t}>
            <button type="button" onClick={() => setN(k)} className={cn("flex w-full gap-4 rounded-2xl p-4 text-left transition-colors", k === n ? "bg-white shadow-md" : "hover:bg-white/60")}>
              <span className={cn("flex h-9 w-9 flex-none items-center justify-center rounded-full font-heading font-extrabold", k === n ? "text-[#0a2642]" : "bg-[#0a2642]/8 text-[#0a2642]/50")} style={k === n ? { background: LIMA } : undefined}>
                {k + 1}
              </span>
              <span>
                <span className="block font-heading font-extrabold">{e.t}</span>
                <span className="text-sm text-[#0a2642]/60">{e.p}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
