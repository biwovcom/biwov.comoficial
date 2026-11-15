"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { ESCALONES, PLANES_CLIENTES, TICKET_LABEL, type EscalonId, type PlanCliente } from "@/data/portafolioClientes";
import { FooterClaro, HeaderClaro, waBiwov } from "@/components/claro/ChromeClaro";
import { FONDO_ESCALON, ICONOS_PLAN, precioPlan } from "@/components/claro/iconosPlan";
import { useTRM } from "@/hooks/useTRM";
import type { Moneda } from "@/lib/moneda";
import { cn } from "@/lib/utils";

const CLARO_TEXTO = new Set<EscalonId>(["aprende", "asesoria", "automatizacion"]);

function TarjetaPlan({
  plan, activa, moneda, trm, onClick,
}: { plan: PlanCliente; activa: boolean; moneda: Moneda; trm: number; onClick?: () => void }) {
  const Icono = ICONOS_PLAN[plan.icono];
  const textoOscuro = CLARO_TEXTO.has(plan.escalon);
  return (
    <article
      onClick={onClick}
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[28px] shadow-xl transition-colors duration-500",
        activa ? "bg-[#0a2642] shadow-[#0a2642]/30" : "bg-[#5f7a8c] shadow-[#0a2642]/10",
      )}
    >
      {/* Cabecera visual */}
      <div className={cn("relative flex h-40 items-center justify-center bg-gradient-to-br sm:h-48", FONDO_ESCALON[plan.escalon])}>
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_45%)]" />
        <div className="relative flex flex-col items-center gap-3">
          <span className={cn("flex h-16 w-16 items-center justify-center rounded-2xl backdrop-blur", textoOscuro ? "bg-white/70 text-[#0a2642]" : "bg-white/15 text-white")}>
            <Icono className="h-8 w-8" strokeWidth={1.6} />
          </span>
          <span className={cn("rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]", textoOscuro ? "bg-[#0a2642]/10 text-[#0a2642]" : "bg-white/15 text-white")}>
            {TICKET_LABEL[plan.ticket]}
          </span>
        </div>
        {plan.destacado && (
          <span className="absolute right-4 top-4 rounded-full bg-[#00c2e8] px-3 py-1 text-[11px] font-bold text-[#03101b]">Más pedido</span>
        )}
      </div>
      {/* Cuerpo */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className="font-heading text-2xl font-extrabold leading-tight text-white">{plan.nombre}</h3>
        <p className="mt-2 font-heading text-lg font-bold text-[#00c2e8]">
          {precioPlan(plan, moneda, trm)} <span className="text-sm font-semibold text-[#8fdff0]">{plan.unidad}</span>
        </p>
        {plan.adicional && (
          <p className="mt-1 text-xs text-white/60">
            + {plan.adicional.label}: {precioPlan(plan.adicional, moneda, trm)}{plan.adicional.mensual ? " /mes" : ""}
          </p>
        )}
        <p className="mt-4 flex-1 text-[15px] leading-relaxed text-white/80">{plan.gancho}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={waBiwov(plan.mensajeWhatsApp)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#0a2642] transition-transform hover:-translate-y-0.5"
          >
            Lo quiero
          </a>
          <Link
            href={`/planes/${plan.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
          >
            Ver más detalles
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Carrusel con la tarjeta del centro grande y las de los lados atenuadas (estilo julioiero.com). */
function Carrusel({ planes, moneda, trm }: { planes: PlanCliente[]; moneda: Moneda; trm: number }) {
  const [indice, setIndice] = useState(0);
  const [pausa, setPausa] = useState(false);
  const [ancho, setAncho] = useState(1200);
  const n = planes.length;

  useEffect(() => {
    const on = () => setAncho(window.innerWidth);
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  const mover = useCallback((d: number) => setIndice((i) => (i + d + n) % n), [n]);

  useEffect(() => {
    if (pausa || n < 2) return;
    const t = setInterval(() => mover(1), 6000);
    return () => clearInterval(t);
  }, [pausa, mover, n]);

  const movil = ancho < 768;
  const anchoTarjeta = movil ? Math.min(ancho - 56, 360) : 420;
  const paso = movil ? anchoTarjeta + 16 : anchoTarjeta * 0.92;

  const alArrastrar = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) mover(1);
    else if (info.offset.x > 60) mover(-1);
  };

  return (
    <div className="relative" onMouseEnter={() => setPausa(true)} onMouseLeave={() => setPausa(false)}>
      <motion.div
        className="relative mx-auto h-[560px] cursor-grab touch-pan-y active:cursor-grabbing sm:h-[540px]"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        onDragEnd={alArrastrar}
      >
        {planes.map((plan, i) => {
          let off = i - indice;
          if (off > n / 2) off -= n;
          if (off < -n / 2) off += n;
          const visible = Math.abs(off) <= (movil ? 1 : 2);
          const activa = off === 0;
          return (
            <motion.div
              key={plan.slug}
              className="absolute left-1/2 top-4"
              style={{ width: anchoTarjeta, marginLeft: -anchoTarjeta / 2, zIndex: 10 - Math.abs(off) }}
              initial={false}
              animate={{
                x: off * paso,
                scale: activa ? 1 : movil ? 0.92 : 0.86,
                opacity: visible ? 1 : 0,
                y: activa ? 0 : 18,
              }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              <TarjetaPlan plan={plan} activa={activa} moneda={moneda} trm={trm} onClick={activa ? undefined : () => setIndice(i)} />
            </motion.div>
          );
        })}
      </motion.div>

      {n > 1 && (
        <>
          <button
            type="button"
            aria-label="Plan anterior"
            onClick={() => mover(-1)}
            className="absolute left-0 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0a2642] shadow-xl shadow-[#0a2642]/15 transition-transform hover:scale-105 md:left-4 md:h-20 md:w-20"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Plan siguiente"
            onClick={() => mover(1)}
            className="absolute right-0 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0a2642] shadow-xl shadow-[#0a2642]/15 transition-transform hover:scale-105 md:right-4 md:h-20 md:w-20"
          >
            <ArrowRight className="h-6 w-6" />
          </button>
          <div className="mt-2 flex justify-center gap-2">
            {planes.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                aria-label={`Ir a ${p.nombre}`}
                onClick={() => setIndice(i)}
                className={cn("h-2 rounded-full transition-all", i === indice ? "w-8 bg-[#0a2642]" : "w-2 bg-[#0a2642]/25")}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function PlanesCliente() {
  const { trm } = useTRM();
  const [moneda, setMoneda] = useState<Moneda>("COP");
  const [filtro, setFiltro] = useState<EscalonId | "todos">("todos");
  const planes = useMemo(() => (filtro === "todos" ? PLANES_CLIENTES : PLANES_CLIENTES.filter((p) => p.escalon === filtro)), [filtro]);
  const escalonActual = ESCALONES.find((e) => e.id === filtro);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen overflow-x-clip bg-white text-[#0a2642]">
      <HeaderClaro />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#eef8fc] to-white">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-[#00c2e8]/15 blur-3xl" />
        <div className="mx-auto max-w-5xl px-5 pb-10 pt-16 text-center md:px-8 md:pt-24">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-bold uppercase tracking-[0.28em] text-[#00a3c4]">
            Planes biwov para empresarios
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-4 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl"
          >
            Que tu empresa venda <span className="text-[#00a3c4]">sin que tengas que estar en todo</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="mx-auto mt-5 max-w-2xl text-lg text-[#0a2642]/70">
            Elige cómo quieres avanzar: aprender, que te asesoremos o que lo hagamos por ti. Planes claros, con todo lo que incluyen.
          </motion.p>
        </div>

        {/* Filtros por escalón */}
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-2 px-5 md:px-8">
          {[{ id: "todos" as const, nombre: "Todos" }, ...ESCALONES].map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => setFiltro(e.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition-all",
                filtro === e.id ? "border-[#0a2642] bg-[#0a2642] text-white shadow-lg shadow-[#0a2642]/20" : "border-[#0a2642]/15 bg-white text-[#0a2642]/70 hover:border-[#0a2642]/40",
              )}
            >
              {e.nombre}
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-center gap-1 text-xs font-semibold">
          {(["COP", "USD"] as Moneda[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMoneda(m)}
              className={cn("rounded-full px-3 py-1 transition-colors", moneda === m ? "bg-[#00c2e8]/15 text-[#0a2642]" : "text-[#0a2642]/50")}
            >
              {m === "COP" ? "Pesos colombianos" : "Dólares"}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {escalonActual && (
            <motion.p key={escalonActual.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3 text-center text-sm text-[#0a2642]/60">
              {escalonActual.lema}
            </motion.p>
          )}
        </AnimatePresence>

        <div ref={ref} className="mx-auto max-w-7xl px-2 pb-16 pt-6 md:px-8">
          <Carrusel key={filtro} planes={planes} moneda={moneda} trm={trm} />
        </div>
      </section>

      {/* Escalera de valor */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-[0.28em] text-[#00a3c4]">Cómo avanzar</p>
        <h2 className="mt-3 text-center font-heading text-3xl font-extrabold md:text-5xl">Empieza donde estás. Crece cuando quieras.</h2>
        <div className="mt-12 grid gap-4 md:grid-cols-5">
          {ESCALONES.map((e, i) => {
            const delEscalon = PLANES_CLIENTES.filter((p) => p.escalon === e.id);
            const desde = Math.min(...delEscalon.map((p) => p.precio));
            return (
              <motion.button
                key={e.id}
                type="button"
                onClick={() => {
                  setFiltro(e.id);
                  ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group rounded-3xl border border-[#0a2642]/10 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-[#00c2e8] hover:shadow-xl"
              >
                <span className="font-heading text-sm font-black text-[#00a3c4]">0{i + 1}</span>
                <h3 className="mt-2 font-heading text-xl font-extrabold">{e.nombre}</h3>
                <p className="mt-2 text-sm text-[#0a2642]/65">{e.lema}</p>
                <p className="mt-4 text-xs font-semibold text-[#0a2642]/50">
                  {delEscalon.length} {delEscalon.length === 1 ? "plan" : "planes"} · desde {precioPlan({ precio: desde }, moneda, trm)}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#0a2642] group-hover:text-[#00a3c4]">
                  Ver planes <ArrowRight className="h-4 w-4" />
                </span>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Siempre incluido */}
      <section className="bg-[#0a2642] text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2 md:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#00c2e8]">En los planes que ejecutamos</p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold md:text-4xl">Lo esencial del marketing, sin enredos</h2>
            <p className="mt-4 text-white/70">
              Cada plan de ejecución parte de la estrategia. No publicamos por publicar: todo responde a un plan para que te escriban y te compren.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {["Planeación y estrategia", "Guiones", "Copys", "Estrategia de historias", "Embudo de ventas", "Campañas de audiencia y ventas", "Informe de resultados", "La IA trabaja, el equipo supervisa"].map((t) => (
              <li key={t} className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 text-sm font-semibold">
                <Check className="h-4 w-4 flex-none text-[#00c2e8]" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-4xl px-5 py-20 text-center md:px-8">
        <h2 className="font-heading text-3xl font-extrabold md:text-5xl">¿No sabes cuál elegir?</h2>
        <p className="mx-auto mt-4 max-w-xl text-[#0a2642]/70">Cuéntanos cómo está tu empresa y te decimos con qué plan empezar. Sin compromiso.</p>
        <a
          href={waBiwov("Hola, quiero que me ayuden a elegir el plan para mi empresa.")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex rounded-full bg-[#0a2642] px-8 py-4 font-bold text-white shadow-xl shadow-[#0a2642]/25 transition-transform hover:-translate-y-0.5"
        >
          Ayúdame a elegir
        </a>
      </section>

      <FooterClaro />
    </div>
  );
}
