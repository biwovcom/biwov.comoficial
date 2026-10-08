"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, Printer } from "lucide-react";
import { COMPLEMENTOS } from "@/data/complementos";
import { ProduccionContenidoDetalle } from "./ProduccionContenidoDetalle";
import { ComplementoPdfModal } from "./ComplementoPdfModal";
import { cn } from "@/lib/utils";

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

export function Complementos() {
  const [abierto, setAbierto] = useState<string | null>(null);
  const [pdfAbierto, setPdfAbierto] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const itemPdf = COMPLEMENTOS.find((c) => c.titulo === pdfAbierto) ?? null;

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
        {COMPLEMENTOS.map((item) => {
          const tieneDetalle = Boolean(item.items?.length) || item.tipo === "produccion";
          const estaAbierto = abierto === item.titulo;
          return (
            <div
              key={item.titulo}
              className={cn(
                "shrink-0 snap-start rounded-3xl border border-border-glass bg-[#0c1119] p-6 shadow-[0_12px_40px_-16px_rgba(13,59,102,0.35)]",
                item.tipo === "produccion" ? "w-[340px] sm:w-[620px]" : "w-[320px] sm:w-[360px]",
                tieneDetalle && "cursor-pointer",
              )}
              onClick={() => tieneDetalle && setAbierto(estaAbierto ? null : item.titulo)}
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-base font-semibold text-white">{item.titulo}</h4>
                {tieneDetalle && (
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-accent transition-transform",
                      estaAbierto && "rotate-180",
                    )}
                  />
                )}
              </div>
              <p className="mt-1.5 text-sm text-text-secondary">{item.detalle}</p>

              <AnimatePresence>
                {tieneDetalle && estaAbierto && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 border-t border-border-glass pt-4">
                      <DetalleComplemento item={item} />
                    </div>
                    {item.linkAgendar && (
                      <a
                        href={item.linkAgendar}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-4 block"
                      >
                        <button
                          type="button"
                          className="w-full rounded-full bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
                        >
                          {item.textoBotonAgendar ?? "Agendar"}
                        </button>
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPdfAbierto(item.titulo);
                      }}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-border-glass py-2 text-xs font-medium text-text-secondary transition-colors hover:border-accent/40 hover:text-white"
                    >
                      <Printer size={13} /> Descargar en PDF
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <ComplementoPdfModal
        titulo={itemPdf?.titulo ?? ""}
        abierto={Boolean(itemPdf)}
        onClose={() => setPdfAbierto(null)}
      >
        {itemPdf && <DetalleComplemento item={itemPdf} />}
      </ComplementoPdfModal>
    </div>
  );
}
