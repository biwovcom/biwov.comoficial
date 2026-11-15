import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PLANES_CLIENTES, planClientePorSlug } from "@/data/portafolioClientes";
import { DetallePlan } from "./DetallePlan";

export function generateStaticParams() {
  return PLANES_CLIENTES.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const plan = planClientePorSlug(slug);
  if (!plan) return {};
  return { title: `${plan.nombre} | Planes biwov`, description: plan.gancho };
}

export default async function PlanPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plan = planClientePorSlug(slug);
  if (!plan) notFound();
  return <DetallePlan slug={plan.slug} />;
}
