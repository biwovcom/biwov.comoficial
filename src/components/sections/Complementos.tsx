"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { COMPLEMENTOS } from "@/data/complementos";
import { ProduccionContenidoDetalle } from "./ProduccionContenidoDetalle";
import { ComplementoPdfModal } from "./ComplementoPdfModal";
import { CotizacionCombinadaModal } from "./CotizacionCombinadaModal";
import { Button } from "@/components/ui/Button";
import { SelectorExtras } from "@/components/planes/SelectorExtras";
import { EXTRAS_COTIZABLES } from "@/data/extrasCotizables";
import { linkWhatsApp } from "@/lib/panel/whatsapp";
import { WHATSAPP_BIWOV } from "@/lib/contacto";
import { formatCopEnMoneda, type Moneda } from "@/lib/moneda";

function DetalleComplemento({
  item,
  moneda,
  trm,
}: {
  item: (typeof COMPLEMENTOS)[number];
  moneda: Moneda;
  trm: number;
}) {
  if (item.tipo === "produccion") {
    return <ProduccionContenidoDetalle moneda={moneda} trm={trm} />;
  }
  return (
    <>
      <ul className="space-y-3">
        {item.items!.map((it) => {
          const precio = it.precioCop !== undefined ? formatCopEnMoneda(it.precioCop, moneda, trm) : it.precio;
          return (
            <li key={it.label} className="text-sm">
              <p className="text-white/90">{it.label}</p>
              {precio && <p className="mt-0.5 text-xs font-medium text-accent">{precio}</p>}
            </li>
          );
        })}
      </ul>
      {item.nota && <p className="mt-3 text-xs text-text-secondary">{item.nota}</p>}
    </>
  );
}

function BotonAccion({ item }: { item: (typeof COMPLEMENTOS)[number] }) {
  if (item.linkAgendar) {
    return (
      <a href={item.linkAgendar} target="_blank" rel="noopener noreferrer" className="flex-1">
        <Button variant="primary" className="w-full !px-3 !py-2 !text-xs whitespace-nowrap">
          {item.textoBotonAgendar ?? "Agendar"}
        </Button>
      </a>
    );
  }
  const mensaje = `¡Hola! 👋 Quiero adquirir el complemento "${item.titulo}". Quisiera coordinar el pago.`;
  return (
    <a
      href={linkWhatsApp(WHATSAPP_BIWOV, mensaje)}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1"
    >
      <Button variant="primary" className="w-full !px-3 !py-2 !text-xs whitespace-nowrap">
        Adquirir
      </Button>
    </a>
  );
}

export function Complementos({ moneda, trm }: { moneda: Moneda; trm: number }) {
  const [modalAbierto, setModalAbierto] = useState<string | null>(null);
  const [extras, setExtras] = useState<string[]>([]);
  const [cotizacionAbierta, setCotizacionAbierta] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const toggleExtra = (id: string) => {
    setExtras((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));
  };
  const totalExtras = EXTRAS_COTIZABLES.filter((e) => extras.includes(e.id)).reduce(
    (acc, e) => acc + e.precioCop,
    0,
  );

  const itemModal = COMPLEMENTOS.find((c) => c.titulo === modalAbierto) ?? null;

  const desplazar = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <div id="complementos-section" className="mt-16 border-t border-border-light pt-16">
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
            className="flex w-[300px] shrink-0 snap-start flex-col rounded-3xl border border-border-glass bg-[#0c1119] p-6 shadow-[0_12px_40px_-16px_rgba(13,59,102,0.35)]"
          >
            <h4 className="text-base font-semibold text-white">{item.titulo}</h4>
            <p className="mt-1.5 flex-1 text-sm text-text-secondary">{item.detalle}</p>

            <div className="mt-5 flex gap-2">
              <Button
                variant="secondary"
                className="flex-1 !px-3 !py-2 !text-xs whitespace-nowrap"
                onClick={() => setModalAbierto(item.titulo)}
              >
                Más información
              </Button>
              <BotonAccion item={item} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h4 className="text-sm font-semibold text-text-on-light">
          ¿Quieres combinar varios de estos en una sola cotización?
        </h4>
        <p className="mt-1 text-xs text-text-on-light-secondary">
          Marca los que te interesan y te armamos un solo mensaje con todo, sin tener que escribirnos por cada uno.
        </p>
        <div className="mt-4 rounded-3xl border border-border-glass bg-[#0c1119] p-5">
          <SelectorExtras
            moneda={moneda}
            trm={trm}
            seleccionados={extras}
            onToggle={toggleExtra}
            titulo="Elige lo que quieres sumar"
          />
        </div>
      </div>

      <AnimatePresence>
        {extras.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-x-4 bottom-24 z-40 mx-auto flex max-w-sm items-center justify-between gap-3 rounded-2xl border border-border-glass bg-[#0c1119] p-4 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)] sm:inset-x-auto sm:right-6"
          >
            <p className="text-xs text-white">
              {extras.length} seleccionado{extras.length === 1 ? "" : "s"}
              <br />
              <span className="font-semibold text-accent">{formatCopEnMoneda(totalExtras, moneda, trm)} aprox.</span>
            </p>
            <Button className="!px-4 !py-2 !text-xs whitespace-nowrap" onClick={() => setCotizacionAbierta(true)}>
              Ver cotización
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <CotizacionCombinadaModal
        abierto={cotizacionAbierta}
        extras={extras}
        moneda={moneda}
        trm={trm}
        onClose={() => setCotizacionAbierta(false)}
      />

      <ComplementoPdfModal
        titulo={itemModal?.titulo ?? ""}
        abierto={Boolean(itemModal)}
        onClose={() => setModalAbierto(null)}
      >
        {itemModal && (
          <>
            <DetalleComplemento item={itemModal} moneda={moneda} trm={trm} />
            <div className="mt-6 flex gap-2 print:hidden">
              <BotonAccion item={itemModal} />
            </div>
          </>
        )}
      </ComplementoPdfModal>
    </div>
  );
}
