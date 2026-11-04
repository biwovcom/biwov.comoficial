import { NextResponse } from "next/server";
import { generarPropuestaPdfBuffer } from "@/lib/pdf/generarPropuestaPdf";
import type { PropuestaImprimibleProps } from "@/components/propuestas/PropuestaImprimible";

function slug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export async function POST(request: Request) {
  let body: PropuestaImprimibleProps;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!body?.titulo || !Array.isArray(body.items) || !Array.isArray(body.totales) || !Array.isArray(body.formasPago)) {
    return NextResponse.json({ error: "Faltan datos de la propuesta" }, { status: 400 });
  }
  if (body.items.length > 50 || (body.notas?.length ?? 0) > 50) {
    return NextResponse.json({ error: "La propuesta tiene demasiados ítems" }, { status: 400 });
  }

  try {
    const pdf = await generarPropuestaPdfBuffer(body);
    const nombreArchivo = `${slug(body.titulo) || "propuesta"}-biwov.pdf`;
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${nombreArchivo}"`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "No se pudo generar el PDF" },
      { status: 500 },
    );
  }
}
