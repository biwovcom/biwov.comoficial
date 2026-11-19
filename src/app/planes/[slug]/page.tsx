import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { planClientePorSlug } from "@/data/portafolioClientes";
import { DetallePlan } from "./DetallePlan";
import { soloEquipo } from "@/lib/soloEquipo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const plan = planClientePorSlug(slug);
  if (!plan) return {};
  return {
    title: `${plan.nombre} | Planes biwov`,
    description: plan.gancho,
    robots: { index: false, follow: false },
  };
}

export default async function PlanPage({ params }: { params: Promise<{ slug: string }> }) {
  await soloEquipo();
  const { slug } = await params;
  const plan = planClientePorSlug(slug);
  if (!plan) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: plan.nombre,
    description: plan.gancho,
    url: `https://biwov.com/planes/${plan.slug}`,
    serviceType: plan.nombre,
    areaServed: ["Manizales", "Colombia", "Latinoamérica"],
    provider: { "@id": "https://biwov.com/#organizacion" },
    offers: { "@type": "Offer", price: plan.precio, priceCurrency: "COP", description: plan.unidad },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DetallePlan slug={plan.slug} />
    </>
  );
}
