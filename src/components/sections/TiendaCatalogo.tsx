"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Search, ShoppingBag } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ProductoCard } from "@/components/tienda/ProductoCard";
import { PlanProductCard } from "@/components/tienda/PlanProductCard";
import { CartDrawer } from "@/components/tienda/CartDrawer";
import { CotizacionCombinadaModal } from "./CotizacionCombinadaModal";
import { PlanDetalleModal } from "@/components/planes/PlanDetalleModal";
import { MonedaToggle } from "@/components/ui/MonedaToggle";
import { PLANES, type Plan } from "@/data/planes";
import { EXTRAS_COTIZABLES, type CategoriaExtra } from "@/data/extrasCotizables";
import type { Moneda } from "@/lib/moneda";
import { cn } from "@/lib/utils";

const CATEGORIAS_EXTRA: CategoriaExtra[] = [
  "Producción de contenido",
  "Grabación y edición de video",
  "Páginas web",
  "Campaña en Meta",
];

type CategoriaPill = "Todos" | "Planes" | CategoriaExtra;
const PILLS: CategoriaPill[] = ["Todos", "Planes", ...CATEGORIAS_EXTRA];

export function TiendaCatalogo({
  moneda,
  setMoneda,
  trm,
}: {
  moneda: Moneda;
  setMoneda: (m: Moneda) => void;
  trm: number;
}) {
  const [categoriaActiva, setCategoriaActiva] = useState<CategoriaPill>("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState<Record<string, number>>({});
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [planAbierto, setPlanAbierto] = useState<Plan | null>(null);
  const [abrirEnCompra, setAbrirEnCompra] = useState(false);
  const [cotizacionAbierta, setCotizacionAbierta] = useState(false);

  // Sincroniza con el hash de la URL (ej. /tienda#planes desde el navbar),
  // que solo existe en el navegador, no durante el render en servidor.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza con el hash de la URL, no disponible durante el render en servidor.
    if (window.location.hash === "#planes") setCategoriaActiva("Planes");
  }, []);

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

  const totalUnidades = Object.values(carrito).reduce((a, b) => a + b, 0);
  const q = busqueda.trim().toLowerCase();

  const planesFiltrados = useMemo(() => {
    if (categoriaActiva !== "Todos" && categoriaActiva !== "Planes") return [];
    return PLANES.filter(
      (p) => !q || p.nombre.toLowerCase().includes(q) || p.claim.toLowerCase().includes(q),
    );
  }, [categoriaActiva, q]);

  const extrasFiltrados = useMemo(() => {
    if (categoriaActiva === "Planes") return [];
    const base =
      categoriaActiva === "Todos"
        ? EXTRAS_COTIZABLES
        : EXTRAS_COTIZABLES.filter((e) => e.categoria === categoriaActiva);
    return base.filter((e) => !q || e.nombre.toLowerCase().includes(q));
  }, [categoriaActiva, q]);

  const sinResultados = planesFiltrados.length === 0 && extrasFiltrados.length === 0;

  return (
    <section id="tienda" className="print-host bg-bg-light">
      <div className="relative isolate overflow-hidden py-16 md:py-20">
        <Image
          src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1920&q=70"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#0a2642]/82" />
        <Container className="relative z-10 text-center">
          <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/[0.06] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent">
            Tienda biwov_
          </span>
          <h1 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Arma tu ecosistema digital
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
            Elige un plan mensual o agrega servicios sueltos — como en una tienda, a tu propio
            ritmo.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-wide text-white/70">
            <span>✦ Producción propia</span>
            <span>✦ Cotización inmediata</span>
            <span>✦ Pago seguro en línea</span>
          </div>
        </Container>
      </div>

      <div
        id="planes"
        className="sticky top-18 z-40 border-b border-border-light bg-bg-light-elevated/95 backdrop-blur-xl"
      >
        <Container className="flex items-center gap-3 py-3">
          <div className="relative max-w-xs flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-on-light-secondary" />
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar un servicio…"
              className="w-full rounded-full border border-border-light bg-white py-2 pl-9 pr-4 text-sm text-text-on-light placeholder:text-text-on-light-secondary focus:border-accent/50 focus:outline-none"
            />
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <MonedaToggle moneda={moneda} onChange={setMoneda} />
            <button
              type="button"
              onClick={() => setCarritoAbierto(true)}
              aria-label="Abrir carrito"
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-light bg-white text-text-on-light hover:border-accent/40"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalUnidades > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-[#0a2642]">
                  {totalUnidades}
                </span>
              )}
            </button>
          </div>
        </Container>

        <Container className="scrollbar-none flex gap-2 overflow-x-auto pb-3">
          {PILLS.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoriaActiva(cat)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors",
                categoriaActiva === cat
                  ? "border-transparent bg-gradient-brand text-white"
                  : "border-border-light bg-white text-text-on-light-secondary hover:text-text-on-light",
              )}
            >
              {cat}
            </button>
          ))}
        </Container>
      </div>

      <Container className="py-10 md:py-14">
        {sinResultados ? (
          <p className="py-16 text-center text-sm text-text-on-light-secondary">
            No encontramos servicios con ese nombre. Prueba con otra palabra.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {planesFiltrados.map((plan) => (
              <PlanProductCard
                key={plan.id}
                plan={plan}
                moneda={moneda}
                trm={trm}
                onVerPlan={() => {
                  setAbrirEnCompra(false);
                  setPlanAbierto(plan);
                }}
              />
            ))}
            {extrasFiltrados.map((item) => (
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
        )}

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-text-on-light-secondary">
          Valores de referencia en pesos colombianos o dólares, según elijas arriba. Los planes
          tienen un compromiso mínimo de 6 meses. Las plataformas y la publicidad se pagan aparte.
        </p>
      </Container>

      <CartDrawer
        abierto={carritoAbierto}
        onClose={() => setCarritoAbierto(false)}
        carrito={carrito}
        onCambiarCantidad={cambiarCantidad}
        moneda={moneda}
        trm={trm}
        onFinalizar={() => {
          setCarritoAbierto(false);
          setCotizacionAbierta(true);
        }}
      />

      <PlanDetalleModal
        plan={planAbierto}
        moneda={moneda}
        trm={trm}
        abrirEnCompra={abrirEnCompra}
        onClose={() => setPlanAbierto(null)}
      />

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
