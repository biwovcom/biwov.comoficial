"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Printer } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
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

  const itemPdf = COMPLEMENTOS.find((c) => c.titulo === pdfAbierto) ?? null;

  return (
    <section id="complementos-section" className="py-16 md:py-24">
      <Container>
        <SectionHeading eyebrow="Complementos" title="¿Necesitas algo más?" />

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {COMPLEMENTOS.map((item, i) => {
            const tieneDetalle = Boolean(item.items?.length) || item.tipo === "produccion";
            const estaAbierto = abierto === item.titulo;
            return (
              <motion.div
                key={item.titulo}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={cn(item.tipo === "produccion" && "sm:col-span-2")}
              >
                <GlassCard
                  className={cn("h-full p-6", tieneDetalle && "cursor-pointer")}
                  onClick={() => tieneDetalle && setAbierto(estaAbierto ? null : item.titulo)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold text-white">{item.titulo}</h3>
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
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </Container>

      <ComplementoPdfModal
        titulo={itemPdf?.titulo ?? ""}
        abierto={Boolean(itemPdf)}
        onClose={() => setPdfAbierto(null)}
      >
        {itemPdf && <DetalleComplemento item={itemPdf} />}
      </ComplementoPdfModal>
    </section>
  );
}
