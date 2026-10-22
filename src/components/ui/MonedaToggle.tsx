"use client";

import type { Moneda } from "@/lib/moneda";
import { cn } from "@/lib/utils";

export function MonedaToggle({ moneda, onChange }: { moneda: Moneda; onChange: (m: Moneda) => void }) {
  return (
    <div className="flex justify-center">
      <div className="inline-flex rounded-full border border-border-light bg-white p-1">
        {(["COP", "USD"] as Moneda[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onChange(m)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
              moneda === m ? "bg-gradient-brand text-white" : "text-text-on-light-secondary hover:text-text-on-light",
            )}
          >
            {m === "COP" ? "Pesos colombianos" : "Dólares (USD)"}
          </button>
        ))}
      </div>
    </div>
  );
}
