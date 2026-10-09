export interface NegocioCliente {
  id: string;
  prospecto_id: string;
  fecha_inicio: string | null;
  clientes_linea_base: number | null;
  ventas_mensuales_linea_base: number | null;
  ticket_promedio_linea_base: number | null;
  moneda: "COP" | "USD" | null;
  notas: string | null;
}

export interface NegocioHistorialEntrada {
  id: string;
  prospecto_id: string;
  fecha: string;
  clientes_actuales: number | null;
  ventas_mensuales: number | null;
  ticket_promedio: number | null;
  costo_por_cliente: number | null;
  moneda: "COP" | "USD" | null;
  notas: string | null;
  created_at: string;
}

/** Lo que SÍ se le puede pedir al cliente sin pasarse de la raya: números redondos, no su contabilidad completa. */
export const DATOS_A_PEDIR_AL_CLIENTE: { campo: string; pregunta: string; porque: string }[] = [
  {
    campo: "Fecha de inicio",
    pregunta: "¿Desde cuándo trabajamos juntos? (o desde cuándo empezó este plan)",
    porque: "Es el ancla del \"antes\": sin esto no hay punto de comparación real.",
  },
  {
    campo: "Clientes actuales",
    pregunta: "¿Cuántos clientes activos tenías antes de empezar, y cuántos tienes hoy?",
    porque: "Un número redondo que cualquier dueño de negocio conoce de memoria, sin pedirle listas ni datos personales.",
  },
  {
    campo: "Ventas mensuales",
    pregunta: "¿Cuántas ventas o cierres haces al mes, en promedio?",
    porque: "Cantidad, no el detalle de cada venta — tampoco hace falta saber a quién le vendió.",
  },
  {
    campo: "Ticket promedio",
    pregunta: "¿Cuál es tu precio promedio de venta?",
    porque: "Con esto y las ventas mensuales ya puedes estimar el ingreso, sin que te comparta cifras exactas de facturación.",
  },
  {
    campo: "Costo por cliente nuevo (opcional)",
    pregunta: "¿Tienes una idea de cuánto te cuesta conseguir un cliente nuevo?",
    porque: "Si lo sabe, permite estimar un ROI aproximado. Muchos clientes no lo saben exacto — por eso es opcional, no se insiste.",
  },
];

/** Lo que NO se le debe pedir: eso ya es contabilidad/privacidad del cliente, no tuyo. */
export const DATOS_QUE_NO_SE_PIDEN = [
  "Estados financieros completos o utilidad neta exacta del negocio.",
  "Nombres, datos personales o de contacto de los clientes del cliente.",
  "Información tributaria o bancaria.",
  "Cualquier cifra que el cliente no te dé por iniciativa propia o sin pedírsela con confianza — si duda en responder, no se insiste.",
];

/** Lo que tú ya sacas sola, sin preguntarle nada al cliente (pestaña Redes y crecimiento). */
export const DATOS_QUE_TU_SACAS = [
  "Alcance, visualizaciones e interacciones — Panel profesional de Instagram.",
  "Seguidores, seguidos y % de vistas de no seguidores — mismo panel.",
  "Engagement y frecuencia — se calculan solos en la pestaña Redes y crecimiento.",
];

export interface ComparacionNegocio {
  crecimientoClientesPct: number | null;
  crecimientoVentasPct: number | null;
  ingresoMensualEstimadoBase: number | null;
  ingresoMensualEstimadoActual: number | null;
  roiAproximadoPct: number | null;
}

/** Compara la línea base contra la medición más reciente del historial. */
export function calcularComparacionNegocio(
  base: NegocioCliente | null,
  ultima: NegocioHistorialEntrada | null,
): ComparacionNegocio {
  const crecimientoClientesPct =
    base?.clientes_linea_base && ultima?.clientes_actuales
      ? ((ultima.clientes_actuales - base.clientes_linea_base) / base.clientes_linea_base) * 100
      : null;

  const crecimientoVentasPct =
    base?.ventas_mensuales_linea_base && ultima?.ventas_mensuales
      ? ((ultima.ventas_mensuales - base.ventas_mensuales_linea_base) / base.ventas_mensuales_linea_base) * 100
      : null;

  const ingresoMensualEstimadoBase =
    base?.ventas_mensuales_linea_base && base?.ticket_promedio_linea_base
      ? base.ventas_mensuales_linea_base * base.ticket_promedio_linea_base
      : null;

  const ingresoMensualEstimadoActual =
    ultima?.ventas_mensuales && ultima?.ticket_promedio ? ultima.ventas_mensuales * ultima.ticket_promedio : null;

  let roiAproximadoPct: number | null = null;
  if (ultima?.costo_por_cliente && base?.clientes_linea_base && ultima?.clientes_actuales && ultima.ticket_promedio) {
    const clientesNuevos = ultima.clientes_actuales - base.clientes_linea_base;
    if (clientesNuevos > 0) {
      const inversion = clientesNuevos * ultima.costo_por_cliente;
      const ingresoPorClientesNuevos = clientesNuevos * ultima.ticket_promedio;
      roiAproximadoPct = ((ingresoPorClientesNuevos - inversion) / inversion) * 100;
    }
  }

  return {
    crecimientoClientesPct,
    crecimientoVentasPct,
    ingresoMensualEstimadoBase,
    ingresoMensualEstimadoActual,
    roiAproximadoPct,
  };
}
