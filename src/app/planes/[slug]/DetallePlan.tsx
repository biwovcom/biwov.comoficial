"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { ESCALONES, PLANES_CLIENTES, TICKET_LABEL, planClientePorSlug } from "@/data/portafolioClientes";
import { FooterClaro, HeaderClaro, waBiwov } from "@/components/claro/ChromeClaro";
import { FONDO_ESCALON, ICONOS_PLAN, precioPlan } from "@/components/claro/iconosPlan";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { CostosTerceros, DemoChat, DescargarPdf, FormasPago } from "@/components/claro/BloquesPlan";
import { useTRM } from "@/hooks/useTRM";
import type { Moneda } from "@/lib/moneda";
import { cn } from "@/lib/utils";

export function DetallePlan({ slug }: { slug: string }) {
  const plan = planClientePorSlug(slug)!;
  const { trm } = useTRM();
  const [moneda, setMoneda] = useState<Moneda>("COP");
  const Icono = ICONOS_PLAN[plan.icono];
  const escalon = ESCALONES.find((e) => e.id === plan.escalon)!;
  const claro = plan.escalon === "aprende" || plan.escalon === "asesoria" || plan.escalon === "automatizacion";
  const otros = PLANES_CLIENTES.filter((p) => p.escalon === plan.escalon && p.slug !== plan.slug);
  const i = PLANES_CLIENTES.findIndex((p) => p.slug === plan.slug);
  const siguiente = PLANES_CLIENTES[(i + 1) % PLANES_CLIENTES.length];

  return (
    <div className="min-h-screen overflow-x-clip bg-white text-[#0a2642]">
      <HeaderClaro mensaje={plan.mensajeWhatsApp} cta="Lo quiero" />

      {/* Hero del plan */}
      <section className={cn("relative overflow-hidden bg-gradient-to-br", FONDO_ESCALON[plan.escalon])}>
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_80%_10%,white_0,transparent_40%)]" />
        <div className={cn("relative mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.4fr_1fr] md:px-8 md:py-24", claro ? "text-[#0a2642]" : "text-white")}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/planes" className={cn("inline-flex items-center gap-2 text-sm font-semibold", claro ? "text-[#0a2642]/70" : "text-white/70")}>
              <ArrowLeft className="h-4 w-4" /> Todos los planes
            </Link>
            <p className={cn("mt-6 text-xs font-bold uppercase tracking-[0.28em]", claro ? "text-[#0a2642]/60" : "text-[#8fdff0]")}>
              {escalon.nombre} · {TICKET_LABEL[plan.ticket]}
            </p>
            <h1 className="mt-3 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">{plan.nombre}</h1>
            <p className={cn("mt-5 max-w-xl text-lg", claro ? "text-[#0a2642]/75" : "text-white/80")}>{plan.gancho}</p>
            <div className="mt-7">
              <DescargarPdf slug={plan.slug} claro={claro} />
            </div>
          </motion.div>

          {/* Tarjeta de precio */}
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="self-start rounded-[28px] bg-white p-7 text-[#0a2642] shadow-2xl shadow-[#0a2642]/20"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00c2e8]/15 text-[#0a2642]">
              <Icono className="h-7 w-7" strokeWidth={1.6} />
            </span>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#0a2642]/50">Inversión</p>
            <p className="mt-1 font-heading text-4xl font-extrabold">{precioPlan(plan, moneda, trm)}</p>
            <p className="text-sm font-semibold text-[#00a3c4]">{plan.unidad}</p>
            {plan.adicional && (
              <p className="mt-3 rounded-2xl bg-[#f3f8fb] px-4 py-3 text-sm">
                <span className="font-semibold">{plan.adicional.label}:</span> {precioPlan(plan.adicional, moneda, trm)}
                {plan.adicional.mensual ? " /mes" : ""}
              </p>
            )}
            <div className="mt-3 flex gap-1 text-xs font-semibold">
              {(["COP", "USD"] as Moneda[]).map((m) => (
                <button key={m} type="button" onClick={() => setMoneda(m)} className={cn("rounded-full px-3 py-1", moneda === m ? "bg-[#0a2642] text-white" : "text-[#0a2642]/50")}>
                  {m === "COP" ? "COP" : "USD"}
                </button>
              ))}
            </div>
            <a
              href={waBiwov(plan.mensajeWhatsApp)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#0a2642] px-6 py-4 font-bold text-white shadow-lg shadow-[#0a2642]/25 transition-transform hover:-translate-y-0.5"
            >
              <WhatsAppIcon className="h-5 w-5" /> Lo quiero
            </a>
            <p className="mt-3 text-center text-xs text-[#0a2642]/50">Te respondemos por WhatsApp y te enviamos el contrato para firmar en línea.</p>
          </motion.aside>
        </div>
      </section>

      {plan.demo && (
        <section className="mx-auto max-w-6xl px-5 pt-16 md:px-8">
          <DemoChat tipo={plan.demo} />
        </section>
      )}

      {/* Para quién */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <h2 className="font-heading text-2xl font-extrabold md:text-3xl">¿Para quién es?</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {plan.paraQuien.map((t, k) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: k * 0.06 }}
              className="rounded-3xl border border-[#0a2642]/10 bg-[#f6f9fc] p-6 text-[15px] font-medium leading-relaxed"
            >
              {t}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Qué incluye */}
      <section className="bg-[#f6f9fc]">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
          <h2 className="font-heading text-2xl font-extrabold md:text-3xl">Todo lo que incluye</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {plan.incluye.map((g) => (
              <div key={g.grupo} className="rounded-3xl bg-white p-7 shadow-sm">
                <h3 className="font-heading text-lg font-extrabold text-[#00a3c4]">{g.grupo}</h3>
                <ul className="mt-4 space-y-3">
                  {g.items.map((it) => (
                    <li key={it} className="flex gap-3 text-[15px] leading-relaxed">
                      <Check className="mt-0.5 h-5 w-5 flex-none text-[#00c2e8]" /> {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {plan.noIncluye.length > 0 && (
            <div className="mt-5 rounded-3xl border border-dashed border-[#0a2642]/20 bg-white p-7">
              <h3 className="font-heading text-lg font-extrabold">No incluye</h3>
              <ul className="mt-4 space-y-2">
                {plan.noIncluye.map((it) => (
                  <li key={it} className="flex gap-3 text-[15px] text-[#0a2642]/70">
                    <X className="mt-0.5 h-5 w-5 flex-none text-[#0a2642]/40" /> {it}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Pago y costos de plataformas */}
      <section className="mx-auto grid max-w-6xl gap-5 px-5 pt-16 md:px-8">
        <FormasPago plan={plan} moneda={moneda} trm={trm} />
        <CostosTerceros plan={plan} />
      </section>

      {/* Cómo funciona */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <h2 className="font-heading text-2xl font-extrabold md:text-3xl">Cómo funciona</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-4">
          {plan.pasos.map((p, k) => (
            <motion.li
              key={p}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: k * 0.08 }}
              className="rounded-3xl bg-[#0a2642] p-6 text-white"
            >
              <span className="font-heading text-3xl font-black text-[#00c2e8]">0{k + 1}</span>
              <p className="mt-3 text-[15px] font-medium leading-relaxed text-white/85">{p}</p>
            </motion.li>
          ))}
        </ol>
        {plan.condiciones.length > 0 && (
          <div className="mt-8 rounded-3xl bg-[#f6f9fc] p-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[#0a2642]/50">Condiciones</h3>
            <ul className="mt-3 space-y-1 text-[15px] text-[#0a2642]/75">
              {plan.condiciones.map((c) => (
                <li key={c}>· {c}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Otros planes */}
      <section className="border-t border-[#0a2642]/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-14 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            {otros.length > 0 && (
              <>
                <p className="text-sm font-semibold text-[#0a2642]/60">Otros planes de “{escalon.nombre}”</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {otros.map((o) => (
                    <Link key={o.slug} href={`/planes/${o.slug}`} className="rounded-full border border-[#0a2642]/15 px-4 py-2 text-sm font-semibold hover:border-[#00c2e8]">
                      {o.nombre}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
          <Link href={`/planes/${siguiente.slug}`} className="inline-flex items-center gap-2 font-heading text-lg font-extrabold hover:text-[#00a3c4]">
            Siguiente: {siguiente.nombre} <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <FooterClaro />
    </div>
  );
}
