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
        "group flex flex-col overflow-hidden rounded-2xl border text-left transition-colors",
        destacado
          ? "border-accent/50 bg-[#0a2642]"
          : "border-border-glass bg-[#0a2642] hover:border-accent/30",
      )}
    >
      <div className="relative h-28 overflow-hidden">
        <Image src={FOTO_PLAN[plan.id]} alt="" fill sizes="300px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[#0a2642]/35" />
        {destacado && (
          <span className="absolute left-2 top-2 rounded bg-accent px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#0a2642]">
            Más elegido
          </span>
        )}
        <span className="absolute bottom-2 left-3 text-[10px] font-semibold uppercase tracking-wide text-accent">
          Plan
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h4 className="text-sm font-semibold text-white">{plan.nombre}</h4>
        <p className="mt-1 flex-1 text-xs text-text-secondary line-clamp-2">{plan.claim}</p>
        <p className="mt-3 text-base font-bold text-accent">
          {formatCopEnMoneda(plan.precioDesde.cop, moneda, trm)}
          <span className="text-xs font-medium text-text-secondary"> /mes</span>
        </p>

        <span className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-brand px-3 py-2 text-xs font-medium text-white transition-all group-hover:shadow-[0_6px_18px_-6px_rgba(10,38,66,0.5)]">
          Ver plan
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </button>
  );
}
