import { PLANES, DURACION_MINIMA_MESES, type Plan } from "@/data/planes";
import { EXTRAS_COTIZABLES, type CategoriaExtra } from "@/data/extrasCotizables";
import { formatCopEnMoneda } from "@/lib/moneda";
import type { PropuestaImprimibleProps, ItemPropuesta } from "@/components/propuestas/PropuestaImprimible";

export interface ExtraRecomendado {
  nombre: string;
  categoria: CategoriaExtra;
  obligatorio: boolean;
  justificacion: string;
}

/**
 * Convierte una recomendación de la IA (id de plan real + extras reales con
 * su categoría) en los props listos para PropuestaImprimible / el generador
 * de PDF. Los extras opcionales (obligatorio: false) no se cobran en el
 * total — quedan como sugerencia en las notas.
 */
export function propuestaDesdeRecomendacion({
  planId,
  extrasRecomendados,
  cliente,
  titulo,
}: {
  planId: Plan["id"];
  extrasRecomendados: ExtraRecomendado[];
  cliente?: { nombre?: string; empresa?: string };
  titulo?: string;
}): PropuestaImprimibleProps | null {
  const plan = PLANES.find((p) => p.id === planId);
  if (!plan) return null;

  const extrasObligatorios = extrasRecomendados.filter((e) => e.obligatorio);
  const extrasOpcionales = extrasRecomendados.filter((e) => !e.obligatorio);

  const buscarExtraReal = (e: ExtraRecomendado) =>
    EXTRAS_COTIZABLES.find((x) => x.nombre === e.nombre && x.categoria === e.categoria);

  const items: ItemPropuesta[] = [
    {
      nombre: `Plan ${plan.nombre}`,
      descripcion: plan.paraQuien,
      incluye: plan.incluye.flatMap((i) => [i.label, ...(i.subitems ?? [])]),
      precio: formatCopEnMoneda(plan.precioDesde.cop, "COP", 1),
      periodicidad: "mensual",
    },
    ...extrasObligatorios.map((e) => {
      const real = buscarExtraReal(e);
      return {
        nombre: e.nombre,
        descripcion: e.justificacion,
        precio: real ? formatCopEnMoneda(real.precioCop, "COP", 1) : "Por confirmar",
        periodicidad: real?.periodicidad,
      };
    }),
  ];

  const totalMensual =
    plan.precioDesde.cop +
    extrasObligatorios.reduce((acc, e) => {
      const real = buscarExtraReal(e);
      return acc + (real?.periodicidad === "mensual" ? real.precioCop : 0);
    }, 0);
  const totalUnico = extrasObligatorios.reduce((acc, e) => {
    const real = buscarExtraReal(e);
    return acc + (real?.periodicidad === "único" ? real.precioCop : 0);
  }, 0);

  return {
    titulo: titulo ?? `Propuesta para ${cliente?.empresa || cliente?.nombre || plan.nombre}`,
    subtitulo: plan.claim,
    cliente,
    items,
    totales: [
      { label: "Mensualidad total", valor: formatCopEnMoneda(totalMensual, "COP", 1) },
      ...(totalUnico > 0
        ? [{ label: "Pago único (montaje/producción)", valor: formatCopEnMoneda(totalUnico, "COP", 1) }]
        : []),
    ],
    formasPago: [
      "Montaje inicial en 1 o 2 cuotas iguales (sin recargo)",
      "Mensualidad del plan, mes a mes",
      "Transferencia o PSE, se coordina por WhatsApp",
    ],
    validez: `Compromiso mínimo de ${DURACION_MINIMA_MESES} meses.`,
    notas:
      extrasOpcionales.length > 0
        ? extrasOpcionales.map((e) => `También recomendado (opcional): ${e.nombre} — ${e.justificacion}`)
        : undefined,
  };
}
