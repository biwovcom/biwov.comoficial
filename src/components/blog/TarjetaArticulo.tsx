import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatoFechaBlog, type Articulo } from "@/data/blog";
import { cn } from "@/lib/utils";

export function TarjetaArticulo({
  articulo,
  destacado = false,
  prioridad = false,
}: {
  articulo: Articulo;
  destacado?: boolean;
  prioridad?: boolean;
}) {
  return (
    <Link
      href={`/blog/${articulo.slug}`}
      className={cn(
        "card-universo group flex flex-col rounded-[2rem] p-3 transition-transform duration-500 hover:-translate-y-1 md:p-4",
        destacado && "md:grid md:grid-cols-[1.15fr_1fr] md:gap-4",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-[1.5rem]",
          destacado ? "aspect-[16/10] md:aspect-auto md:min-h-[420px]" : "aspect-[16/10]",
        )}
      >
        <Image
          src={articulo.imagen}
          alt={articulo.imagenAlt}
          fill
          priority={prioridad}
          sizes={destacado ? "(max-width: 768px) 100vw, 700px" : "(max-width: 768px) 100vw, 420px"}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#03101b]/50 to-transparent" />
      </div>
      <div className={cn("flex flex-1 flex-col px-3 pb-4 pt-6", destacado ? "md:justify-center md:px-8" : "md:px-5")}>
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">{articulo.categoria}</span>
        <h3
          className={cn(
            "mt-3 font-medium leading-[1.1] text-white",
            destacado ? "text-3xl md:text-[2.6rem]" : "text-2xl",
          )}
        >
          {articulo.titulo}
        </h3>
        <p className={cn("mt-4 text-white/60", destacado ? "text-base md:text-lg" : "line-clamp-3 text-sm md:text-base")}>
          {articulo.descripcion}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-6 text-sm text-white/45">
          <span>
            {formatoFechaBlog(articulo.publicado)} · {articulo.minutosLectura} min
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-[#03101b]">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
