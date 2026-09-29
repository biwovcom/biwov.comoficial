"use client";

import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { CotizacionPublica } from "@/lib/panel/cotizacionPublica";

type Moneda = "COP" | "USD";

function formato(n: number, moneda: Moneda): string {
  return moneda === "USD"
    ? "US$" + Math.round(n).toLocaleString("en-US")
    : "$" + Math.round(n).toLocaleString("es-CO") + " COP";
}

export function CotizacionCliente({ cotizacion }: { cotizacion: CotizacionPublica }) {
  const [moneda, setMoneda] = useState<Moneda>("COP");
  const [aceptando, setAceptando] = useState(false);
  const [form, setForm] = useState({ nombre: "", email: "", whatsapp: "", empresa: "" });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aceptada, setAceptada] = useState(false);

  const precios = moneda === "USD" ? cotizacion.usd : cotizacion.cop;
  const ahorro = precios.sumaItems - precios.total;

  async function aceptar(e: FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim() || (!form.email.trim() && !form.whatsapp.trim())) {
      setError("Escribe tu nombre y un correo o WhatsApp.");
      return;
    }
    setError(null);
    setEnviando(true);
    const res = await fetch(`/api/cotizacion/${cotizacion.id}/aceptar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, moneda }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setEnviando(false);
      setError(data?.error ?? "No se pudo registrar tu aceptación. Intenta de nuevo.");
      return;
    }
    if (data?.linkPago) {
      window.location.href = data.linkPago;
      return;
    }
    setEnviando(false);
    setAceptada(true);
  }

  if (aceptada) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-2xl">✅</p>
        <h2 className="mt-3 text-lg font-semibold text-white">¡Propuesta aceptada!</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Gracias, {form.nombre.split(" ")[0]}. Te contactaremos en breve para enviarte el enlace de pago y
          arrancar.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 md:p-8">
      <h1 className="text-2xl font-semibold text-white">{cotizacion.nombre}</h1>
      {cotizacion.descripcion && (
        <p className="mt-2 whitespace-pre-line text-sm text-text-secondary">{cotizacion.descripcion}</p>
      )}

      <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-text-secondary">Incluye</p>
      <ul className="mt-3 space-y-2">
        {cotizacion.items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-white">
            <Check size={16} className="mt-0.5 shrink-0 text-accent" />
            <span>
              {item.cantidad !== 1 && <b>{item.cantidad} × </b>}
              {item.nombre}
              {item.unidad && item.cantidad !== 1 && (
                <span className="text-text-secondary"> ({item.unidad})</span>
              )}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-8 border-t border-border-glass pt-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Inversión</p>
          <div className="flex rounded-full border border-border-glass p-0.5 text-xs">
            {(["COP", "USD"] as Moneda[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMoneda(m)}
                className={cn(
                  "rounded-full px-3 py-1 transition-colors",
                  moneda === m ? "bg-accent text-bg-base font-semibold" : "text-text-secondary hover:text-white",
                )}
              >
                {m === "COP" ? "Pesos (COP)" : "Dólares (USD)"}
              </button>
            ))}
          </div>
        </div>
        {ahorro > 0 && (
          <p className="mt-3 text-sm text-text-secondary">
            Valor por separado: <span className="line-through">{formato(precios.sumaItems, moneda)}</span>
          </p>
        )}
        <p className="mt-1 text-3xl font-semibold tabular-nums text-white">{formato(precios.total, moneda)}</p>
        {ahorro > 0 && (
          <p className="mt-1 text-sm text-emerald-400">Ahorras {formato(ahorro, moneda)} con este paquete</p>
        )}
      </div>

      {!aceptando ? (
        <Button className="mt-8 w-full" size="lg" onClick={() => setAceptando(true)}>
          Aceptar propuesta
        </Button>
      ) : (
        <form onSubmit={aceptar} className="mt-8 space-y-4 border-t border-border-glass pt-6">
          <p className="text-sm text-text-secondary">
            Déjanos tus datos para confirmar. Después te llevamos al pago seguro en{" "}
            {moneda === "USD" ? "dólares" : "pesos"}.
          </p>
          <div>
            <Label htmlFor="nombre">Nombre completo</Label>
            <Input
              id="nombre"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              autoComplete="name"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
              />
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                autoComplete="tel"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="empresa">Empresa (opcional)</Label>
            <Input
              id="empresa"
              value={form.empresa}
              onChange={(e) => setForm({ ...form, empresa: e.target.value })}
              autoComplete="organization"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full" size="lg" disabled={enviando}>
            {enviando ? "Confirmando…" : `Confirmar y pagar ${formato(precios.total, moneda)}`}
          </Button>
        </form>
      )}
    </GlassCard>
  );
}
