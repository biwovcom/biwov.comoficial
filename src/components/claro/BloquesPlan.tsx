"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Download, Loader2, ReceiptText } from "lucide-react";
import { FORMAS_PAGO, MESES_MINIMOS, POLITICA_COSTOS_TERCEROS, totalSegunPago, type PlanCliente } from "@/data/portafolioClientes";
import { formatCopEnMoneda, type Moneda } from "@/lib/moneda";
import { cn } from "@/lib/utils";

/** Formas de pago con descuento (mensual sin descuento · 4 meses 10% · anual 20%). */
export function FormasPago({ plan, moneda, trm }: { plan: PlanCliente; moneda: Moneda; trm: number }) {
  const base = plan.mensual ? plan.precio : plan.adicional?.mensual ? plan.adicional.precio : null;
  const [sel, setSel] = useState<(typeof FORMAS_PAGO)[number]["id"]>("contrato");
  if (!base) return null;
  const f = FORMAS_PAGO.find((x) => x.id === sel)!;
  const t = totalSegunPago(base, sel);
  const fmt = (n: number) => formatCopEnMoneda(n, moneda, trm);
  return (
    <div className="rounded-3xl border border-[#0a2642]/10 bg-white p-6 shadow-sm md:p-8">
      <h3 className="font-heading text-xl font-extrabold">Elige cómo pagar</h3>
      <p className="mt-1 text-sm text-[#0a2642]/60">Permanencia mínima de {MESES_MINIMOS} meses. Pagando por adelantado tienes descuento.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {FORMAS_PAGO.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setSel(x.id)}
            className={cn(
              "relative rounded-2xl border-2 p-4 text-left transition-all",
              sel === x.id ? "border-[#00c2e8] bg-[#00c2e8]/8 shadow-lg shadow-[#00c2e8]/15" : "border-[#0a2642]/10 hover:border-[#0a2642]/30",
            )}
          >
            {x.descuento > 0 && (
              <span className="absolute -top-3 right-3 rounded-full bg-[#0a2642] px-2.5 py-0.5 text-[11px] font-bold text-white">
                -{Math.round(x.descuento * 100)}%
              </span>
            )}
            <p className="text-sm font-bold">{x.nombre}</p>
            <p className="mt-1 text-xs text-[#0a2642]/60">{x.nota}</p>
          </button>
        ))}
      </div>
      <motion.div key={sel} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-5 flex flex-wrap items-end justify-between gap-3 rounded-2xl bg-[#f4f9fc] p-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0a2642]/50">{f.nombre}</p>
          <p className="mt-1 font-heading text-3xl font-extrabold">{sel === "mensual" ? `${fmt(base)} /mes` : fmt(t.total)}</p>
          {sel !== "mensual" && <p className="text-sm text-[#0a2642]/60">Equivale a {fmt(t.porMes)} al mes · {t.meses} meses</p>}
        </div>
        {t.ahorro > 0 && <p className="rounded-full bg-[#00c2e8]/15 px-4 py-2 text-sm font-bold text-[#0089a8]">Ahorras {fmt(t.ahorro)}</p>}
      </motion.div>
    </div>
  );
}

/** Costos de plataformas: el resumen se ve de una vez; la política completa al dar clic. */
export function CostosTerceros({ plan }: { plan: PlanCliente }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className="rounded-3xl border border-amber-300/60 bg-amber-50/70 p-6 md:p-8">
      <div className="flex items-start gap-3">
        <ReceiptText className="mt-0.5 h-6 w-6 flex-none text-amber-600" />
        <div>
          <h3 className="font-heading text-xl font-extrabold">Costos de plataformas (los pagas directo)</h3>
          <p className="mt-1 text-[15px] text-[#0a2642]/75">{POLITICA_COSTOS_TERCEROS.resumen}</p>
        </div>
      </div>
      {plan.costosTerceros.length > 0 && (
        <ul className="mt-4 space-y-2">
          {plan.costosTerceros.map((c) => (
            <li key={c} className="rounded-xl bg-white px-4 py-3 text-[15px] font-medium shadow-sm">
              {c}
            </li>
          ))}
        </ul>
      )}
      <button type="button" onClick={() => setAbierto((v) => !v)} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0a2642] underline decoration-amber-400 underline-offset-4">
        Ver costos de plataformas y políticas de Meta
        <ChevronDown className={cn("h-4 w-4 transition-transform", abierto && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {abierto && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {[
                { t: "El valor del plan sí incluye", l: POLITICA_COSTOS_TERCEROS.incluye },
                { t: "Lo paga el cliente a cada plataforma", l: POLITICA_COSTOS_TERCEROS.noIncluye },
                { t: "Políticas de Meta", l: POLITICA_COSTOS_TERCEROS.meta },
              ].map((b) => (
                <div key={b.t} className="rounded-2xl bg-white p-5 shadow-sm">
                  <p className="font-heading font-extrabold">{b.t}</p>
                  <ul className="mt-2 space-y-2 text-sm text-[#0a2642]/75">
                    {b.l.map((x) => (
                      <li key={x}>· {x}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Botón para descargar el plan en PDF. */
export function DescargarPdf({ slug, claro }: { slug: string; claro?: boolean }) {
  const [cargando, setCargando] = useState(false);
  return (
    <a
      href={`/api/pdf/plan/${slug}`}
      onClick={() => {
        setCargando(true);
        setTimeout(() => setCargando(false), 2500);
      }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold transition-colors",
        claro ? "border-[#0a2642]/20 text-[#0a2642] hover:bg-[#0a2642]/5" : "border-white/40 text-white hover:bg-white/10",
      )}
    >
      {cargando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Descargar en PDF
    </a>
  );
}

type Msg = { de: "cliente" | "bot"; texto: string; botones?: string[] };

const GUION: Record<"botones" | "conversacional", Msg[]> = {
  botones: [
    { de: "bot", texto: "¡Hola! 👋 Bienvenido. ¿En qué te ayudamos?", botones: ["Precios", "Horarios", "Ubicación", "Hablar con un asesor"] },
    { de: "cliente", texto: "Precios" },
    { de: "bot", texto: "Este es nuestro catálogo con precios 📄. ¿Quieres algo más?", botones: ["Agendar cita", "Hablar con un asesor"] },
    { de: "cliente", texto: "Hablar con un asesor" },
    { de: "bot", texto: "Listo, un asesor te escribe en unos minutos ✅" },
  ],
  conversacional: [
    { de: "cliente", texto: "Hola, ¿cuánto vale el servicio y lo puedo pagar por cuotas? Salgo del trabajo a las 6" },
    { de: "bot", texto: "¡Hola! Claro que sí 😊 El servicio está desde $350.000 y lo puedes pagar en cuotas. Tenemos citas después de las 6 p. m." },
    { de: "cliente", texto: "Me sirve el jueves" },
    { de: "bot", texto: "Perfecto, te aparto el jueves a las 6:30 p. m. ¿Me confirmas tu nombre completo para agendarte?" },
  ],
};

/** Demostración animada de cómo responde cada tipo de chatbot. */
export function DemoChat({ tipo }: { tipo: "botones" | "conversacional" }) {
  const guion = GUION[tipo];
  const [n, setN] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setN((v) => (v >= guion.length ? 1 : v + 1)), 1800);
    return () => clearInterval(t);
  }, [guion.length]);
  return (
    <div className="grid items-center gap-8 rounded-3xl bg-[#0a2642] p-6 text-white md:grid-cols-2 md:p-10">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00c2e8]">Así funciona</p>
        <h3 className="mt-2 font-heading text-2xl font-extrabold">{tipo === "botones" ? "Chatbot básico: responde con botones" : "Agente con IA: conversa como una persona"}</h3>
        <p className="mt-3 text-white/75">
          {tipo === "botones"
            ? "Tu cliente toca una opción y recibe la respuesta que ya dejamos lista. Es rápido, ordenado y no consume IA."
            : "Entiende preguntas libres, responde con la información de tu empresa y agenda. Cada respuesta consume tokens de IA, que paga el cliente directo a la plataforma."}
        </p>
      </div>
      <div className="mx-auto w-full max-w-sm rounded-[28px] border-4 border-white/10 bg-[#e8ddd4] p-3 shadow-2xl">
        <div className="rounded-2xl bg-[#075e54] px-4 py-2 text-sm font-bold">Tu empresa · en línea</div>
        <div className="flex h-80 flex-col justify-end gap-2 overflow-hidden p-2">
          <AnimatePresence initial={false}>
            {guion.slice(0, n).map((m, i) => (
              <motion.div key={`${tipo}-${i}`} layout initial={{ opacity: 0, y: 12, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={cn("max-w-[85%] text-[13px]", m.de === "cliente" ? "self-end" : "self-start")}>
                <div className={cn("rounded-xl px-3 py-2 text-[#111] shadow", m.de === "cliente" ? "bg-[#dcf8c6]" : "bg-white")}>{m.texto}</div>
                {m.botones && (
                  <div className="mt-1 grid gap-1">
                    {m.botones.map((b) => (
                      <span key={b} className="rounded-lg bg-white px-3 py-1.5 text-center text-[12px] font-semibold text-[#0089a8] shadow">
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
