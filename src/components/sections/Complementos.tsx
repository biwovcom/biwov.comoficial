"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { COMPLEMENTOS } from "@/data/complementos";
import { ProduccionContenidoDetalle } from "./ProduccionContenidoDetalle";
import { ComplementoPdfModal } from "./ComplementoPdfModal";
import { Button } from "@/components/ui/Button";
import { linkWhatsApp } from "@/lib/panel/whatsapp";
import { WHATSAPP_BIWOV } from "@/lib/contacto";

function DetalleComplemento({ item }: { item: (typeof COMPLEMENTOS)[number] }) {
  if (item.tipo === "produccion") {
    return <ProduccionContenidoDetalle />;
  }
  return (
    <>
      <ul className="space-y-3">
        {item.items!.map((it) => (
          <li key={it.label} className="text-sm">
            <p className="text-white/90">{it.label}</p>
            <p className="mt-0.5 text-xs font-medium text-accent">{it.precio}</p>
          </li>
        ))}
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

export function Complementos() {
  const [modalAbierto, setModalAbierto] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

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

      <ComplementoPdfModal
        titulo={itemModal?.titulo ?? ""}
        abierto={Boolean(itemModal)}
        onClose={() => setModalAbierto(null)}
      >
        {itemModal && (
          <>
            <DetalleComplemento item={itemModal} />
            <div className="mt-6 flex gap-2 print:hidden">
              <BotonAccion item={itemModal} />
            </div>
          </>
        )}
      </ComplementoPdfModal>
    </div>
  );
}
