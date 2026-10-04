import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TECNOLOGIAS } from "@/data/tecnologia";

export function TechWall() {
  const doble = [...TECNOLOGIAS, ...TECNOLOGIAS];

  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Motor tecnológico"
          title="La tecnología que usamos para conectar todo"
          description="biwov combina estas herramientas y sus propias automatizaciones para que todo funcione en conjunto."
        />
      </Container>

      <div className="relative mt-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee gap-4">
          {doble.map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="whitespace-nowrap rounded-full border border-border-glass bg-white/[0.03] px-6 py-3 text-sm font-medium text-white/90"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
