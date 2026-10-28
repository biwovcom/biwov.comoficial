import { Container } from "@/components/ui/Container";
import { Marquee } from "@/components/ui/Marquee";
import { CLIENTES_MARQUEE } from "@/data/clientesMarquee";

export function ClientesMarquee() {
  return (
    <section className="border-y border-border-glass bg-white/[0.02] py-8">
      <Container>
        <p className="text-center text-xs font-semibold uppercase tracking-wide text-text-secondary">
          Marcas con las que hemos trabajado
        </p>
      </Container>
      <div className="mt-5">
        <Marquee
          items={CLIENTES_MARQUEE}
          keyFn={(cliente) => cliente}
          durationSeconds={32}
          renderItem={(cliente) => (
            <span className="whitespace-nowrap px-6 text-lg font-semibold tracking-wide text-white/40 transition-colors hover:text-white/90 sm:text-xl">
              {cliente}
            </span>
          )}
        />
      </div>
    </section>
  );
}
