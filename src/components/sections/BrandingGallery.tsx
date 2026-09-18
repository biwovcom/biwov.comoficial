import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { PIEZAS_BRANDING } from "@/data/branding";
import { Palette } from "lucide-react";

export function BrandingGallery() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Identidad de marca"
          title="Branding que sostiene cada ecosistema"
          description="Logos, paletas y aplicaciones de marca diseñados para que tu negocio se vea tan sólido como funciona."
        />

        {PIEZAS_BRANDING.length === 0 ? (
          <GlassCard className="mx-auto mt-14 flex max-w-lg flex-col items-center gap-3 p-10 text-center">
            <Palette className="h-8 w-8 text-accent" />
            <p className="text-sm text-text-secondary">
              Próximamente: galería de piezas de identidad de marca.
            </p>
          </GlassCard>
        ) : (
          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
            {PIEZAS_BRANDING.map((pieza) => (
              <GlassCard key={pieza.src} className="overflow-hidden p-2">
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                  <Image
                    src={pieza.src}
                    alt={pieza.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
