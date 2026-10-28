"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MonedaToggle } from "@/components/ui/MonedaToggle";
import { ProductoCard } from "@/components/tienda/ProductoCard";
import { CotizacionCombinadaModal } from "./CotizacionCombinadaModal";
import { EXTRAS_COTIZABLES, type CategoriaExtra } from "@/data/extrasCotizables";
import { formatCopEnMoneda, type Moneda } from "@/lib/moneda";
import { useTRM } from "@/hooks/useTRM";
import { cn } from "@/lib/utils";

const CATEGORIAS: CategoriaExtra[] = [
  "Producción de contenido",
  "Grabación y edición de video",
  "Páginas web",
  "Campaña en Meta",
];

export function TiendaBiwov() {
  const [moneda, setMoneda] = useState<Moneda>("COP");
  const { trm } = useTRM();
  const [carrito, setCarrito] = useState<Record<string, number>>({});
  const [categoriaActiva, setCategoriaActiva] = useState<CategoriaExtra | "Todos">("Todos");
  const [cotizacionAbierta, setCotizacionAbierta] = useState(false);

  const cambiarCantidad = (id: string, cantidad: number) => {
    setCarrito((prev) => {
      if (cantidad <= 0) {
        const resto = { ...prev };
        delete resto[id];
        return resto;
      }
      return { ...prev, [id]: cantidad };
    });
  };

  const itemsCarrito = Object.entries(carrito)
    .map(([id, cantidad]) => ({ item: EXTRAS_COTIZABLES.find((e) => e.id === id), cantidad }))
    .filter((x): x is { item: (typeof EXTRAS_COTIZABLES)[number]; cantidad: number } => Boolean(x.item));
  const totalUnico = itemsCarrito
    .filter((x) => x.item.periodicidad === "único")
    .reduce((acc, x) => acc + x.item.precioCop * x.cantidad, 0);
  const totalMensual = itemsCarrito
    .filter((x) => x.item.periodicidad === "mensual")
    .reduce((acc, x) => acc + x.item.precioCop * x.cantidad, 0);
  const totalUnidades = Object.values(carrito).reduce((a, b) => a + b, 0);

  const productos = categoriaActiva === "Todos" ? EXTRAS_COTIZABLES : EXTRAS_COTIZABLES.filter((e) => e.categoria === categoriaActiva);

  return (
    <section id="tienda" className="print-host bg-bg-light py-16 md:py-24">
      <Container>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Servicios sueltos
            </span>
            <h3 className="text-2xl font-bold text-text-on-light">
              O arma tu propio combo
            </h3>
            <p className="mt-2 max-w-md text-sm text-text-on-light-secondary">
              Agrégalos a tu carrito en la cantidad que quieras y te armamos un solo mensaje con
              todo — sin compromiso.
            </p>
          </div>
          <MonedaToggle moneda={moneda} onChange={setMoneda} />
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {(["Todos", ...CATEGORIAS] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoriaActiva(cat)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
                categoriaActiva === cat
                  ? "border-transparent bg-gradient-brand text-white"
                  : "border-border-light bg-white text-text-on-light-secondary hover:text-text-on-light",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {productos.map((item) => (
            <ProductoCard
              key={item.id}
              item={item}
              moneda={moneda}
              trm={trm}
              cantidad={carrito[item.id] ?? 0}
              onCambiarCantidad={cambiarCantidad}
            />
          ))}
        </div>
      </Container>

      <AnimatePresence>
        {totalUnidades > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-x-4 bottom-24 z-40 mx-auto flex max-w-sm items-center justify-between gap-3 rounded-2xl border border-accent/30 bg-gradient-brand p-4 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)] sm:inset-x-auto sm:right-6"
          >
            <p className="text-xs text-white">
              {totalUnidades} en el carrito
              <br />
              <span className="font-semibold">{formatCopEnMoneda(totalUnico + totalMensual, moneda, trm)} aprox.</span>
            </p>
            <Button
              variant="secondary"
              className="shrink-0 !border-white/30 !bg-white/10 !px-4 !py-2 !text-xs !text-white whitespace-nowrap hover:!bg-white/20"
              onClick={() => setCotizacionAbierta(true)}
            >
              Ver carrito
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <CotizacionCombinadaModal
        abierto={cotizacionAbierta}
        carrito={carrito}
        moneda={moneda}
        trm={trm}
        onClose={() => setCotizacionAbierta(false)}
      />
    </section>
  );
}
