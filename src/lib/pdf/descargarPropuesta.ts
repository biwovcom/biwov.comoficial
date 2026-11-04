import type { PropuestaImprimibleProps } from "@/components/propuestas/PropuestaImprimible";

export async function descargarPropuestaPdf(
  datos: PropuestaImprimibleProps,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/pdf/propuesta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return { ok: false, error: data?.error ?? "No se pudo generar el PDF." };
    }
    const disposicion = res.headers.get("Content-Disposition") ?? "";
    const nombreArchivo = disposicion.match(/filename="(.+)"/)?.[1] ?? "propuesta-biwov.pdf";
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error de red." };
  }
}
