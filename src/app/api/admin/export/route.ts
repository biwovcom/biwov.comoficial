import { NextResponse } from "next/server";
import { leerLeadsLocales } from "@/lib/localStore";

function aCsvValor(valor: unknown): string {
  if (valor === null || valor === undefined) return "";
  const texto = Array.isArray(valor) || typeof valor === "object"
    ? JSON.stringify(valor)
    : String(valor);
  return `"${texto.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  if (!process.env.ADMIN_ACCESS_KEY || key !== process.env.ADMIN_ACCESS_KEY) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const leads = leerLeadsLocales();
  if (leads.length === 0) {
    return new NextResponse("Sin registros todavía\n", {
      headers: { "Content-Type": "text/csv; charset=utf-8" },
    });
  }

  const columnas = Array.from(
    leads.reduce((set, lead) => {
      Object.keys(lead).forEach((k) => set.add(k));
      return set;
    }, new Set<string>()),
  );

  const filas = [
    columnas.join(","),
    ...leads.map((lead) => columnas.map((c) => aCsvValor(lead[c])).join(",")),
  ];

  return new NextResponse(filas.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="biwov-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
