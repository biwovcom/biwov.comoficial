import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { TarjetaArticulo } from "@/components/blog/TarjetaArticulo";
import { articulosOrdenados } from "@/data/blog";

export function BlogTeaser() {
  const articulos = articulosOrdenados().slice(0, 3);
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="mb-5 block text-xs font-semibold uppercase tracking-[0.22em] text-accent md:text-sm">
              Blog
            </span>
            <h2 className="max-w-3xl text-4xl font-medium leading-[1.04] text-white sm:text-5xl md:text-6xl">
              Ideas para vender más con <span className="text-accent">marketing digital.</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="shrink-0 border-b border-white/70 pb-1 text-base text-white transition-colors hover:border-accent hover:text-accent md:text-lg"
          >
            Ver todos los artículos
          </Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {articulos.map((a) => (
            <TarjetaArticulo key={a.slug} articulo={a} />
          ))}
        </div>
      </Container>
    </section>
  );
}
