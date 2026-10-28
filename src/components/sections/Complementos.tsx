"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Printer } from "lucide-react";
import { COMPLEMENTOS } from "@/data/complementos";
import { EXTRAS_COTIZABLES, type ExtraCotizable } from "@/data/extrasCotizables";
import { ProduccionContenidoDetalle } from "./ProduccionContenidoDetalle";
import { ComplementoPdfModal } from "./ComplementoPdfModal";
import { Button } from "@/components/ui/Button";
import { CompraItemModal } from "@/components/compras/CompraItemModal";
import { PropuestaImprimible, type ItemPropuesta } from "@/components/propuestas/PropuestaImprimible";
import { extraAItemPropuesta } from "@/lib/propuestas/itemPropuesta";
import { formatCopEnMoneda, type Moneda } from "@/lib/moneda";

function itemsPropuestaParaComplemento(
  item: (typeof COMPLEMENTOS)[number],
  moneda: Moneda,
  trm: number,
): ItemPropuesta[] {
  if (item.tipo === "produccion") {
    return EXTRAS_COTIZABLES.filter(
      (e) => e.categoria === "Producción de contenido" || e.categoria === "Grabación y edición de video",
    ).map((e) => extraAItemPropuesta(e, moneda, trm));
  }
  const prefijo =
    item.titulo === "Páginas web y sitios web adicionales"
      ? "web"
      : item.titulo === "Campaña publicitaria en Meta"
        ? "meta"
        : null;
  return (item.items ?? []).map((it) => {
    const extra = prefijo ? EXTRAS_COTIZABLES.find((e) => e.id === `${prefijo}-${it.label}`) : undefined;
    if (extra) return extraAItemPropuesta(extra, moneda, trm);
    return { nombre: it.label, precio: it.precio ?? "Incluido" };
  });
}

function DetalleComplemento({
  item,
  moneda,
  trm,
  onAdquirir,
  onDescargarPdf,
}: {
  item: (typeof COMPLEMENTOS)[number];
  moneda: Moneda;
  trm: number;
  onAdquirir: (extra: ExtraCotizable) => void;
  onDescargarPdf: (extra: ExtraCotizable) => void;
}) {
  if (item.tipo === "produccion") {
    return (
      <ProduccionContenidoDetalle moneda={moneda} trm={trm} onAdquirir={onAdquirir} onDescargarPdf={onDescargarPdf} />
    );
  }

  const prefijo = item.titulo === "Páginas web y sitios web adicionales" ? "web" : "meta";

  return (
    <>
      <ul className="space-y-3">
        {item.items!.map((it) => {
          const precio = it.precioCop !== undefined ? formatCopEnMoneda(it.precioCop, moneda, trm) : it.precio;
          const extra = EXTRAS_COTIZABLES.find((e) => e.id === `${prefijo}-${it.label}`);
          return (
            <li key={it.label} className="flex items-start justify-between gap-3 text-sm">
              <div>
                <p className="text-white/90">{it.label}</p>
                {precio && <p className="mt-0.5 text-xs font-medium text-accent">{precio}</p>}
              </div>
              {extra && (
                <div className="flex shrink-0 gap-1.5">
                  <button
                    type="button"
                    onClick={() => onDescargarPdf(extra)}
                    aria-label={`Descargar PDF de ${extra.nombre}`}
                    title="Descargar PDF (sin firmar)"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-border-glass text-text-secondary transition-colors hover:border-accent/40 hover:text-white"
                  >
                    <Printer size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onAdquirir(extra)}
                    className="rounded-full bg-gradient-brand px-3 py-1.5 text-xs font-medium whitespace-nowrap text-white transition-all hover:shadow-[0_0_20px_-5px_rgba(31,196,222,0.7)]"
                  >
                    Adquirir
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {item.nota && <p className="mt-3 text-xs text-text-secondary">{item.nota}</p>}
    </>
  );
}

function BotonAgendar({ item }: { item: (typeof COMPLEMENTOS)[number] }) {
  if (!item.linkAgendar) return null;
  return (
    <a href={item.linkAgendar} target="_blank" rel="noopener noreferrer" className="flex-1">
      <Button variant="primary" className="w-full !px-3 !py-2 !text-xs whitespace-nowrap">
        {item.textoBotonAgendar ?? "Agendar"}
      </Button>
    </a>
  );
}

export function Complementos({ moneda, trm }: { moneda: Moneda; trm: number }) {
  const [modalAbierto, setModalAbierto] = useState<string | null>(null);
  const [itemCompra, setItemCompra] = useState<ExtraCotizable | null>(null);
  const [itemDestacado, setItemDestacado] = useState<ExtraCotizable | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const itemModal = COMPLEMENTOS.find((c) => c.titulo === modalAbierto) ?? null;

  const desplazar = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  const abrirModal = (titulo: string | null) => {
    setModalAbierto(titulo);
    setItemDestacado(null);
  };

  const descargarItemIndividual = (extra: ExtraCotizable) => {
    setItemDestacado(extra);
    requestAnimationFrame(() => window.print());
  };

  return (
    <div id="complementos-section" className="print-host mt-16 border-t border-border-light pt-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="inline-block rounded-full border border-border-light bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent">
            Complementos
          </span>
          <h3 className="mt-3 text-2xl font-semibold text-text-on-light sm:text-3xl">
            ¿Necesitas algo más?
          </h3>
        </div>
        <div className="hidden shrink-0 gap-2 md:flex">
          <button
            type="button"
            onClick={() => desplazar(-1)}
            aria-label="Anterior"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-light text-text-on-light transition-colors hover:bg-white"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => desplazar(1)}
            aria-label="Siguiente"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-light text-text-on-light transition-colors hover:bg-white"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="scrollbar-none mt-8 flex gap-5 overflow-x-auto scroll-smooth pb-2 pr-6 snap-x snap-mandatory [mask-image:linear-gradient(to_right,black,black_92%,transparent)]"
      >
        {COMPLEMENTOS.map((item) => (
          <div
            key={item.titulo}
            className="flex w-[300px] shrink-0 snap-start flex-col rounded-3xl border border-border-glass bg-[#0b1f38] p-6 shadow-[0_12px_40px_-16px_rgba(30,61,82,0.35)]"
          >
            <h4 className="text-base font-semibold text-white">{item.titulo}</h4>
            <p className="mt-1.5 flex-1 text-sm text-text-secondary">{item.detalle}</p>

            <div className="mt-5 flex gap-2">
              <Button
                variant="secondary"
                className="flex-1 !px-3 !py-2 !text-xs whitespace-nowrap"
                onClick={() => abrirModal(item.titulo)}
              >
                Más información
              </Button>
              <BotonAgendar item={item} />
            </div>
          </div>
        ))}
      </div>

      <ComplementoPdfModal
        titulo={itemModal?.titulo ?? ""}
        abierto={Boolean(itemModal)}
        onClose={() => abrirModal(null)}
        propuesta={
          itemModal && (
            <PropuestaImprimible
              titulo={itemDestacado ? `${itemModal.titulo} — ${itemDestacado.nombre}` : itemModal.titulo}
              subtitulo={itemDestacado ? undefined : itemModal.detalle}
              items={itemDestacado ? [extraAItemPropuesta(itemDestacado, moneda, trm)] : itemsPropuestaParaComplemento(itemModal, moneda, trm)}
              totales={
                itemDestacado
                  ? [{ label: "Total", valor: formatCopEnMoneda(itemDestacado.precioCop, moneda, trm) }]
                  : []
              }
              formasPago={["50% anticipado, 50% contra entrega (servicios únicos)", "Pago mensual por adelantado (servicios recurrentes)"]}
              validez={itemDestacado ? "Esta propuesta tiene una validez de 15 días." : "Escríbenos cuál de estas opciones te interesa para confirmarla."}
            />
          )
        }
      >
        {itemModal && (
          <>
            <DetalleComplemento
              item={itemModal}
              moneda={moneda}
              trm={trm}
              onAdquirir={setItemCompra}
              onDescargarPdf={descargarItemIndividual}
            />
            <div className="mt-6 flex gap-2">
              <BotonAgendar item={itemModal} />
            </div>
          </>
        )}
      </ComplementoPdfModal>

      <CompraItemModal item={itemCompra} moneda={moneda} trm={trm} onClose={() => setItemCompra(null)} />
    </div>
  );
}
