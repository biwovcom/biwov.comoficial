import { NextResponse } from "next/server";
import { TRM_FALLBACK } from "@/lib/moneda";

const URL_TRM =
  "https://www.datos.gov.co/resource/32sa-8pi3.json?$order=vigenciadesde%20DESC&$limit=1";

export async function GET() {
  try {
    const res = await fetch(URL_TRM, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data: { valor?: string; vigenciadesde?: string }[] = await res.json();
      const valor = Number(data[0]?.valor);
      if (Number.isFinite(valor) && valor > 1000 && valor < 20000) {
        return NextResponse.json({
          trm: valor,
          fecha: data[0]?.vigenciadesde ?? null,
          fuente: "datos.gov.co",
        });
      }
    }
  } catch {
    // Sigue al valor de respaldo abajo.
  }

  return NextResponse.json({ trm: TRM_FALLBACK, fecha: null, fuente: "respaldo" });
}
