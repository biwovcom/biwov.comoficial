"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3, CalendarDays, TrendingUp, UserRound, Video, Check, ChevronDown, Clapperboard, Copy, Lightbulb, ListChecks, Smartphone, Target,
} from "lucide-react";
import type { DocumentosCliente } from "@/data/documentosClientes";
import { cn } from "@/lib/utils";

/**
 * Plan de trabajo que ve el cliente. Los datos viven en la oficina de biwov (proyecto del cliente →
 * contenido) y se publican en Firestore planesPublicos/<slug>. El cliente marca lo que va haciendo
 * (marcas) y deja ideas (ideasCliente); Kathe y los agentes lo ven en la oficina.
 */

const BASE = "https://firestore.googleapis.com/v1/projects/biwov-oficina/databases/(default)/documents/planesPublicos";

type Escena = { seg: string; dice: string; pantalla: string; plano: string };
type Item = {
  id: string; tipo: "reel" | "historia" | "tarea" | "idea"; fecha: string; semana: number;
  pilar: string; embudo: string; titulo: string; objetivo?: string; formato?: string;
  ganchoVisual?: string; ganchoTexto?: string; ganchoVerbal?: string; escenas?: Escena[];
  cta?: string; caption?: string; palabraClave?: string; duracion?: string; retencion?: string;
  metrica?: string; notas?: string; frames?: string[]; tema?: string; numero?: number; opcion?: boolean;
};
type Idea = { texto: string; link?: string; fecha: string };

const PILAR: Record<string, { nombre: string; color: string; texto: string; que: string }> = {
  conexion: { nombre: "Conexión", color: "#00c2e8", texto: "#03101b", que: "Que te conozcan como persona: tu historia, tu consultorio, tu forma de atender." },
  valor: { nombre: "Valor", color: "#c6f432", texto: "#03101b", que: "Enseñar algo útil: resolver dudas, quitar miedos y mitos. Genera confianza y guardados." },
  oferta: { nombre: "Oferta", color: "#ff9f43", texto: "#03101b", que: "Invitar a dar el paso: valoración, higiene oral, cupos. Lleva a WhatsApp." },
};
const EMBUDO: Record<string, { nombre: string; que: string }> = {
  TOFU: { nombre: "Te descubren", que: "Gente que todavía no te conoce" },
  MOFU: { nombre: "Te conocen y confían", que: "Gente que ya te vio y está evaluando" },
  BOFU: { nombre: "Te escriben", que: "Gente lista para agendar" },
};
const DIAS = ["L", "M", "M", "J", "V", "S", "D"];
const cop = (n: number) => `$${Math.round(n).toLocaleString("es-CO")}`;

// ---------- Firestore REST (sin sesión, como el cuestionario) ----------
async function leerPlan(slug: string) {
  const r = await fetch(`${BASE}/${slug}`, { cache: "no-store" });
  if (!r.ok) throw new Error(String(r.status));
  const f = (await r.json()).fields || {};
  const items: Item[] = JSON.parse(f.datos?.stringValue || "[]");
  const marcas: Record<string, boolean> = {};
  for (const [k, v] of Object.entries(f.marcas?.mapValue?.fields || {})) marcas[k] = !!(v as { booleanValue?: boolean }).booleanValue;
  const ideas: Record<string, Idea> = {};
  for (const [k, v] of Object.entries(f.ideasCliente?.mapValue?.fields || {})) {
    try { ideas[k] = JSON.parse((v as { stringValue: string }).stringValue); } catch { /* idea mal formada */ }
  }
  const reportes: Record<string, Reporte> = {};
  for (const [k, v] of Object.entries(f.reportes?.mapValue?.fields || {})) {
    try { reportes[k.replace(/^s(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")] = JSON.parse((v as { stringValue: string }).stringValue); } catch { /* reporte mal formado */ }
  }
  let calculadora: Calc | null = null;
  try { calculadora = f.calculadora?.stringValue ? JSON.parse(f.calculadora.stringValue) : null; } catch { /* sin calculadora */ }
  let perfil: PerfilData | null = null;
  try { perfil = f.perfil?.stringValue ? JSON.parse(f.perfil.stringValue) : null; } catch { /* sin perfil */ }
  let reuniones: ReunionP[] = [];
  try { reuniones = f.reuniones?.stringValue ? JSON.parse(f.reuniones.stringValue) : []; } catch { /* sin reuniones */ }
  const txt = (k: string) => (f[k]?.stringValue as string) || "";
  return { items, marcas, ideas, reportes, calculadora, perfil, reuniones, cliente: txt("cliente"), desde: txt("desde"), hasta: txt("hasta") };
}
async function guardarCampo(slug: string, mapa: "marcas" | "ideasCliente" | "reportes", clave: string, valor: { booleanValue: boolean } | { stringValue: string }) {
  const r = await fetch(`${BASE}/${slug}?updateMask.fieldPaths=${mapa}.${clave}&currentDocument.exists=true`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields: { [mapa]: { mapValue: { fields: { [clave]: valor } } } } }),
  });
  if (!r.ok) throw new Error(String(r.status));
}

const Badge = ({ pilar }: { pilar: string }) =>
  PILAR[pilar] ? (
    <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold" style={{ background: PILAR[pilar].color, color: PILAR[pilar].texto }}>
      {PILAR[pilar].nombre}
    </span>
  ) : null;
const BadgeEmbudo = ({ e }: { e: string }) =>
  EMBUDO[e] ? <span className="rounded-full border border-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white/75">{EMBUDO[e].nombre}</span> : null;

function Check2({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on}
      className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors",
        on ? "border-[#c6f432] bg-[#c6f432] text-[#03101b]" : "border-white/20 text-white/80 hover:border-[#c6f432]")}>
      <span className={cn("grid h-4 w-4 place-items-center rounded-full border", on ? "border-[#03101b]" : "border-white/40")}>
        {on && <Check className="h-3 w-3" />}
      </span>
      {label}
    </button>
  );
}

function PorQue({ children }: { children: React.ReactNode }) {
  const [a, setA] = useState(false);
  return (
    <div className="mt-4 rounded-2xl border border-[#00c2e8]/25 bg-[#00c2e8]/[0.06]">
      <button type="button" onClick={() => setA(!a)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-[#8fdff0]">
        💡 ¿Por qué hacemos esto?
        <ChevronDown className={cn("h-4 w-4 transition-transform", a && "rotate-180")} />
      </button>
      {a && <div className="space-y-2 px-4 pb-4 text-sm leading-relaxed text-white/80">{children}</div>}
    </div>
  );
}

// ---------- Tarjetas ----------
function ReelCard({ it, marcas, marcar, abierto }: { it: Item; marcas: Record<string, boolean>; marcar: (k: string) => void; abierto?: boolean }) {
  const [a, setA] = useState(!!abierto);
  const [copiado, setCopiado] = useState(false);
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
      <div className="h-1.5" style={{ background: PILAR[it.pilar]?.color }} />
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-extrabold text-[#03101b]">{it.opcion ? "🔁 Opción" : `⭐ Reel ${it.numero ?? ""}`}</span>
          <Badge pilar={it.pilar} /> <BadgeEmbudo e={it.embudo} />
          <span className="text-xs text-white/50">{it.fecha ? fechaCorta(it.fecha) + " · " : ""}{it.duracion}</span>
        </div>
        <h3 className="mt-3 text-xl font-semibold leading-tight">{it.titulo}</h3>
        <p className="mt-1 text-sm text-white/65">{it.objetivo}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/[0.06] p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-[#8fdff0]">Gancho visual</p><p className="mt-1 text-sm">{it.ganchoVisual}</p></div>
          <div className="rounded-2xl bg-white/[0.06] p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-[#8fdff0]">Texto en pantalla</p><p className="mt-1 text-sm font-semibold">{it.ganchoTexto}</p></div>
          <div className="rounded-2xl bg-white/[0.06] p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-[#8fdff0]">Lo primero que dices</p><p className="mt-1 text-sm">“{it.ganchoVerbal}”</p></div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Check2 on={!!marcas[`${it.id}_grabado`]} onClick={() => marcar(`${it.id}_grabado`)} label="Grabado" />
          <Check2 on={!!marcas[`${it.id}_publicado`]} onClick={() => marcar(`${it.id}_publicado`)} label="Publicado" />
          <button type="button" onClick={() => setA(!a)} className="ml-auto inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold hover:bg-white/15">
            {a ? "Ocultar guion" : "Ver guion completo"} <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", a && "rotate-180")} />
          </button>
        </div>
        <AnimatePresence initial={false}>
          {a && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mt-5 space-y-2">
                {it.escenas?.map((e, k) => (
                  <div key={k} className="grid gap-2 rounded-2xl bg-white/[0.05] p-3 sm:grid-cols-[70px_1fr_1fr]">
                    <span className="text-xs font-extrabold text-[#c6f432]">{e.seg}</span>
                    <p className="text-sm">🗣️ {e.dice}</p>
                    <div className="text-xs text-white/65"><p>📝 {e.pantalla}</p><p className="mt-1">🎥 {e.plano}</p></div>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <p><b className="text-[#8fdff0]">Llamado a la acción:</b> {it.cta}</p>
                <p><b className="text-[#8fdff0]">Formato (inspiración):</b> {it.formato}</p>
                <p><b className="text-[#8fdff0]">Para que lo vean completo:</b> {it.retencion}</p>
                <p><b className="text-[#8fdff0]">Qué medimos:</b> {it.metrica}</p>
                <p><b className="text-[#8fdff0]">Palabra clave (búsquedas):</b> {it.palabraClave}</p>
              </div>
              {it.notas && <p className="mt-3 rounded-2xl bg-[#ff9f43]/15 p-3 text-sm text-[#ffd2a6]">⚠️ {it.notas}</p>}
              <div className="mt-4 rounded-2xl border border-white/10 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Texto para la publicación</p>
                  <button type="button" onClick={() => { navigator.clipboard?.writeText(it.caption || ""); setCopiado(true); setTimeout(() => setCopiado(false), 1500); }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#c6f432]"><Copy className="h-3.5 w-3.5" />{copiado ? "¡Copiado!" : "Copiar"}</button>
                </div>
                <p className="mt-1 text-sm text-white/80">{it.caption}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function HistoriaCard({ it, marcas, marcar }: { it: Item; marcas: Record<string, boolean>; marcar: (k: string) => void }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-extrabold">📱 Historias</span>
        <Badge pilar={it.pilar} /> <BadgeEmbudo e={it.embudo} />
      </div>
      <h3 className="mt-2 font-semibold">{it.titulo}</h3>
      <p className="text-sm text-white/60">{it.objetivo}</p>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {it.frames?.map((fr, k) => (
          <div key={k} className="relative flex h-40 w-24 flex-none flex-col rounded-2xl p-2.5 text-[11px] leading-snug"
            style={{ background: `linear-gradient(160deg, ${PILAR[it.pilar]?.color ?? "#00c2e8"}33, #0a2642)` }}>
            <div className="mb-1.5 flex gap-0.5">{it.frames!.map((_, j) => <span key={j} className={cn("h-0.5 flex-1 rounded", j <= k ? "bg-white" : "bg-white/30")} />)}</div>
            <span className="text-[10px] font-bold text-white/60">{k + 1}</span>
            <p className="mt-1">{fr}</p>
          </div>
        ))}
      </div>
      <div className="mt-3"><Check2 on={!!marcas[it.id]} onClick={() => marcar(it.id)} label="Publicadas" /></div>
    </div>
  );
}

function TareaFila({ it, marcas, marcar }: { it: Item; marcas: Record<string, boolean>; marcar: (k: string) => void }) {
  const on = !!marcas[it.id];
  return (
    <button type="button" onClick={() => marcar(it.id)} className={cn("flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors", on ? "border-[#c6f432]/40 bg-[#c6f432]/10" : "border-white/10 bg-white/[0.04] hover:border-white/25")}>
      <span className={cn("mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full border-2", on ? "border-[#c6f432] bg-[#c6f432] text-[#03101b]" : "border-white/30")}>{on && <Check className="h-4 w-4" />}</span>
      <span>
        <span className={cn("block font-semibold", on && "text-white/60 line-through")}>{it.titulo}</span>
        {it.notas && <span className="mt-0.5 block text-sm text-white/55">{it.notas}</span>}
        <span className="mt-1 block text-xs text-white/40">{fechaCorta(it.fecha)}</span>
      </span>
    </button>
  );
}

function fechaLarga(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-CO", { day: "numeric", month: "long" });
}
function fechaCorta(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-CO", { weekday: "short", day: "numeric", month: "short" });
}

// ---------- Calendario ----------
function Calendario({ items, marcas, marcar }: { items: Item[]; marcas: Record<string, boolean>; marcar: (k: string) => void }) {
  const meses = useMemo(() => [...new Set(items.filter((i) => i.fecha).map((i) => i.fecha.slice(0, 7)))].sort(), [items]);
  const [mes, setMes] = useState(meses[0] || "2026-11");
  const [dia, setDia] = useState<string>(() => {
    const hoy = new Date().toISOString().slice(0, 10);
    return items.some((i) => i.fecha === hoy) ? hoy : items.find((i) => i.fecha)?.fecha || "";
  });
  const [y, m] = mes.split("-").map(Number);
  const primero = new Date(y, m - 1, 1);
  const offset = (primero.getDay() + 6) % 7;
  const nDias = new Date(y, m, 0).getDate();
  const todas: (string | null)[] = [...Array(offset).fill(null), ...Array.from({ length: nDias }, (_, k) => `${mes}-${String(k + 1).padStart(2, "0")}`)];
  while (todas.length % 7) todas.push(null);
  // Solo las semanas que tienen algo del plan (sin filas vacías)
  const celdas = Array.from({ length: todas.length / 7 }, (_, w) => todas.slice(w * 7, w * 7 + 7))
    .filter((fila) => fila.some((c) => c && items.some((i) => i.fecha === c))).flat();
  const delDia = items.filter((i) => i.fecha === dia);
  const hoy = new Date().toISOString().slice(0, 10);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {meses.map((mm) => {
          const [yy, mo] = mm.split("-").map(Number);
          return (
            <button key={mm} type="button" onClick={() => setMes(mm)} className={cn("rounded-full px-4 py-2 text-sm font-bold capitalize", mm === mes ? "bg-white text-[#03101b]" : "bg-white/10 text-white/70")}>
              {new Date(yy, mo - 1, 1).toLocaleDateString("es-CO", { month: "long" })}
            </button>
          );
        })}
        <div className="ml-auto flex flex-wrap gap-3 text-xs text-white/60">
          <span>🎬 Reel</span><span>📱 Historias</span><span>✓ Tarea</span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {DIAS.map((dd, k) => <div key={k} className="pb-1 text-center text-xs font-bold text-white/40">{dd}</div>)}
        {celdas.map((c, k) => {
          if (!c) return <div key={k} />;
          const its = items.filter((i) => i.fecha === c);
          const reel = its.find((i) => i.tipo === "reel");
          const hechos = its.filter((i) => (i.tipo === "reel" ? marcas[`${i.id}_publicado`] : marcas[i.id])).length;
          const completo = its.length > 0 && hechos === its.length;
          return (
            <button key={c} type="button" onClick={() => its.length && setDia(c)} disabled={!its.length}
              className={cn("relative flex min-h-[64px] flex-col rounded-xl border p-1.5 text-left transition-all md:min-h-[92px] md:p-2",
                its.length ? "border-white/10 bg-white/[0.05] hover:border-white/30" : "border-transparent bg-transparent opacity-35",
                dia === c && "border-[#c6f432] ring-2 ring-[#c6f432]/40", c === hoy && "outline outline-1 outline-[#00c2e8]")}>
              <span className="flex items-center justify-between text-xs font-bold">
                {Number(c.slice(8))}
                {completo && <Check className="h-3.5 w-3.5 text-[#c6f432]" />}
              </span>
              {reel && (
                <span className="mt-1 hidden truncate rounded-md px-1.5 py-0.5 text-[10px] font-bold md:block" style={{ background: PILAR[reel.pilar]?.color, color: "#03101b" }}>
                  🎬 {reel.titulo}
                </span>
              )}
              <span className="mt-auto flex gap-0.5 pt-1 text-[11px]">
                {reel && <span className="md:hidden">🎬</span>}
                {its.some((i) => i.tipo === "historia") && <span>📱</span>}
                {its.some((i) => i.tipo === "tarea") && <span>✓</span>}
              </span>
            </button>
          );
        })}
      </div>

      {dia && (
        <div className="mt-6">
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[#8fdff0] first-letter:uppercase">{fechaCorta(dia)}</h3>
          <div className="mt-3 space-y-3">
            {delDia.filter((i) => i.tipo === "tarea").map((i) => <TareaFila key={i.id} it={i} marcas={marcas} marcar={marcar} />)}
            {delDia.filter((i) => i.tipo === "reel").map((i) => <ReelCard key={i.id} it={i} marcas={marcas} marcar={marcar} />)}
            {delDia.filter((i) => i.tipo === "historia").map((i) => <HistoriaCard key={i.id} it={i} marcas={marcas} marcar={marcar} />)}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Calculadora (con los datos reales de Meta del cliente) ----------
type Calc = NonNullable<DocumentosCliente["plan"]>["calculadora"];
type Escenario = { nombre: string; nota: string; cpm: number; castigo: number; agenda: number; asiste: number; inicia: number; color: string };

/** Inversión → impresiones (CPM real) → conversaciones (tasa real, que baja al invertir más) → citas → asisten → pacientes. */
function simular(inv: number, c: Calc, e: Escenario) {
  const imp = (inv / e.cpm) * 1000;
  const factor = inv > c.gastoBase ? Math.pow(1 - e.castigo, Math.log2(inv / c.gastoBase)) : 1;
  const conv = imp * c.tasaConversacion * factor;
  const citas = conv * (e.agenda / 100);
  const asisten = citas * (e.asiste / 100);
  const pacientes = asisten * (e.inicia / 100);
  return { imp, conv, citas, asisten, pacientes, costoConv: conv ? inv / conv : 0, costoPaciente: pacientes ? inv / pacientes : 0 };
}
function inversionPara(meta: number, c: Calc, e: Escenario) {
  let lo = 20000, hi = 60000000;
  if (simular(hi, c, e).pacientes < meta) return null;
  for (let k = 0; k < 60; k++) { const mid = (lo + hi) / 2; if (simular(mid, c, e).pacientes >= meta) hi = mid; else lo = mid; }
  return Math.ceil(hi / 10000) * 10000;
}

function Campo({ label, valor, set, min, max, step, fmt, aviso }: { label: string; valor: number; set: (n: number) => void; min: number; max: number; step: number; fmt: (n: number) => string; aviso?: string }) {
  return (
    <label className="block">
      <span className="flex justify-between gap-3 text-sm"><span className="text-white/70">{label}</span><b>{fmt(valor)}</b></span>
      <input type="range" min={min} max={max} step={step} value={valor} onChange={(e) => set(Number(e.target.value))} className="mt-2 w-full accent-[#c6f432]" />
      {aviso && <span className="mt-1 block text-xs text-[#ffd2a6]">⚠️ {aviso}</span>}
    </label>
  );
}

function Calculadora({ c }: { c: Calc }) {
  const [modo, setModo] = useState<"invierto" | "meta">("invierto");
  const [inv, setInv] = useState(c.presupuestoActual);
  const [meta, setMeta] = useState(c.metaPacientes);
  const [srv, setSrv] = useState(0);
  const [agenda, setAgenda] = useState(c.pctAgenda);
  const [asiste, setAsiste] = useState(c.pctAsiste);
  const [inicia, setInicia] = useState(c.pctInicia);
  const [avanzado, setAvanzado] = useState(false);
  const ticket = c.servicios[srv]?.ticket ?? 0;

  const esc: Escenario[] = [
    { nombre: "Conservador", nota: "Si los anuncios rinden menos y no mejora el seguimiento", cpm: c.cpmMax, castigo: 0.25, agenda: Math.max(1, agenda * 0.8), asiste: Math.max(10, asiste - 10), inicia: Math.max(10, inicia - 10), color: "#ff9f43" },
    { nombre: "Lo más probable", nota: "Con tus números reales de hoy", cpm: c.cpm, castigo: 0.15, agenda, asiste, inicia, color: "#00c2e8" },
    { nombre: "Con mejor seguimiento", nota: "Si respondemos rápido y hacemos seguimiento (agendan el doble)", cpm: c.cpm, castigo: 0.15, agenda: Math.min(60, Math.max(agenda * 2, 20)), asiste: Math.max(asiste, 80), inicia, color: "#c6f432" },
  ];
  const prob = simular(inv, c, esc[1]);
  const pasos = [
    ["Inversión", cop(inv)], ["Personas que ven el anuncio (impresiones)", Math.round(prob.imp).toLocaleString("es-CO")],
    ["Te escriben por WhatsApp", Math.round(prob.conv).toLocaleString("es-CO")], ["Agendan cita", prob.citas.toFixed(0)],
    ["Asisten", prob.asisten.toFixed(0)], ["Empiezan (pacientes)", prob.pacientes.toFixed(0)],
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setModo("invierto")} className={cn("rounded-full px-4 py-2 text-sm font-bold", modo === "invierto" ? "bg-white text-[#03101b]" : "bg-white/10")}>Si invierto X, ¿cuántos pacientes?</button>
        <button type="button" onClick={() => setModo("meta")} className={cn("rounded-full px-4 py-2 text-sm font-bold", modo === "meta" ? "bg-white text-[#03101b]" : "bg-white/10")}>Quiero N pacientes, ¿cuánto invierto?</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          {modo === "invierto"
            ? <Campo label="Inversión en pauta al mes" valor={inv} set={setInv} min={100000} max={6000000} step={50000} fmt={cop} />
            : <Campo label="Pacientes nuevos que quieres al mes" valor={meta} set={setMeta} min={2} max={120} step={1} fmt={String} />}
          <div>
            <p className="text-sm text-white/70">Servicio (para calcular ingresos)</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {c.servicios.map((s, k) => (
                <button key={s.nombre} type="button" onClick={() => setSrv(k)} className={cn("rounded-full px-3 py-1.5 text-xs font-bold", srv === k ? "bg-[#c6f432] text-[#03101b]" : "bg-white/10")}>
                  {s.nombre} · {cop(s.ticket)}{s.estimado ? "*" : ""}
                </button>
              ))}
            </div>
            {c.servicios[srv]?.estimado && <p className="mt-1 text-xs text-white/45">* Valor promedio estimado: lo ajustamos con tus precios reales.</p>}
          </div>
          <div className="rounded-2xl bg-white/[0.05] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#8fdff0]">Tus datos reales de Meta</p>
            <ul className="mt-2 space-y-1 text-sm">
              {c.datosMeta.map((d) => <li key={d.etiqueta} className="flex justify-between gap-3"><span className="text-white/60">{d.etiqueta}</span><b className="text-right">{d.valor}</b></li>)}
            </ul>
          </div>
          <button type="button" onClick={() => setAvanzado(!avanzado)} className="text-sm font-bold text-[#8fdff0]">{avanzado ? "▴ Ocultar" : "▾ Simular otros porcentajes"}</button>
          {avanzado && (
            <div className="space-y-4">
              <Campo label="De cada 100 que escriben, agendan" valor={agenda} set={setAgenda} min={2} max={60} step={1} fmt={(n) => `${n} %`} aviso={agenda > c.pctAgenda ? `Tu dato real hoy es ${c.pctAgenda} %` : undefined} />
              <Campo label="De cada 100 citas, asisten" valor={asiste} set={setAsiste} min={20} max={100} step={5} fmt={(n) => `${n} %`} aviso={!c.pctAsisteMedido ? "Todavía no lo hemos medido" : undefined} />
              <Campo label="De los que asisten, empiezan" valor={inicia} set={setInicia} min={10} max={100} step={5} fmt={(n) => `${n} %`} aviso={inicia > c.pctInicia ? `Tu dato real hoy es ${c.pctInicia} %` : undefined} />
            </div>
          )}
          <p className="text-xs leading-relaxed text-white/45">{c.fuente}</p>
        </div>

        <div className="space-y-4">
          {modo === "invierto" ? (
            <>
              <div className="rounded-3xl bg-white p-6 text-[#03101b]">
                <p className="text-sm font-semibold text-[#0a2642]/60">Con {cop(inv)} al mes, lo más probable es</p>
                <div className="mt-4 space-y-1.5">
                  {pasos.map(([l, v], k) => (
                    <div key={l} className="flex items-center gap-3">
                      <div className="h-7 rounded-lg" style={{ width: `${100 - k * 13}%`, background: k === pasos.length - 1 ? "#c6f432" : `rgba(0,194,232,${0.85 - k * 0.12})` }} />
                      <span className="whitespace-nowrap text-sm"><b>{v}</b> <span className="text-[#0a2642]/60">{l.toLowerCase()}</span></span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-[#0a2642]/70">Costo por conversación ≈ <b>{cop(prob.costoConv)}</b> · costo por paciente ≈ <b>{prob.pacientes >= 1 ? cop(prob.costoPaciente) : "—"}</b></p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {esc.map((e) => {
                  const r = simular(inv, c, e);
                  return (
                    <div key={e.nombre} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4" style={{ borderTop: `4px solid ${e.color}` }}>
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: e.color }}>{e.nombre}</p>
                      <p className="mt-1 text-3xl font-semibold">{Math.floor(r.pacientes)}</p>
                      <p className="text-xs text-white/55">pacientes al mes</p>
                      <p className="mt-2 text-xs text-white/70">≈ {cop(Math.floor(r.pacientes) * ticket)} en ingresos</p>
                      <p className="mt-2 text-[11px] leading-snug text-white/45">{e.nota}</p>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="grid gap-3">
              {esc.map((e) => {
                const need = inversionPara(meta, c, e);
                const r = need ? simular(need, c, e) : null;
                return (
                  <div key={e.nombre} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5" style={{ borderLeft: `5px solid ${e.color}` }}>
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: e.color }}>{e.nombre}</p>
                    <p className="mt-1 text-sm text-white/60">{e.nota}</p>
                    {need && r ? (
                      <p className="mt-2 text-lg">Para <b>{meta}</b> pacientes: <b className="text-2xl">{cop(need)}</b> al mes · {Math.round(r.conv)} conversaciones · {cop(r.costoConv)} cada una</p>
                    ) : (
                      <p className="mt-2 text-lg">Con solo pauta no es alcanzable en un mes: hace falta sumar referidos, contenido y seguimiento.</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <div className="rounded-3xl border border-[#ff9f43]/30 bg-[#ff9f43]/[0.08] p-5 text-sm leading-relaxed">
            <p className="font-bold text-[#ffd2a6]">¿Qué está garantizado y qué no?</p>
            <p className="mt-2 text-white/80">Nadie puede garantizar pacientes: Meta solo garantiza mostrar tus anuncios. Lo que sí controlamos es la calidad de los anuncios y del contenido, la respuesta rápida y el seguimiento. Por eso mostramos un <b>rango</b> y cada semana lo recalculamos con tus números reales.</p>
            <p className="mt-2 text-white/80">Cuando la inversión sube mucho, cada conversación sale más cara (Meta tiene que mostrar el anuncio a personas menos interesadas). La calculadora ya lo tiene en cuenta.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Resultados (el cliente reporta cada semana) ----------
type Reporte = { escribieron: number; agendaron: number; asistieron: number; iniciaron: number; inversion: number; ventas: number; comentario: string; fecha: string };
const CAMPOS_REPORTE: [keyof Reporte, string, string][] = [
  ["escribieron", "Personas que escribieron", "WhatsApp, Instagram o llamadas nuevas"],
  ["agendaron", "Agendaron cita", "Valoración, cita o cotización"],
  ["asistieron", "Asistieron", "Llegaron a la cita"],
  ["iniciaron", "Empezaron o compraron", "Iniciaron tratamiento o pagaron"],
  ["inversion", "Invertido en pauta esa semana ($)", "Lo que se cargó en Meta (opcional)"],
  ["ventas", "Valor vendido ($)", "Lo que pagaron los nuevos (opcional)"],
];
const lunesDe = (d = new Date()) => { const x = new Date(d); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x.toISOString().slice(0, 10); };
const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 100) : 0);

export function totalesReportes(reportes: Record<string, Reporte>) {
  const t = { escribieron: 0, agendaron: 0, asistieron: 0, iniciaron: 0, inversion: 0, ventas: 0 };
  for (const r of Object.values(reportes)) for (const k of Object.keys(t) as (keyof typeof t)[]) t[k] += Number(r[k]) || 0;
  return t;
}

function Resultados({ reportes, guardar }: { reportes: Record<string, Reporte>; guardar: (semana: string, r: Reporte) => Promise<void> }) {
  const [semana, setSemana] = useState(lunesDe());
  const vacio: Reporte = { escribieron: 0, agendaron: 0, asistieron: 0, iniciaron: 0, inversion: 0, ventas: 0, comentario: "", fecha: "" };
  const [f, setF] = useState<Reporte>(reportes[lunesDe()] || vacio);
  const [guardando, setGuardando] = useState(false);
  const semanas = Object.keys(reportes).sort();
  const t = totalesReportes(reportes);
  const maxEsc = Math.max(1, ...semanas.map((s) => reportes[s].escribieron || 0));
  const elegir = (s: string) => { setSemana(s); setF(reportes[s] || vacio); };

  const lectura: string[] = [];
  if (t.escribieron >= 10) {
    const ag = pct(t.agendaron, t.escribieron), as = pct(t.asistieron, t.agendaron), ini = pct(t.iniciaron, t.asistieron);
    if (ag < 15) lectura.push(`De cada 100 que escriben, agendan ${ag}. El punto a mejorar es la respuesta y el seguimiento: contestar en menos de 5 minutos, enviar el mensaje con la oferta y hacer seguimiento a los 2 y 7 días.`);
    else lectura.push(`¡Bien! Agendan ${ag} de cada 100 que escriben.`);
    if (t.agendaron >= 5 && as < 70) lectura.push(`Asiste el ${as} % de los que agendan. Confirmar la cita un día antes por WhatsApp suele subir la asistencia.`);
    if (t.asistieron >= 5 && ini < 60) lectura.push(`Empieza el ${ini} % de los que asisten. Revisemos cómo se presenta el plan y las formas de pago en la cita.`);
    if (t.inversion > 0 && t.escribieron > 0) lectura.push(`Cada conversación costó ${cop(t.inversion / t.escribieron)}${t.iniciaron ? ` y cada cliente nuevo ${cop(t.inversion / t.iniciaron)}` : ""}.`);
    if (t.inversion > 0 && t.ventas > 0) lectura.push(`Por cada $1 invertido en pauta se vendieron ${cop(t.ventas / t.inversion)}.`);
  }

  const enviar = async () => { setGuardando(true); await guardar(semana, { ...f, fecha: new Date().toISOString() }); setGuardando(false); };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-xl font-semibold">Tu reporte de la semana</h2>
          <p className="mt-1 text-sm text-white/60">Llénalo cada lunes con lo de la semana anterior. Toma 1 minuto.</p>
          <label className="mt-4 block text-sm text-white/70">Semana que empieza el
            <input type="date" value={semana} onChange={(e) => elegir(lunesDe(new Date(e.target.value + "T12:00:00")))} className="mt-1 w-full rounded-2xl border border-white/15 bg-transparent p-2.5 text-sm text-white [color-scheme:dark]" />
          </label>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {CAMPOS_REPORTE.map(([k, l, h]) => (
              <label key={k} className="block">
                <span className="text-xs font-bold text-white/80">{l}</span>
                <input type="number" min={0} inputMode="numeric" value={Number(f[k]) || ""} placeholder="0" onChange={(e) => setF({ ...f, [k]: Number(e.target.value) || 0 })}
                  className="mt-1 w-full rounded-2xl border border-white/15 bg-transparent p-2.5 text-lg font-semibold outline-none focus:border-[#c6f432]" />
                <span className="text-[11px] text-white/40">{h}</span>
              </label>
            ))}
          </div>
          <textarea value={f.comentario} onChange={(e) => setF({ ...f, comentario: e.target.value.slice(0, 800) })} rows={3} placeholder="¿Qué preguntaron más? ¿Qué pasó esta semana?"
            className="mt-3 w-full rounded-2xl border border-white/15 bg-transparent p-3 text-sm outline-none focus:border-[#c6f432]" />
          <button type="button" disabled={guardando} onClick={enviar} className="mt-3 rounded-full bg-[#c6f432] px-6 py-3 text-sm font-bold text-[#03101b] disabled:opacity-60">
            {guardando ? "Guardando…" : reportes[semana] ? "Actualizar reporte" : "Enviar reporte"}
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-6 text-[#03101b]">
            <p className="text-sm font-semibold text-[#0a2642]/60">Acumulado de {semanas.length} {semanas.length === 1 ? "semana" : "semanas"}</p>
            <div className="mt-4 space-y-2">
              {([["Escribieron", t.escribieron], ["Agendaron", t.agendaron], ["Asistieron", t.asistieron], ["Empezaron", t.iniciaron]] as [string, number][]).map(([l, v], k, arr) => (
                <div key={l} className="flex items-center gap-3">
                  <div className="h-8 rounded-lg" style={{ width: `${Math.max(8, pct(v, Math.max(1, arr[0][1])))}%`, background: k === 3 ? "#c6f432" : `rgba(0,194,232,${0.9 - k * 0.2})` }} />
                  <span className="whitespace-nowrap text-sm"><b className="text-lg">{v}</b> {l.toLowerCase()}{k > 0 && arr[k - 1][1] > 0 ? <span className="text-[#0a2642]/50"> · {pct(v, arr[k - 1][1])} %</span> : null}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-[#00c2e8]/25 bg-[#00c2e8]/[0.06] p-5 text-sm leading-relaxed">
            <p className="font-bold text-[#8fdff0]">🔎 ¿Está funcionando? Lo que dicen tus números</p>
            {lectura.length ? <ul className="mt-2 list-disc space-y-1.5 pl-5 text-white/80">{lectura.map((x) => <li key={x}>{x}</li>)}</ul>
              : <p className="mt-2 text-white/70">Cuando tengas al menos 10 personas que escribieron, aquí verás qué está funcionando y qué mejorar.</p>}
          </div>
        </div>
      </div>

      {semanas.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold">Semana a semana</h3>
          <div className="mt-3 overflow-x-auto rounded-3xl border border-white/10">
            <table className="w-full min-w-[620px] text-sm">
              <thead className="bg-white/[0.06] text-left text-xs uppercase tracking-wider text-white/55">
                <tr><th className="p-3">Semana</th><th className="p-3">Escribieron</th><th className="p-3">Agendaron</th><th className="p-3">Asistieron</th><th className="p-3">Empezaron</th><th className="p-3">Inversión</th><th className="p-3">Vendido</th></tr>
              </thead>
              <tbody>
                {semanas.slice().reverse().map((s) => {
                  const r = reportes[s];
                  return (
                    <tr key={s} onClick={() => elegir(s)} className="cursor-pointer border-t border-white/5 hover:bg-white/[0.04]">
                      <td className="p-3 font-semibold">{fechaCorta(s)}</td>
                      <td className="p-3"><div className="flex items-center gap-2"><div className="h-2 rounded bg-[#00c2e8]" style={{ width: `${(r.escribieron / maxEsc) * 60}px` }} />{r.escribieron}</div></td>
                      <td className="p-3">{r.agendaron}</td><td className="p-3">{r.asistieron}</td><td className="p-3 font-bold text-[#c6f432]">{r.iniciaron}</td>
                      <td className="p-3">{r.inversion ? cop(r.inversion) : "—"}</td><td className="p-3">{r.ventas ? cop(r.ventas) : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Tu perfil (cómo debe verse cada red, con el porqué) ----------
type DestacadaP = { nombre: string; icono: string; contenido: string; porque: string };
type CampoP = { etiqueta: string; valor: string; nota?: string };
type PerfilData = {
  intro: string; comoSeMueven: string[];
  instagram: {
    usuario: string; antes: { nombre: string; bio: string[]; enlace: string; destacadas: string };
    foto: { indicaciones: string[]; porque: string }; nombre: string; nombrePorque: string; categoria: string;
    bio: { texto: string; que: string }[]; bioPorque: string; enlace: string; enlaceTexto: string; enlacePorque: string;
    destacadas: DestacadaP[]; destacadasPorque: string; fijados: string[]; fijadosPorque: string;
  };
  facebook: { pagina: string; campos: CampoP[]; tareasExtra: string[]; porque: string };
  tiktok: { campos: CampoP[]; porque: string };
};

function Copiar({ texto, label = "Copiar" }: { texto: string; label?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button type="button" onClick={() => { navigator.clipboard?.writeText(texto); setOk(true); setTimeout(() => setOk(false), 1500); }}
      className="inline-flex flex-none items-center gap-1 rounded-full bg-[#c6f432] px-3 py-1.5 text-xs font-bold text-[#03101b]">
      <Copy className="h-3.5 w-3.5" />{ok ? "¡Copiado!" : label}
    </button>
  );
}
const Num = ({ n }: { n: number }) => (
  <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-[#ff9f43] text-xs font-extrabold text-[#03101b] shadow">{n}</span>
);

function Perfil({ p }: { p: PerfilData }) {
  const [red, setRed] = useState<"instagram" | "facebook" | "tiktok">("instagram");
  const ig = p.instagram;
  const bioTxt = ig.bio.map((b) => b.texto).join("\n");
  return (
    <div className="space-y-8">
      <p className="max-w-3xl text-lg text-white/75">{p.intro}</p>
      <div className="flex flex-wrap gap-2">
        {([["instagram", "📸 Instagram"], ["facebook", "👍 Facebook"], ["tiktok", "🎵 TikTok"]] as const).map(([k, l]) => (
          <button key={k} type="button" onClick={() => setRed(k)} className={cn("rounded-full px-4 py-2 text-sm font-bold", red === k ? "bg-white text-[#03101b]" : "bg-white/10")}>{l}</button>
        ))}
      </div>

      {red === "instagram" && (
        <>
          <div className="grid items-start gap-8 lg:grid-cols-[340px_1fr]">
            {/* Celular con el perfil ideal */}
            <div className="mx-auto w-full max-w-[340px] rounded-[2.4rem] border-[6px] border-white/15 bg-white p-4 text-[#111] shadow-2xl">
              <div className="mx-auto mb-3 h-1.5 w-20 rounded-full bg-black/15" />
              <p className="text-center text-sm font-bold">{ig.usuario}</p>
              <div className="mt-3 flex items-center gap-4">
                <div className="relative">
                  <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-[#00c2e8] to-[#0a6b7a] p-[3px]">
                    <div className="grid h-full w-full place-items-center rounded-full bg-[#7fd6cf] text-3xl">👩‍⚕️</div>
                  </div>
                  <span className="absolute -left-2 -top-2"><Num n={1} /></span>
                </div>
                <div className="flex flex-1 justify-around text-center text-xs">
                  <div><b className="block text-sm">157</b>publicaciones</div><div><b className="block text-sm">339</b>seguidores</div><div><b className="block text-sm">138</b>seguidos</div>
                </div>
              </div>
              <div className="mt-3 space-y-0.5 text-[12.5px] leading-snug">
                <p className="flex items-center gap-1.5 font-bold"><Num n={2} /> {ig.nombre}</p>
                <p className="pl-7 text-black/50">{ig.categoria}</p>
                {ig.bio.map((b, k) => <p key={k} className="flex items-center gap-1.5"><Num n={3 + k} /> {b.texto}</p>)}
                <p className="flex items-center gap-1.5 font-semibold text-[#00376b]"><Num n={3 + ig.bio.length} /> 🔗 {ig.enlaceTexto}</p>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-1.5 text-center text-xs font-semibold">
                <span className="rounded-lg bg-black/5 py-1.5">Seguir</span><span className="rounded-lg bg-black/5 py-1.5">Mensaje</span>
              </div>
              <div className="relative mt-4 flex gap-2.5 overflow-x-auto pb-1">
                <span className="absolute -top-1 left-0 z-10"><Num n={4 + ig.bio.length} /></span>
                {ig.destacadas.map((d) => (
                  <div key={d.nombre} className="flex w-14 flex-none flex-col items-center">
                    <div className="grid h-14 w-14 place-items-center rounded-full border-2 border-black/10 bg-[#0a6b7a] text-xl">{d.icono}</div>
                    <span className="mt-1 w-full truncate text-center text-[10px]">{d.nombre}</span>
                  </div>
                ))}
              </div>
              <div className="relative mt-3 grid grid-cols-3 gap-0.5">
                <span className="absolute -left-2 -top-2 z-10"><Num n={5 + ig.bio.length} /></span>
                {[0, 1, 2, 3, 4, 5].map((k) => (
                  <div key={k} className={cn("relative aspect-[3/4] rounded-sm", k < 3 ? "bg-[#0a6b7a]" : "bg-black/10")}>
                    {k < 3 && <span className="absolute right-1 top-1 text-[10px]">📌</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Explicación numerada */}
            <ol className="min-w-0 space-y-3">
              <li className="flex gap-3 rounded-2xl bg-white/[0.04] p-4 [&>div]:min-w-0 [&>div]:flex-1"><Num n={1} /><div><p className="font-semibold">Foto de perfil</p>
                <ul className="mt-1 list-disc pl-5 text-sm text-white/75">{ig.foto.indicaciones.map((x) => <li key={x}>{x}</li>)}</ul>
                <p className="mt-1 text-sm text-[#8fdff0]">💡 {ig.foto.porque}</p></div></li>
              <li className="flex gap-3 rounded-2xl bg-white/[0.04] p-4 [&>div]:min-w-0 [&>div]:flex-1"><Num n={2} /><div className="flex-1"><p className="font-semibold">Nombre (se busca) y categoría “{ig.categoria}”</p>
                <div className="mt-2 flex flex-wrap items-center gap-2"><code className="break-words rounded-lg bg-black/30 px-2 py-1 text-sm">{ig.nombre}</code><Copiar texto={ig.nombre} /></div>
                <p className="mt-1 text-sm text-[#8fdff0]">💡 {ig.nombrePorque}</p></div></li>
              {ig.bio.map((b, k) => (
                <li key={k} className="flex gap-3 rounded-2xl bg-white/[0.04] p-4 [&>div]:min-w-0 [&>div]:flex-1"><Num n={3 + k} /><div><p className="font-semibold">Biografía, línea {k + 1}: {b.que}</p><p className="text-sm text-white/75">{b.texto}</p></div></li>
              ))}
              <li className="flex gap-3 rounded-2xl bg-white/[0.04] p-4 [&>div]:min-w-0 [&>div]:flex-1"><Num n={3 + ig.bio.length} /><div className="flex-1"><p className="font-semibold">Enlace de WhatsApp con mensaje ya escrito</p>
                <div className="mt-2 flex flex-wrap items-center gap-2"><code className="block max-w-full truncate rounded-lg bg-black/30 px-2 py-1 text-xs">{ig.enlace}</code><Copiar texto={ig.enlace} label="Copiar enlace" /></div>
                <p className="mt-1 text-sm text-[#8fdff0]">💡 {ig.enlacePorque}</p></div></li>
              <li className="flex gap-3 rounded-2xl bg-white/[0.04] p-4 [&>div]:min-w-0 [&>div]:flex-1"><Num n={4 + ig.bio.length} /><div><p className="font-semibold">Historias destacadas (en este orden)</p><p className="mt-1 text-sm text-[#8fdff0]">💡 {ig.destacadasPorque}</p></div></li>
              <li className="flex gap-3 rounded-2xl bg-white/[0.04] p-4 [&>div]:min-w-0 [&>div]:flex-1"><Num n={5 + ig.bio.length} /><div><p className="font-semibold">3 publicaciones fijadas 📌</p>
                <ul className="mt-1 list-disc pl-5 text-sm text-white/75">{ig.fijados.map((x) => <li key={x}>{x}</li>)}</ul>
                <p className="mt-1 text-sm text-[#8fdff0]">💡 {ig.fijadosPorque}</p></div></li>
            </ol>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#ff9f43]">❌ Antes</p>
              <p className="mt-2 text-sm font-semibold">{ig.antes.nombre}</p>
              {ig.antes.bio.map((x) => <p key={x} className="text-sm text-white/70">{x}</p>)}
              <p className="mt-1 text-xs text-white/50">{ig.antes.enlace} · {ig.antes.destacadas}</p>
            </div>
            <div className="rounded-3xl border border-[#c6f432]/40 bg-[#c6f432]/[0.06] p-5">
              <div className="flex items-center justify-between gap-2"><p className="text-xs font-bold uppercase tracking-wider text-[#c6f432]">✅ Nueva biografía (copiar y pegar)</p><Copiar texto={bioTxt} /></div>
              <pre className="mt-2 whitespace-pre-wrap font-sans text-sm">{bioTxt}</pre>
              <p className="mt-2 text-xs text-white/55">💡 {ig.bioPorque}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Las {ig.destacadas.length} destacadas</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ig.destacadas.map((d, k) => (
                <div key={d.nombre} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-[#0a6b7a] text-xl">{d.icono}</span>
                    <div><p className="text-xs text-white/50">Destacada {k + 1}</p><p className="font-semibold">{d.nombre}</p></div>
                    <span className="ml-auto"><Copiar texto={d.nombre} label="Nombre" /></span>
                  </div>
                  <p className="mt-3 text-sm text-white/80"><b>Qué poner:</b> {d.contenido}</p>
                  <p className="mt-1 text-sm text-[#8fdff0]">💡 {d.porque}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {(red === "facebook" || red === "tiktok") && (() => {
        const r = red === "facebook" ? p.facebook : p.tiktok;
        return (
          <div className="space-y-4">
            {red === "facebook" && <p className="text-sm text-white/60">Página que se trabaja: <b className="text-white">{p.facebook.pagina}</b></p>}
            <div className="space-y-2">
              {r.campos.map((c) => (
                <div key={c.etiqueta} className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="min-w-[180px] text-xs font-bold uppercase tracking-wider text-[#8fdff0]">{c.etiqueta}</div>
                  <div className="flex-1 text-sm">{c.valor}{c.nota && <span className="mt-1 block text-xs text-[#ffd2a6]">⚠️ {c.nota}</span>}</div>
                  <Copiar texto={c.valor} />
                </div>
              ))}
            </div>
            {red === "facebook" && p.facebook.tareasExtra.length > 0 && (
              <ul className="list-disc space-y-1 pl-5 text-sm text-white/75">{p.facebook.tareasExtra.map((x) => <li key={x}>{x}</li>)}</ul>
            )}
            <p className="rounded-2xl bg-[#00c2e8]/[0.08] p-4 text-sm text-[#8fdff0]">💡 {r.porque}</p>
          </div>
        );
      })()}

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <h3 className="text-xl font-semibold">¿Cómo se mueven las redes hoy?</h3>
        <ul className="mt-3 space-y-2">
          {p.comoSeMueven.map((x, k) => <li key={k} className="flex gap-3 text-sm text-white/80"><span className="font-bold text-[#c6f432]">{k + 1}.</span>{x}</li>)}
        </ul>
      </div>
    </div>
  );
}

// ---------- Reuniones (asesoría semanal de 60 min) ----------
type ReunionP = { id: string; fecha: string; hora: string; duracion: number; modalidad: string; estado: string; tema: string; enlace: string; notas: string; acuerdos: string[] };

function ReunionesCliente({ reuniones, marcas, marcar }: { reuniones: ReunionP[]; marcas: Record<string, boolean>; marcar: (k: string) => void }) {
  const lista = [...reuniones].filter((r) => r.estado !== "cancelada").sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
  const hoy = new Date().toISOString().slice(0, 10);
  const proxima = lista.find((r) => r.fecha >= hoy && r.estado !== "realizada");
  const pasadas = lista.filter((r) => r.estado === "realizada" || r.fecha < hoy).reverse();
  const futuras = lista.filter((r) => r !== proxima && r.fecha >= hoy && r.estado !== "realizada");
  const larga = (f: string) => new Date(f + "T12:00:00").toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });
  const hora12 = (h: string) => { const [hh, mm] = h.split(":").map(Number); return `${((hh + 11) % 12) + 1}:${String(mm).padStart(2, "0")} ${hh < 12 ? "a. m." : "p. m."}`; };
  const gcal = (r: ReunionP) => {
    const ini = new Date(`${r.fecha}T${r.hora}:00-05:00`), fin = new Date(ini.getTime() + (r.duracion || 60) * 60000);
    const z = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Asesoría de marketing con biwov")}&dates=${z(ini)}/${z(fin)}&details=${encodeURIComponent(r.tema + (r.enlace ? "\nEnlace: " + r.enlace : ""))}`;
  };
  return (
    <div className="space-y-8">
      {proxima ? (
        <div className="rounded-3xl bg-white p-6 text-[#03101b] md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0a2642]/55">Próxima asesoría · {proxima.duracion || 60} min · {proxima.modalidad || "virtual"}</p>
          <p className="mt-2 text-3xl font-semibold capitalize tracking-tight md:text-4xl">{larga(proxima.fecha)}</p>
          <p className="text-xl text-[#0a2642]/70">{hora12(proxima.hora)}{proxima.estado === "por confirmar" ? " · por confirmar" : ""}</p>
          <p className="mt-3 text-[#0a2642]/80">{proxima.tema}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {proxima.enlace
              ? <a href={proxima.enlace} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#03101b] px-5 py-2.5 text-sm font-bold text-white">🎥 Entrar a la reunión</a>
              : <span className="rounded-full bg-[#03101b]/10 px-5 py-2.5 text-sm font-semibold">El enlace te llega antes de la reunión</span>}
            <a href={gcal(proxima)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#c6f432] px-5 py-2.5 text-sm font-bold">📅 Agregar a mi calendario</a>
          </div>
        </div>
      ) : <p className="text-white/60">Pronto programamos la próxima asesoría.</p>}

      {futuras.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold">Próximas fechas</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {futuras.map((r) => (
              <div key={r.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="font-semibold capitalize">{larga(r.fecha)} · {hora12(r.hora)}</p>
                <p className="text-sm text-white/60">{r.tema}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {pasadas.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold">Lo que hemos hablado</h3>
          <div className="mt-3 space-y-3">
            {pasadas.map((r) => (
              <div key={r.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm font-bold capitalize text-[#8fdff0]">{larga(r.fecha)}</p>
                <p className="mt-1 font-semibold">{r.tema}</p>
                {r.notas && <p className="mt-2 whitespace-pre-wrap text-sm text-white/75">{r.notas}</p>}
                {r.acuerdos?.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-white/45">Acuerdos</p>
                    {r.acuerdos.map((a, i) => {
                      const k = `${r.id}_${i}`, on = !!marcas[k];
                      return (
                        <button key={k} type="button" onClick={() => marcar(k)} className="flex w-full items-center gap-3 rounded-xl bg-white/[0.04] p-2.5 text-left text-sm">
                          <span className={cn("grid h-5 w-5 flex-none place-items-center rounded-full border-2", on ? "border-[#c6f432] bg-[#c6f432] text-[#03101b]" : "border-white/30")}>{on && <Check className="h-3 w-3" />}</span>
                          <span className={cn(on && "text-white/50 line-through")}>{a}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Página ----------
const TABS = [
  { id: "calendario", label: "Calendario", icon: CalendarDays },
  { id: "guiones", label: "Guiones", icon: Clapperboard },
  { id: "tareas", label: "Tus tareas", icon: ListChecks },
  { id: "perfil", label: "Tu perfil", icon: UserRound },
  { id: "reuniones", label: "Reuniones", icon: Video },
  { id: "estrategia", label: "Estrategia", icon: Target },
  { id: "resultados", label: "Resultados", icon: TrendingUp },
  { id: "calculadora", label: "Calculadora", icon: BarChart3 },
  { id: "ideas", label: "Ideas", icon: Lightbulb },
] as const;

export function PlanCliente({ slug, nombre, negocio, plan }: { slug: string; nombre?: string; negocio?: string; plan?: DocumentosCliente["plan"] }) {
  const [items, setItems] = useState<Item[]>([]);
  const [marcas, setMarcas] = useState<Record<string, boolean>>({});
  const [ideas, setIdeas] = useState<Record<string, Idea>>({});
  const [estado, setEstado] = useState<"cargando" | "ok" | "error">("cargando");
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("calendario");
  const [aviso, setAviso] = useState("");
  const [semana, setSemana] = useState(1);
  const [idea, setIdea] = useState({ texto: "", link: "" });
  const [reportes, setReportes] = useState<Record<string, Reporte>>({});
  const [calcPub, setCalcPub] = useState<Calc | null>(null);
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [reuniones, setReuniones] = useState<ReunionP[]>([]);
  const [info, setInfo] = useState({ cliente: "", desde: "", hasta: "" });

  // Abrir una pestaña directo desde el enlace: …/plan#perfil, #resultados, #guiones…
  useEffect(() => {
    const h = window.location.hash.replace("#", "");
    // Solo al cargar: el hash no existe en el servidor, por eso se lee aquí
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (TABS.some((t) => t.id === h)) setTab(h as (typeof TABS)[number]["id"]);
  }, []);

  useEffect(() => {
    leerPlan(slug).then((r) => {
      setItems(r.items); setMarcas(r.marcas); setIdeas(r.ideas); setReportes(r.reportes); setCalcPub(r.calculadora); setPerfil(r.perfil); setReuniones(r.reuniones);
      setInfo({ cliente: r.cliente, desde: r.desde, hasta: r.hasta }); setEstado("ok");
    }).catch(() => setEstado("error"));
  }, [slug]);

  const avisar = (t: string) => { setAviso(t); setTimeout(() => setAviso(""), 2500); };
  const marcar = async (k: string) => {
    const v = !marcas[k];
    setMarcas((m) => ({ ...m, [k]: v }));
    try { await guardarCampo(slug, "marcas", k, { booleanValue: v }); avisar(v ? "¡Listo! Marcado ✅" : "Desmarcado"); }
    catch { setMarcas((m) => ({ ...m, [k]: !v })); avisar("No se pudo guardar. Revisa tu conexión."); }
  };
  const enviarIdea = async () => {
    if (idea.texto.trim().length < 4) return;
    const k = `c${Date.now()}`;
    const v: Idea = { texto: idea.texto.trim().slice(0, 600), link: idea.link.trim().slice(0, 300), fecha: new Date().toISOString() };
    try { await guardarCampo(slug, "ideasCliente", k, { stringValue: JSON.stringify(v) }); setIdeas((x) => ({ ...x, [k]: v })); setIdea({ texto: "", link: "" }); avisar("¡Idea enviada! La revisamos en la próxima reunión 💡"); }
    catch { avisar("No se pudo enviar la idea. Intenta de nuevo."); }
  };

  const guardarReporte = async (semana: string, r: Reporte) => {
    try {
      await guardarCampo(slug, "reportes", "s" + semana.replaceAll("-", ""), { stringValue: JSON.stringify(r) });
      setReportes((x) => ({ ...x, [semana]: r })); avisar("¡Reporte guardado! Tu equipo ya lo puede ver 📊");
    } catch { avisar("No se pudo guardar el reporte. Intenta de nuevo."); }
  };
  // Calculadora: la de la oficina o la del documento; si ya hay reportes suficientes, usa los porcentajes REALES
  const calcBase = calcPub || plan?.calculadora || null;
  const tr = totalesReportes(reportes);
  const calc: Calc | null = calcBase && tr.escribieron >= 20 ? {
    ...calcBase,
    pctAgenda: Math.max(1, pct(tr.agendaron, tr.escribieron)),
    ...(tr.agendaron >= 5 ? { pctAsiste: Math.max(10, pct(tr.asistieron, tr.agendaron)), pctAsisteMedido: true } : {}),
    ...(tr.asistieron >= 5 ? { pctInicia: Math.max(10, pct(tr.iniciaron, tr.asistieron)) } : {}),
    fuente: calcBase.fuente + ` Actualizado con tus reportes: ${tr.escribieron} conversaciones, ${tr.agendaron} citas, ${tr.asistieron} asistieron, ${tr.iniciaron} empezaron.`,
  } : calcBase;
  const desde = plan?.desde || fechaLarga(info.desde), hasta = plan?.hasta || fechaLarga(info.hasta);
  const reels = items.filter((i) => i.tipo === "reel");
  const principales = reels.filter((r) => !r.opcion);
  const historias = items.filter((i) => i.tipo === "historia");
  const tareas = items.filter((i) => i.tipo === "tarea");
  const banco = items.filter((i) => i.tipo === "idea");
  // Avance: 3 reels por semana (los ⭐ o los que elija de las opciones), historias y tareas
  const total = principales.length * 2 + historias.length + tareas.length;
  const hechosReels = Math.min(principales.length * 2, reels.reduce((a, r) => a + (marcas[`${r.id}_grabado`] ? 1 : 0) + (marcas[`${r.id}_publicado`] ? 1 : 0), 0));
  const hechos = hechosReels + historias.filter((h) => marcas[h.id]).length + tareas.filter((t) => marcas[t.id]).length;
  const avance = total ? Math.round((hechos / total) * 100) : 0;
  const semanas = [...new Set(reels.map((r) => r.semana))].sort();

  return (
    <section className="mx-auto max-w-5xl px-4 pb-24 pt-10 md:px-8 md:pt-14">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">{negocio || info.cliente}</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-6xl">Tu plan de trabajo</h1>
          <p className="mt-3 max-w-xl text-lg text-text-secondary">{nombre ? `${nombre}, a` : "A"}quí está todo lo del {desde} al {hasta}: qué publicar cada día, tus guiones y por qué lo hacemos. Ve marcando lo que haces ✅</p>
        </div>
        <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
          <svg viewBox="0 0 120 120" className="h-20 w-20">
            <circle cx="60" cy="60" r="50" stroke="#ffffff1a" strokeWidth="12" fill="none" />
            <circle cx="60" cy="60" r="50" stroke="#c6f432" strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray={`${avance * 3.14} 314`} transform="rotate(-90 60 60)" />
            <text x="60" y="68" textAnchor="middle" fill="#fff" fontSize="26" fontWeight="700">{avance}%</text>
          </svg>
          <div className="text-sm">
            <p className="font-bold">Tu avance del mes</p>
            <p className="text-white/60">{hechos} de {total} pasos</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-2 md:gap-3">
        {[["🎬", reels.length, reels.some((r) => r.opcion) ? `guiones (${Math.round(reels.length / Math.max(1, semanas.length))} por semana)` : "reels del mes"], ["📱", historias.length, "días de historias"], ["✅", tareas.length, "tareas para ti"]].map(([e, n, l]) => (
          <div key={String(l)} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 md:p-4">
            <p className="text-2xl font-semibold md:text-3xl">{e} {n}</p>
            <p className="text-xs text-white/55 md:text-sm">{l}</p>
          </div>
        ))}
      </div>

      <nav className="sticky top-0 z-10 -mx-4 mt-8 flex gap-1 overflow-x-auto border-b border-white/10 bg-bg-deep/95 px-4 backdrop-blur md:mx-0 md:px-0">
        {TABS.map((t) => (
          <button key={t.id} type="button" onClick={() => { setTab(t.id); history.replaceState(null, "", `#${t.id}`); }}
            className={cn("flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-bold transition-colors", tab === t.id ? "border-[#c6f432] text-white" : "border-transparent text-white/55 hover:text-white")}>
            <t.icon className="h-4 w-4 text-[#00c2e8]" /> {t.label}
          </button>
        ))}
      </nav>

      <div className="mt-8">
        {estado === "cargando" && <p className="text-white/60">Cargando tu plan…</p>}
        {estado === "error" && <p className="rounded-2xl bg-red-500/10 p-4 text-red-200">No pudimos cargar el plan. Recarga la página o escríbenos por WhatsApp.</p>}

        {estado === "ok" && tab === "calendario" && (
          <>
            <Calendario items={items} marcas={marcas} marcar={marcar} />
            <PorQue>
              <p>Publicar con un calendario fijo le enseña al algoritmo (y a tu público) cuándo esperar tu contenido. Los reels se publican martes, jueves y sábado; las historias van de lunes a sábado.</p>
              <p>Los reels sirven para que <b>te descubran</b> personas nuevas; las historias, para que <b>quienes ya te siguen confíen y te escriban</b>.</p>
            </PorQue>
          </>
        )}

        {estado === "ok" && tab === "guiones" && (
          <>
            <div className="flex flex-wrap gap-2">
              {semanas.map((s) => (
                <button key={s} type="button" onClick={() => setSemana(s)} className={cn("rounded-full px-4 py-2 text-sm font-bold", s === semana ? "bg-white text-[#03101b]" : "bg-white/10 text-white/70")}>
                  Semana {s}
                </button>
              ))}
            </div>
            {(() => {
              const sem = reels.filter((r) => r.semana === semana).sort((a, b) => (a.fecha || "9").localeCompare(b.fecha || "9"));
              const opciones = sem.filter((r) => r.opcion);
              return opciones.length ? (
                <>
                  <p className="mt-4 text-sm text-white/65">Esta semana hay <b>{sem.length} guiones</b>. Publica los ⭐ del calendario; si alguno no te convence, cámbialo por una de las opciones 🔁.</p>
                  <h3 className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-[#c6f432]">⭐ Recomendados (en el calendario)</h3>
                  <div className="mt-3 space-y-4">{sem.filter((r) => !r.opcion).map((r) => <ReelCard key={r.id} it={r} marcas={marcas} marcar={marcar} />)}</div>
                  <h3 className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-[#8fdff0]">🔁 Opciones para cambiar o grabar de más</h3>
                  <div className="mt-3 space-y-4">{opciones.map((r) => <ReelCard key={r.id} it={r} marcas={marcas} marcar={marcar} />)}</div>
                </>
              ) : (
                <>
                  <p className="mt-4 text-sm text-white/65">Esta semana: <b>{sem.length} {sem.length === 1 ? "reel" : "reels"}</b>, cada uno con su fecha de publicación. Puedes grabar varios el mismo día.</p>
                  <div className="mt-4 space-y-4">{sem.map((r) => <ReelCard key={r.id} it={r} marcas={marcas} marcar={marcar} />)}</div>
                </>
              );
            })()}
            <PorQue>
              <p>Cada guion tiene un <b>gancho de 3 segundos</b> (lo que se ve, lo que se lee y lo primero que dices), porque en ese tiempo la gente decide si sigue viendo o pasa al siguiente video.</p>
              <p>Lo que más premian hoy Instagram y TikTok es que <b>vean el video completo</b> y que lo <b>envíen a otra persona</b>. Por eso los videos son cortos (25 a 35 s), numerados (“1, 2, 3”) y cierran con algo como “envíaselo a…”.</p>
            </PorQue>
          </>
        )}

        {estado === "ok" && tab === "tareas" && (
          <>
            <div className="space-y-2">{tareas.map((t) => <TareaFila key={t.id} it={t} marcas={marcas} marcar={marcar} />)}</div>
            <PorQue>
              <p>Grabar en lotes (6 videos en una mañana) ahorra tiempo y te da material para dos semanas. Las reseñas en Google son lo que más confianza da a quien te busca por primera vez.</p>
            </PorQue>
          </>
        )}

        {estado === "ok" && tab === "estrategia" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold">Así llega un paciente nuevo</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {(["TOFU", "MOFU", "BOFU"] as const).map((e, k) => {
                  const n = reels.filter((r) => r.embudo === e).length;
                  return (
                    <div key={e} className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-5" style={{ marginInline: `${k * 4}%` }}>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#8fdff0]">Paso {k + 1}</p>
                      <p className="mt-1 text-xl font-semibold">{EMBUDO[e].nombre}</p>
                      <p className="text-sm text-white/60">{EMBUDO[e].que}</p>
                      <p className="mt-3 text-sm"><b>{n}</b> reels este mes</p>
                    </div>
                  );
                })}
              </div>
              <PorQue>
                <p>Nadie agenda con alguien que acaba de conocer. Primero te descubren (videos que interesan a cualquiera), luego te conocen (videos que quitan miedos y dudas) y al final te escriben (invitación clara con precio y WhatsApp).</p>
                <p>Tu cuenta tenía casi todo en “te descubren” y “te escriben”, y muy poco en el medio. Por eso este mes reforzamos la confianza.</p>
              </PorQue>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Los 3 tipos de contenido</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {Object.entries(PILAR).map(([k, p]) => (
                  <div key={k} className="rounded-3xl p-5" style={{ background: `${p.color}1f`, border: `1px solid ${p.color}55` }}>
                    <Badge pilar={k} />
                    <p className="mt-3 text-sm text-white/80">{p.que}</p>
                    <p className="mt-3 text-sm"><b>{reels.filter((r) => r.pilar === k).length}</b> reels</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Lo que el algoritmo premia (y cómo lo usamos)</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {[
                  ["⏱️ Que vean el video completo", "Videos cortos, una idea por video, cambios de plano cada 5–7 segundos y numerar (1, 2, 3)."],
                  ["📤 Que lo envíen a alguien", "Temas que la gente quiere compartir: “envíaselo a quien aprieta los dientes”."],
                  ["📌 Que lo guarden", "Información útil para después: precios, opciones, cuidados."],
                  ["💬 Que comenten", "Terminar con una pregunta y responder los comentarios con nuevos videos."],
                ].map(([t, x]) => (
                  <div key={t} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"><p className="font-semibold">{t}</p><p className="mt-1 text-sm text-white/65">{x}</p></div>
                ))}
              </div>
              <PorQue>
                <p>Instagram ha dicho públicamente que sus señales principales son el tiempo de reproducción, los “me gusta” y los envíos por cada persona alcanzada. Los envíos son los que más ayudan a llegar a gente que todavía no te sigue.</p>
                <p>Cada semana revisamos tus números (retención a los 3 segundos, envíos y mensajes) y repetimos el formato que mejor funcionó.</p>
              </PorQue>
            </div>
          </div>
        )}

        {estado === "ok" && tab === "reuniones" && (
          <>
            <ReunionesCliente reuniones={reuniones} marcas={marcas} marcar={marcar} />
            <PorQue>
              <p>Cada semana nos reunimos 60 minutos por videollamada para revisar tus números, ver qué contenido funcionó y decidir qué hacer la semana siguiente. Aquí quedan las notas y los acuerdos, para que nada se pierda.</p>
            </PorQue>
          </>
        )}

        {estado === "ok" && tab === "perfil" && (
          perfil ? (
            <>
              <Perfil p={perfil} />
              <div className="mt-6 space-y-2">
                <h3 className="text-lg font-semibold">Tareas para dejar tu perfil listo</h3>
                {tareas.filter((t) => (t as Item & { grupo?: string }).grupo === "perfil").map((t) => <TareaFila key={t.id} it={t} marcas={marcas} marcar={marcar} />)}
              </div>
            </>
          ) : <p className="text-white/60">Pronto verás aquí cómo debe quedar tu perfil.</p>
        )}

        {estado === "ok" && tab === "resultados" && (
          <>
            <Resultados reportes={reportes} guardar={guardarReporte} />
            <PorQue>
              <p>La publicidad trae conversaciones, pero lo que importa son los clientes. Con tu reporte de cada semana sabemos en qué paso se están quedando las personas (no escriben, no agendan, no llegan o no empiezan) y ahí enfocamos la mejora.</p>
              <p>Tus números también actualizan la calculadora: deja de usar supuestos y usa tus resultados reales.</p>
            </PorQue>
          </>
        )}

        {estado === "ok" && tab === "calculadora" && (
          <>
            <h2 className="text-2xl font-semibold">¿Cuánto invertir para lograr tu meta?</h2>
            <p className="mt-2 max-w-2xl text-white/65">Mueve las barras. Partimos de tus números reales de pauta y de lo que nos contaste en el cuestionario.</p>
            {calc ? <div className="mt-6"><Calculadora c={calc} /></div> : <p className="mt-6 text-white/60">La calculadora se activa cuando cargamos los datos de tus anuncios.</p>}
            <PorQue>
              <p>La publicidad compra <b>conversaciones</b>, no pacientes. El resultado final depende de cuántas de esas conversaciones agendan y de cuántas citas terminan en tratamiento.</p>
              <p>Por eso trabajamos dos cosas a la vez: que cada conversación cueste poco (buenos anuncios) y que más personas agenden (respuesta rápida, seguimiento y oferta clara).</p>
            </PorQue>
          </>
        )}

        {estado === "ok" && tab === "ideas" && (
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold">Banco de ideas</h2>
              <p className="mt-1 text-sm text-white/60">Ideas listas para los próximos meses.</p>
              <div className="mt-4 space-y-2">
                {banco.map((b) => (
                  <div key={b.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center gap-2"><Badge pilar={b.pilar} /></div>
                    <p className="mt-2 font-semibold">{b.titulo}</p>
                    {b.formato && <p className="text-sm text-white/55">{b.formato}</p>}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">¿Tienes una idea? 💡</h2>
              <p className="mt-1 text-sm text-white/60">Cuéntanos algo que quieras mostrar o pega el enlace de un video que te gustó.</p>
              <div className="mt-4 space-y-3 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <textarea value={idea.texto} onChange={(e) => setIdea({ ...idea, texto: e.target.value })} rows={4} placeholder="Ej.: Quiero mostrar cómo quedan las coronas de zirconio…"
                  className="w-full rounded-2xl border border-white/15 bg-transparent p-3 text-sm outline-none focus:border-[#c6f432]" />
                <input value={idea.link} onChange={(e) => setIdea({ ...idea, link: e.target.value })} placeholder="Enlace de referencia (opcional)"
                  className="w-full rounded-2xl border border-white/15 bg-transparent p-3 text-sm outline-none focus:border-[#c6f432]" />
                <button type="button" onClick={enviarIdea} className="rounded-full bg-[#c6f432] px-5 py-2.5 text-sm font-bold text-[#03101b]">Enviar idea</button>
              </div>
              {Object.keys(ideas).length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/45">Tus ideas enviadas</p>
                  {Object.entries(ideas).sort((a, b) => b[1].fecha.localeCompare(a[1].fecha)).map(([k, v]) => (
                    <div key={k} className="rounded-2xl bg-white/[0.05] p-3 text-sm">
                      <p>{v.texto}</p>
                      {v.link && <a href={v.link} target="_blank" rel="noopener noreferrer" className="mt-1 block truncate text-xs text-[#8fdff0] underline">{v.link}</a>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-14 flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-sm text-white/70">
        <Smartphone className="h-5 w-5 flex-none text-[#00c2e8]" />
        Lo que marcas aquí le llega a tu equipo de biwov. ¿Dudas? WhatsApp +57 313 312 5157.
      </div>

      {aviso && <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#03101b] shadow-2xl">{aviso}</div>}
    </section>
  );
}
