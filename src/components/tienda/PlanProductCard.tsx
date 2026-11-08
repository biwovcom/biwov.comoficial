"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Plan } from "@/data/planes";
import { formatCopEnMoneda, type Moneda } from "@/lib/moneda";
import { cn } from "@/lib/utils";

const FOTO_PLAN: Record<Plan["id"], string> = {
  esencial:
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=70",
  crecimiento:
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=70",
  escala:
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=70",
};

export function PlanProductCard({
  plan,
  moneda,
  trm,
  onVerPlan,
}: {
  plan: Plan;
  moneda: Moneda;
  trm: number;
  onVerPlan: () => void;
}) {
  const destacado = plan.id === "crecimiento";

  return (
    <button
      type="button"
      onClick={onVerPlan}
      className={cn(
        "card-universo group flex flex-col rounded-[1.75rem] p-2.5 text-left transition-transform duration-500 hover:-translate-y-1",
        destacado
          ? "!border-accent/60"
          : "",
      )}
    >
      <div className="relative h-32 overflow-hidden rounded-[1.25rem]">
        <Image src={FOTO_PLAN[plan.id]} alt="" fill sizes="300px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[#03101b]/35" />
        {destacado && (
          <span className="absolute left-2 top-2 rounded bg-accent px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#0a2642]">
            Más elegido
          </span>
        )}
        <span className="absolute bottom-2 left-3 text-[10px] font-semibold uppercase tracking-wide text-accent">
          Plan
        </span>
      </div>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
        <h4 className="text-2xl font-medium tracking-tight text-white">Plan {plan.nombre}</h4>
        <p className="mt-1 text-xs text-text-secondary line-clamp-2">{plan.claim}</p>
        <ul className="mt-3 flex-1 space-y-1">
          {plan.incluye.slice(0, 4).map((inc) => (
            <li key={inc.label} className="line-clamp-2 text-xs text-white/80">
              <span className="text-accent">✔</span> {inc.label}
            </li>
          ))}
          {plan.incluye.length > 4 && (
            <li className="text-xs font-medium text-accent/90">
              + {plan.incluye.length - 4} cosas más incluidas
            </li>
          )}
        </ul>
        <p className="mt-4 text-xl font-semibold tracking-tight text-white">
          {formatCopEnMoneda(plan.precioDesde.cop, moneda, trm)}
          <span className="text-xs font-medium text-text-secondary"> /mes</span>
        </p>

        <span className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#03101b] transition-all group-hover:scale-[1.02]">
          Ver plan
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </button>
  );
}
