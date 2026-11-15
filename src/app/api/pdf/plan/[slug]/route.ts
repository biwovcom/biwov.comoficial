import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { planClientePorSlug } from "@/data/portafolioClientes";
import { PlanPdfDocument } from "@/lib/pdf/PlanPdfDocument";

/** PDF descargable de un plan estándar: /api/pdf/plan/<slug> */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const plan = planClientePorSlug(slug);
  if (!plan) return NextResponse.json({ error: "Plan no encontrado" }, { status: 404 });
  try {
    const pdf = await renderToBuffer(PlanPdfDocument(plan));
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${slug}-biwov.pdf"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "No se pudo generar el PDF" }, { status: 500 });
  }
}
