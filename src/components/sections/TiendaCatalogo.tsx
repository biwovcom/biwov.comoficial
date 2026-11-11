"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Search, ShoppingBag } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ProductoCard } from "@/components/tienda/ProductoCard";
import { PlanProductCard } from "@/components/tienda/PlanProductCard";
import { CartDrawer } from "@/components/tienda/CartDrawer";
import { CotizacionCombinadaModal } from "./CotizacionCombinadaModal";
import { PlanDetalleModal } from "@/components/planes/PlanDetalleModal";
import { CompraItemModal } from "@/components/compras/CompraItemModal";
import { MonedaToggle } from "@/components/ui/MonedaToggle";
import { PLANES, COMPARATIVO_PLANES, DURACION_MINIMA_MESES, type Plan } from "@/data/planes";
import { LINEAS, type Linea, type LineaId } from "@/data/lineas";
import {
  EXTRAS_COTIZABLES,
  CATEGORIAS_POR_LINEA,
  DESCRIPCION_CATEGORIA,
  type ExtraCotizable,
} from "@/data/extrasCotizables";
import { formatCopEnMoneda, type Moneda } from "@/lib/moneda";
import { cn } from "@/lib/utils";

type Filtro = "todos" | LineaId;

const NOMBRE_CORTO: Record<LineaId, string> = {
  direccion: "Dirección",
  gestion: "Gestión",
  produccion: "Producción",
  automatizacion: "Automatización",
  ecosistemas: "Ecosistemas",
};

const esLinea = (v: string): v is LineaId => LINEAS.some((l) => l.id === v);

function Comparativo({ linea, moneda, trm }: { linea: "direccion" | "gestion"; moneda: Moneda; trm: number }) {
  const planes = PLANES.filter((p) => p.linea === linea);
  return (
    <div className="scrollbar-none mt-5 overflow-x-auto rounded-[1.5rem] border border-white/10 bg-white/[0.02]">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Compara</th>
            {planes.map((p) => (
              <th key={p.id} className={cn("px-4 py-3 font-semibold text-white", p.recomendado && "text-accent")}>
                {p.nombre}
                <span className="block text-xs font-medium text-white/60">
                  {formatCopEnMoneda(p.precioDesde.cop, moneda, trm)} /mes
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARATIVO_PLANES[linea].map((fila) => (
            <tr key={fila.label} className="border-b border-white/[0.05] last:border-0">
              <td className="px-4 py-2.5 text-white/60">{fila.label}</td>
              {fila.valores.map((v, i) => (
                <td key={i} className="px-4 py-2.5 text-white">
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TiendaCatalogo({
  moneda,
  setMoneda,
  trm,
}: {
  moneda: Moneda;
  setMoneda: (m: Moneda) => void;
  trm: number;
}) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState<Record<string, number>>({});
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [planAbierto, setPlanAbierto] = useState<Plan | null>(null);
  const [itemAbierto, setItemAbierto] = useState<ExtraCotizable | null>(null);
  const [cotizacionAbierta, setCotizacionAbierta] = useState(false);

  // Permite enlazar directo a una línea (ej. /tienda#automatizacion).
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- el hash solo existe en el navegador.
    if (esLinea(hash)) setFiltro(hash);
  }, []);

  const elegirLinea = (id: Filtro) => {
    setFiltro(id);
    setBusqueda("");
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

  const lineasVisibles = useMemo(
    () => (filtro === "todos" ? LINEAS : LINEAS.filter((l) => l.id === filtro)),
    [filtro],
  );

  const coincide = (texto: string) => !q || texto.toLowerCase().includes(q);

  const contenidoLinea = (linea: Linea) => {
    const planes = PLANES.filter((p) => p.linea === linea.id && coincide(`${p.nombre} ${p.claim} ${p.resumen}`));
    const grupos = CATEGORIAS_POR_LINEA[linea.id]
      .map((cat) => ({
        cat,
        items: EXTRAS_COTIZABLES.filter((e) => e.categoria === cat && coincide(`${e.nombre} ${e.categoria} ${e.descripcion ?? ""}`)),
      }))
      .filter((g) => g.items.length > 0);
    return { planes, grupos };
  };

  const hayResultados = lineasVisibles.some((l) => {
    const { planes, grupos } = contenidoLinea(l);
    return planes.length > 0 || grupos.length > 0;
  });

  const gestionRecomendado = PLANES.find((p) => p.linea === "gestion" && p.recomendado);

  return (
    <section id="tienda" className="print-host bg-bg-light">
      <div className="relative isolate overflow-hidden pb-14 pt-32 md:pb-20 md:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_85%_10%,rgba(0,194,232,0.16),transparent_65%)]" />
        <Container className="relative z-10 grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="mb-5 block text-xs font-semibold uppercase tracking-[0.22em] text-accent md:text-sm">
              Tienda biwov_
            </span>
            <h1 className="text-[2.6rem] font-semibold leading-[1] tracking-[-0.045em] text-white sm:text-6xl xl:text-7xl">
              Elige lo que tu negocio <span className="text-accent">necesita hoy.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-xl">
              No tienes que comprarlo todo. Empieza por lo que más te urge y suma más soluciones a
              medida que tu negocio crece. Todos los precios están publicados.
            </p>
            <dl className="mt-9 grid max-w-lg grid-cols-3 gap-4">
              {[
                { valor: "5", etiqueta: "líneas de servicio" },
                { valor: String(PLANES.length), etiqueta: "planes mensuales" },
                { valor: `+${EXTRAS_COTIZABLES.length}`, etiqueta: "servicios con precio publicado" },
              ].map((c) => (
                <div key={c.etiqueta} className="border-t border-white/15 pt-4">
                  <dt className="text-2xl font-semibold tracking-tight text-white md:text-3xl">{c.valor}</dt>
                  <dd className="mt-1 text-xs leading-snug text-white/55 md:text-sm">{c.etiqueta}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* Collage de trabajos reales (producción, web y contenido). */}
          <div className="relative hidden h-[460px] lg:block">
            <motion.div
              initial={{ opacity: 0, y: 30, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: -3 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="card-universo absolute left-0 top-6 w-[56%] rounded-[1.75rem] p-2.5"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.3rem]">
                <Image
                  src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=70"
                  alt="Producción y edición de video"
                  fill
                  priority
                  sizes="340px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#03101b]/85 to-transparent" />
                <p className="absolute bottom-4 left-4 right-4 text-sm font-medium text-white">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">Producción</span>
                  Videos, fotos y B-Roll
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30, rotate: 2 }}
              animate={{ opacity: 1, y: 0, rotate: 3 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="card-universo absolute right-0 top-0 w-[58%] rounded-[1.75rem] p-2.5"
            >
              <div className="relative aspect-[16/11] overflow-hidden rounded-[1.3rem]">
                <Image src="/casos/fashion-lash-desktop.webp" alt="Tienda virtual nagaraku.com.co" fill sizes="360px" className="object-cover object-top" />
              </div>
              <p className="px-2 pb-1 pt-3 text-sm font-medium text-white">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">Ecosistemas digitales</span>
                Páginas que venden solas
              </p>
            </motion.div>

            {gestionRecomendado && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="card-universo absolute bottom-0 right-[6%] w-[52%] rounded-[1.75rem] p-2.5"
              >
                <div className="relative aspect-[16/9] overflow-hidden rounded-[1.3rem]">
                  <Image
                    src="https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=800&q=70"
                    alt="Gestión de redes sociales"
                    fill
                    sizes="320px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[#03101b]/30" />
                </div>
                <p className="px-2 pb-1 pt-3 text-sm font-medium text-white">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                    {gestionRecomendado.nombre}
                  </span>
                  {formatCopEnMoneda(gestionRecomendado.precioDesde.cop, "COP", 1)} COP /mes
                </p>
              </motion.div>
            )}
          </div>
        </Container>
      </div>

      {/* Paso 1: el cliente elige por necesidad, con sus propias palabras. */}
      <Container className="pb-12 md:pb-16">
        <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-accent md:text-sm">
          Paso 1 · ¿Qué necesitas hoy?
        </span>
        <h2 className="mt-3 text-3xl font-medium tracking-[-0.03em] text-white md:text-4xl">
          Toca la frase que más se parece a tu caso
        </h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {LINEAS.map((l, i) => (
            <motion.button
              key={l.id}
              type="button"
              onClick={() => elegirLinea(l.id)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className={cn(
                "card-universo group flex flex-col rounded-[1.5rem] p-5 text-left transition-transform duration-300 hover:-translate-y-1",
                filtro === l.id && "!border-accent/70",
              )}
            >
              <span className="text-xs font-semibold text-accent">{l.numero}</span>
              <span className="mt-3 flex-1 text-base font-medium leading-snug text-white">&ldquo;{l.necesidad}&rdquo;</span>
              <span className="mt-4 text-xs text-white/50">{l.nombre}</span>
              <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-white group-hover:text-accent">
                Ver opciones <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </motion.button>
          ))}
        </div>
      </Container>

      <div
        id="planes"
        className="sticky top-20 z-40 border-y border-white/[0.06] bg-[#03101b]/90 backdrop-blur-xl"
      >
        <Container className="flex items-center gap-3 py-3">
          <div className="relative max-w-xs flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-on-light-secondary" />
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar un servicio…"
              className="w-full rounded-full border border-border-light bg-white/[0.04] py-2 pl-9 pr-4 text-sm text-text-on-light placeholder:text-text-on-light-secondary focus:border-accent/50 focus:outline-none"
            />
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <MonedaToggle moneda={moneda} onChange={setMoneda} />
            <button
              type="button"
              onClick={() => setCarritoAbierto(true)}
              aria-label="Abrir carrito"
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-light bg-white/[0.04] text-text-on-light hover:border-accent/40"
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
          {(["todos", ...LINEAS.map((l) => l.id)] as Filtro[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFiltro(f)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors",
                filtro === f
                  ? "border-white bg-white text-[#03101b]"
                  : "border-border-light bg-white/[0.04] text-text-on-light-secondary hover:text-text-on-light",
              )}
            >
              {f === "todos" ? "Todo" : NOMBRE_CORTO[f]}
            </button>
          ))}
        </Container>
      </div>

      <div id="catalogo" className="scroll-mt-44" />
      <Container className="py-10 md:py-14">
        {!hayResultados ? (
          <p className="py-16 text-center text-sm text-text-on-light-secondary">
            No encontramos servicios con ese nombre. Prueba con otra palabra.
          </p>
        ) : (
          <div className="space-y-16">
            {lineasVisibles.map((linea) => {
              const { planes, grupos } = contenidoLinea(linea);
              if (planes.length === 0 && grupos.length === 0) return null;
              const esPlanes = linea.id === "direccion" || linea.id === "gestion";
              return (
                <section key={linea.id} id={`linea-${linea.id}`}>
                  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                        {linea.numero} · {linea.nombre}
                      </p>
                      <h3 className="mt-2 text-2xl font-medium tracking-[-0.02em] text-white md:text-3xl">
                        {linea.promesa}
                      </h3>
                    </div>
                    <span className="rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-white">
                      {linea.etiqueta}
                    </span>
                  </div>

                  {planes.length > 0 && (
                    <>
                      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {planes.map((plan) => (
                          <PlanProductCard
                            key={plan.id}
                            plan={plan}
                            moneda={moneda}
                            trm={trm}
                            onVerPlan={() => setPlanAbierto(plan)}
                          />
                        ))}
                      </div>
                      {esPlanes && !q && (
                        <Comparativo linea={linea.id as "direccion" | "gestion"} moneda={moneda} trm={trm} />
                      )}
                    </>
                  )}

                  {grupos.map(({ cat, items }) => (
                    <div key={cat} className="mt-10">
                      <h4 className="text-lg font-medium text-white">
                        {linea.id === "gestion" ? `Adicional: ${cat.toLowerCase()}` : cat}
                      </h4>
                      {DESCRIPCION_CATEGORIA[cat] && (
                        <p className="mt-1 text-sm text-white/55">{DESCRIPCION_CATEGORIA[cat]}</p>
                      )}
                      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {items.map((item) => (
                          <ProductoCard
                            key={item.id}
                            item={item}
                            moneda={moneda}
                            trm={trm}
                            cantidad={carrito[item.id] ?? 0}
                            onCambiarCantidad={cambiarCantidad}
                            onVerDetalle={() => setItemAbierto(item)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </section>
              );
            })}
          </div>
        )}

        <p className="mx-auto mt-14 max-w-2xl text-center text-xs text-text-on-light-secondary">
          Valores en pesos colombianos (o dólares, según elijas arriba), sin IVA. Los planes mensuales
          tienen un compromiso mínimo de {DURACION_MINIMA_MESES} meses y se pagan por anticipado. La
          pauta publicitaria, las licencias y el consumo de las plataformas se pagan aparte.
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

      <PlanDetalleModal plan={planAbierto} moneda={moneda} trm={trm} onClose={() => setPlanAbierto(null)} />

      <CompraItemModal item={itemAbierto} moneda={moneda} trm={trm} onClose={() => setItemAbierto(null)} />

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
