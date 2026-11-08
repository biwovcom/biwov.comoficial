"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  CheckCheck,
  Eye,
  Mail,
  MailOpen,
  MessageCircle,
  MousePointerClick,
  Send,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** Cuenta de 0 al valor final mientras la tarjeta está activa; se reinicia con `ciclo`. */
function useConteo(final: number, activo: boolean, ciclo: number, duracionMs = 1800) {
  const [valor, setValor] = useState(0);
  useEffect(() => {
    if (!activo) return;
    let frame = 0;
    const inicio = performance.now();
    const paso = (t: number) => {
      const p = Math.min(1, (t - inicio) / duracionMs);
      const suave = 1 - Math.pow(1 - p, 3);
      setValor(Math.round(final * suave));
      if (p < 1) frame = requestAnimationFrame(paso);
    };
    frame = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(frame);
  }, [final, activo, ciclo, duracionMs]);
  return activo ? valor : final;
}

/** Reinicia la animación cada `ms` para que se vea como un video en bucle. */
function useCiclo(activo: boolean, ms: number) {
  const [ciclo, setCiclo] = useState(0);
  useEffect(() => {
    if (!activo) return;
    const id = window.setInterval(() => setCiclo((c) => c + 1), ms);
    return () => window.clearInterval(id);
  }, [activo, ms]);
  return ciclo;
}

const num = (n: number) => n.toLocaleString("es-CO");

function Marco({
  icono,
  titulo,
  subtitulo,
  etiqueta,
  etiquetaReal = false,
  children,
}: {
  icono: ReactNode;
  titulo: string;
  subtitulo: string;
  etiqueta: string;
  etiquetaReal?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#071725]">
      <div className="flex items-center gap-3 border-b border-white/[0.07] bg-[#0b2236] px-4 py-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">{icono}</span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{titulo}</p>
          <p className="truncate text-xs text-white/50">{subtitulo}</p>
        </div>
        <span
          className={cn(
            "ml-auto shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em]",
            etiquetaReal ? "bg-accent text-[#03101b]" : "border border-white/15 text-white/60",
          )}
        >
          {etiqueta}
        </span>
      </div>
      <div className="relative flex-1 overflow-hidden p-4 md:p-5">{children}</div>
    </div>
  );
}

/* ---------- Campañas en Meta: caso real de Fashion Lash ---------- */

export function SimulacionCampana({ activo = true }: { activo?: boolean }) {
  const ciclo = useCiclo(activo, 9000);
  const inversion = useConteo(700000, activo, ciclo);
  const ventas = useConteo(5000000, activo, ciclo, 2400);
  const retorno = (ventas / 700000).toFixed(1);

  return (
    <Marco
      icono={<BarChart3 className="h-5 w-5" />}
      titulo="Campaña de ventas · Fashion Lash"
      subtitulo="Administrador de anuncios de Meta"
      etiqueta="Caso real"
      etiquetaReal
    >
      <div className="grid grid-cols-3 gap-2">
        {[
          { l: "Inversión", v: `$${num(inversion)}` },
          { l: "Ventas", v: `$${num(ventas)}` },
          { l: "Retorno", v: `${retorno}x`, destacado: true },
        ].map((k) => (
          <div key={k.l} className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/45">{k.l}</p>
            <p className={cn("mt-1 truncate text-base font-semibold tracking-tight md:text-xl", k.destacado ? "text-accent" : "text-white")}>
              {k.v}
            </p>
          </div>
        ))}
      </div>

      <div className="relative mt-4 h-[45%] rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
        <p className="text-[10px] uppercase tracking-[0.15em] text-white/45">Ventas acumuladas</p>
        <svg viewBox="0 0 300 120" preserveAspectRatio="none" className="absolute inset-x-3 bottom-3 h-[70%] w-[calc(100%-1.5rem)]">
          <defs>
            <linearGradient id="relleno-campana" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#00c2e8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#00c2e8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            key={`a-${ciclo}`}
            d="M0 112 C40 108 60 100 90 92 S150 70 180 56 S240 22 300 8 L300 120 L0 120 Z"
            fill="url(#relleno-campana)"
            initial={{ opacity: 0 }}
            animate={{ opacity: activo ? 1 : 0 }}
            transition={{ duration: 1.6, delay: 0.6 }}
          />
          <motion.path
            key={`l-${ciclo}`}
            d="M0 112 C40 108 60 100 90 92 S150 70 180 56 S240 22 300 8"
            fill="none"
            stroke="#00c2e8"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: activo ? 1 : 0 }}
            transition={{ duration: 2.4, ease: "easeOut" }}
          />
        </svg>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-white/55">
        Con $700 mil COP en pauta, la marca generó $5 millones COP en ventas: cerca de 7 veces lo invertido.
      </p>
    </Marco>
  );
}

/* ---------- GoHighLevel: pipeline de ventas ---------- */

const ETAPAS = ["Nuevo", "Contactado", "Cita", "Ganado"];
const LEADS = [
  { id: "l1", nombre: "Laura M.", origen: "Meta Ads" },
  { id: "l2", nombre: "Andrés P.", origen: "WhatsApp" },
  { id: "l3", nombre: "Sofía R.", origen: "Landing" },
  { id: "l4", nombre: "Camilo T.", origen: "Instagram" },
];
const POSICIONES_INICIALES = [0, 0, 1, 2];

export function SimulacionGHL({ activo = true }: { activo?: boolean }) {
  const [pos, setPos] = useState(POSICIONES_INICIALES);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    if (!activo) return;
    let paso = 0;
    let actual = POSICIONES_INICIALES;
    const id = window.setInterval(() => {
      paso += 1;
      if (actual.every((p) => p === ETAPAS.length - 1)) {
        actual = POSICIONES_INICIALES;
        setPos(actual);
        setAviso("Nuevos interesados entrando desde las campañas");
        return;
      }
      const siguiente = [...actual];
      const i = paso % siguiente.length;
      const idx = siguiente[i] < ETAPAS.length - 1 ? i : siguiente.findIndex((p) => p < ETAPAS.length - 1);
      siguiente[idx] += 1;
      actual = siguiente;
      setPos(siguiente);
      setAviso(
        siguiente[idx] === 1
          ? `Mensaje de bienvenida enviado a ${LEADS[idx].nombre}`
          : siguiente[idx] === 2
            ? `${LEADS[idx].nombre} agendó una cita`
            : `${LEADS[idx].nombre} compró ✅`,
      );
    }, 1700);
    return () => window.clearInterval(id);
  }, [activo]);

  return (
    <Marco
      icono={<Workflow className="h-5 w-5" />}
      titulo="Pipeline de ventas"
      subtitulo="CRM en GoHighLevel"
      etiqueta="Demo"
    >
      <div className="grid h-[78%] grid-cols-4 gap-2">
        {ETAPAS.map((etapa, e) => (
          <div key={etapa} className="flex flex-col rounded-xl border border-white/[0.07] bg-white/[0.02] p-2">
            <p className="mb-2 truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50">
              {etapa} · {pos.filter((p) => p === e).length}
            </p>
            <div className="flex flex-col gap-1.5">
              {LEADS.map((lead, i) =>
                pos[i] === e ? (
                  <motion.div
                    key={lead.id}
                    layoutId={`lead-${lead.id}`}
                    transition={{ type: "spring", stiffness: 260, damping: 26 }}
                    className={cn(
                      "rounded-lg px-2 py-1.5",
                      e === ETAPAS.length - 1 ? "bg-accent text-[#03101b]" : "bg-[#0e2c47] text-white",
                    )}
                  >
                    <p className="truncate text-[11px] font-semibold">{lead.nombre}</p>
                    <p className={cn("truncate text-[9px]", e === ETAPAS.length - 1 ? "text-[#03101b]/70" : "text-white/45")}>
                      {lead.origen}
                    </p>
                  </motion.div>
                ) : null,
              )}
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {aviso && (
          <motion.p
            key={aviso}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-3 flex items-center gap-2 truncate rounded-full bg-white/[0.06] px-3 py-1.5 text-xs text-white/80"
          >
            <Workflow className="h-3.5 w-3.5 shrink-0 text-accent" /> Automatización: {aviso}
          </motion.p>
        )}
      </AnimatePresence>
    </Marco>
  );
}

/* ---------- Mensajes masivos por WhatsApp ---------- */

export function SimulacionMasivos({ activo = true }: { activo?: boolean }) {
  const ciclo = useCiclo(activo, 8000);
  const enviados = useConteo(1250, activo, ciclo, 1600);
  const entregados = useConteo(1212, activo, ciclo, 2200);
  const leidos = useConteo(986, activo, ciclo, 2800);
  const respuestas = useConteo(148, activo, ciclo, 3400);

  return (
    <Marco
      icono={<Send className="h-5 w-5" />}
      titulo="Difusión por WhatsApp"
      subtitulo="Lanzamiento de nueva colección"
      etiqueta="Demo"
    >
      <div className="rounded-xl rounded-tl-sm bg-[#005c4b] p-3 text-[13px] leading-snug text-white">
        ✨ ¡Llegó la nueva colección! Responde <b>QUIERO</b> y te enviamos el catálogo con 10% de descuento por 48 horas.
        <CheckCheck className="ml-1 inline h-3.5 w-3.5 text-[#53bdeb]" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {[
          { l: "Enviados", v: enviados, i: <Send className="h-3.5 w-3.5" /> },
          { l: "Entregados", v: entregados, i: <CheckCheck className="h-3.5 w-3.5" /> },
          { l: "Leídos", v: leidos, i: <Eye className="h-3.5 w-3.5" /> },
          { l: "Respondieron", v: respuestas, i: <MessageCircle className="h-3.5 w-3.5" />, d: true },
        ].map((k) => (
          <div key={k.l} className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
            <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-white/45">
              <span className="text-accent">{k.i}</span> {k.l}
            </p>
            <p className={cn("mt-1 text-xl font-semibold tracking-tight", k.d ? "text-accent" : "text-white")}>{num(k.v)}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          key={ciclo}
          className="h-full rounded-full bg-accent"
          initial={{ width: "0%" }}
          animate={{ width: activo ? "100%" : "0%" }}
          transition={{ duration: 2.2, ease: "easeOut" }}
        />
      </div>
      <p className="mt-2 text-[11px] text-white/45">Enviado con la API oficial de WhatsApp, a contactos que aceptaron recibir mensajes.</p>
    </Marco>
  );
}

/* ---------- Email marketing ---------- */

const FLUJO_EMAIL = ["Bienvenida", "Día 2: tu guía", "Día 5: oferta"];

export function SimulacionEmail({ activo = true }: { activo?: boolean }) {
  const ciclo = useCiclo(activo, 7500);
  const apertura = useConteo(48, activo, ciclo, 2000);
  const clics = useConteo(12, activo, ciclo, 2400);
  const [paso, setPaso] = useState(0);

  useEffect(() => {
    if (!activo) return;
    const t0 = window.setTimeout(() => setPaso(0), 0);
    const t1 = window.setTimeout(() => setPaso(1), 1800);
    const t2 = window.setTimeout(() => setPaso(2), 3600);
    return () => {
      window.clearTimeout(t0);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [activo, ciclo]);

  return (
    <Marco icono={<Mail className="h-5 w-5" />} titulo="Email marketing" subtitulo="Secuencia automática de bienvenida" etiqueta="Demo">
      <div className="flex items-center gap-1.5">
        {FLUJO_EMAIL.map((f, i) => (
          <div key={f} className="flex flex-1 items-center gap-1.5">
            <span
              className={cn(
                "flex-1 truncate rounded-full px-2.5 py-1 text-center text-[10px] font-semibold transition-colors duration-500",
                i <= paso ? "bg-accent text-[#03101b]" : "bg-white/[0.06] text-white/50",
              )}
            >
              {f}
            </span>
            {i < FLUJO_EMAIL.length - 1 && <span className="h-px w-2 bg-white/20" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={paso}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
          className="mt-4 rounded-xl bg-[#f4f6f8] p-4 text-[#0d1420]"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#0a5f7a]">Asunto</p>
          <p className="mt-0.5 text-sm font-semibold">
            {paso === 0 ? "¡Bienvenida! Esto es lo que viene 👋" : paso === 1 ? "La guía que te prometimos 📘" : "Solo por 48 horas: 15% para ti 🎁"}
          </p>
          <div className="mt-3 space-y-1.5">
            <div className="h-2 w-full rounded bg-[#0d1420]/10" />
            <div className="h-2 w-4/5 rounded bg-[#0d1420]/10" />
            <div className="h-2 w-3/5 rounded bg-[#0d1420]/10" />
          </div>
          <span className="mt-3 inline-block rounded-full bg-[#0a2642] px-3 py-1 text-[11px] font-semibold text-white">
            {paso === 2 ? "Comprar ahora" : "Ver más"}
          </span>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
          <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-white/45">
            <MailOpen className="h-3.5 w-3.5 text-accent" /> Apertura
          </p>
          <p className="mt-1 text-xl font-semibold text-white">{apertura}%</p>
        </div>
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
          <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-white/45">
            <MousePointerClick className="h-3.5 w-3.5 text-accent" /> Clics
          </p>
          <p className="mt-1 text-xl font-semibold text-accent">{clics}%</p>
        </div>
      </div>
    </Marco>
  );
}
