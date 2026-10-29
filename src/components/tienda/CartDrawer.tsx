"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { EXTRAS_COTIZABLES } from "@/data/extrasCotizables";
import { ARTE_CATEGORIA } from "@/data/categoriasExtras";
import { Button } from "@/components/ui/Button";
import { formatCopEnMoneda, type Moneda } from "@/lib/moneda";

export function CartDrawer({
  abierto,
  onClose,
  carrito,
  onCambiarCantidad,
  moneda,
  trm,
  onFinalizar,
}: {
  abierto: boolean;
  onClose: () => void;
  carrito: Record<string, number>;
  onCambiarCantidad: (id: string, cantidad: number) => void;
  moneda: Moneda;
  trm: number;
  onFinalizar: () => void;
}) {
  const items = Object.entries(carrito)
    .map(([id, cantidad]) => ({ item: EXTRAS_COTIZABLES.find((e) => e.id === id), cantidad }))
    .filter((x): x is { item: (typeof EXTRAS_COTIZABLES)[number]; cantidad: number } => Boolean(x.item));

  const totalUnico = items
    .filter((x) => x.item.periodicidad === "único")
    .reduce((acc, x) => acc + x.item.precioCop * x.cantidad, 0);
  const totalMensual = items
    .filter((x) => x.item.periodicidad === "mensual")
    .reduce((acc, x) => acc + x.item.precioCop * x.cantidad, 0);

  return (
    <AnimatePresence>
      {abierto && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-[#0a2642]/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col bg-bg-light-elevated shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border-light px-6 py-5">
              <h3 className="text-lg font-bold text-text-on-light">Tu carrito</h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar carrito"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border-light text-text-on-light hover:border-accent/40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <ShoppingBag className="h-9 w-9 text-accent" />
                  <p className="text-sm text-text-on-light-secondary">
                    Tu carrito está vacío. Agrega servicios desde el catálogo.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(({ item, cantidad }) => (
                    <div key={item.id} className="flex gap-3 border-b border-border-light pb-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                        <Image src={ARTE_CATEGORIA[item.categoria].imagen} alt="" fill sizes="64px" className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-text-on-light">{item.nombre}</p>
                        <p className="text-xs text-text-on-light-secondary">
                          {formatCopEnMoneda(item.precioCop, moneda, trm)}
                          {item.periodicidad === "mensual" ? " /mes" : ""}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onCambiarCantidad(item.id, cantidad - 1)}
                            aria-label="Quitar una unidad"
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-border-light text-text-on-light hover:border-accent/40"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-5 text-center text-sm font-medium text-text-on-light">
                            {cantidad}
                          </span>
                          <button
                            type="button"
                            onClick={() => onCambiarCantidad(item.id, cantidad + 1)}
                            aria-label="Agregar una unidad"
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-border-light text-text-on-light hover:border-accent/40"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onCambiarCantidad(item.id, 0)}
                            aria-label="Eliminar del carrito"
                            className="ml-auto flex h-7 w-7 items-center justify-center rounded-full text-text-on-light-secondary hover:text-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border-light px-6 py-5">
                {totalUnico > 0 && (
                  <div className="flex justify-between text-sm text-text-on-light-secondary">
                    <span>Pago único</span>
                    <span>{formatCopEnMoneda(totalUnico, moneda, trm)}</span>
                  </div>
                )}
                {totalMensual > 0 && (
                  <div className="mt-1 flex justify-between text-sm text-text-on-light-secondary">
                    <span>Mensual</span>
                    <span>{formatCopEnMoneda(totalMensual, moneda, trm)}</span>
                  </div>
                )}
                <Button className="mt-4 w-full" size="lg" onClick={onFinalizar}>
                  Finalizar pedido
                </Button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
