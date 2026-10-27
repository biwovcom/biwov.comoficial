"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Play, Hammer } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { CASOS_EXITO, type ImagenCaso } from "@/data/casos";
import { cn } from "@/lib/utils";

function MockupFrame({ imagen, className }: { imagen: ImagenCaso; className?: string }) {
  const esMobile = imagen.tipo === "mobile";
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border-glass bg-bg-base shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]",
        esMobile ? "rounded-[1.1rem]" : "",
        className,
      )}
    >
      <div className="flex items-center gap-1 border-b border-border-glass bg-white/[0.04] px-2.5 py-1.5">
        {esMobile ? (
          <div className="mx-auto h-1 w-8 rounded-full bg-white/20" />
        ) : (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
          </>
        )}
      </div>
      <div className={cn("relative w-full", esMobile ? "aspect-[9/16]" : "aspect-[16/10]")}>
        <Image src={imagen.src} alt={imagen.alt} fill sizes="(max-width: 768px) 50vw, 300px" className="object-cover object-top" />
      </div>
    </div>
  );
}

export function CaseStudies() {
  return (
    <section id="casos" className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Casos de éxito"
          title="Negocios con todo conectado"
          description="Desde sitios en construcción hasta desarrollo a medida y ventas con automatización: así se ve en la vida real un negocio con todo conectado."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {CASOS_EXITO.map((caso, i) => {
            const desktopImgs = caso.imagenes?.filter((img) => img.tipo === "desktop") ?? [];
            const mobileImg = caso.imagenes?.find((img) => img.tipo === "mobile");

            return (
              <motion.div
                key={caso.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
                className="group"
              >
                <GlassCard className="h-full p-8 transition-colors group-hover:border-accent/40">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold text-white">{caso.cliente}</h3>
                    {caso.url !== "#" && (
                      <a
                        href={caso.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Ver sitio de ${caso.cliente}`}
                        className="flex shrink-0 items-center gap-1 text-xs text-text-secondary transition-colors hover:text-accent"
                      >
                        Ver sitio
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>

                  {(desktopImgs.length > 0 || mobileImg) && (
                    <a
                      href={caso.url}
                      target={caso.url !== "#" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="mt-5 grid grid-cols-2 gap-2"
                    >
                      <div className="space-y-2">
                        {desktopImgs.map((img) => (
                          <MockupFrame key={img.src} imagen={img} />
                        ))}
                      </div>
                      {mobileImg && <MockupFrame imagen={mobileImg} className="h-full" />}
                    </a>
                  )}

                  <div className="mt-5 space-y-3 text-sm">
                    <p>
                      <span className="font-semibold text-accent">Reto: </span>
                      <span className="text-text-secondary">{caso.reto}</span>
                    </p>
                    <p>
                      <span className="font-semibold text-accent">Solución: </span>
                      <span className="text-text-secondary">{caso.solucion}</span>
                    </p>
                  </div>

                  <p className="mt-5 rounded-xl bg-accent/10 px-4 py-3 text-sm font-medium text-white">
                    {caso.destacado}
                  </p>

                  {caso.videos && caso.videos.length > 0 && (
                    <div className="mt-5">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
                        Videos hechos para la marca
                      </p>
                      <div className="mt-2 grid grid-cols-4 gap-2">
                        {caso.videos.map((v) => (
                          <a
                            key={v.url}
                            href={v.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/reel relative flex aspect-[9/16] flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] shadow-[0_8px_20px_-10px_rgba(0,0,0,0.7)] transition-transform hover:scale-[1.03]"
                          >
                            <span className="absolute inset-0 bg-black/10 transition-colors group-hover/reel:bg-black/0" />
                            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm">
                              <Play className="h-4 w-4 fill-[#dd2a7b] text-[#dd2a7b]" />
                            </span>
                            <span className="relative mt-1.5 text-[10px] font-semibold text-white">{v.label}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {caso.enProgreso && (
                    <p className="mt-4 flex items-center gap-2 text-xs text-text-secondary">
                      <Hammer className="h-3.5 w-3.5 shrink-0 text-accent" />
                      En desarrollo: {caso.enProgreso}
                    </p>
                  )}
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
