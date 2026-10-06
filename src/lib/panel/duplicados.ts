export interface ProspectoResumen {
  id: string;
  nombre: string;
  whatsapp: string;
  email: string | null;
}

export interface CoincidenciaDuplicado {
  campo: "correo" | "teléfono" | "nombre";
  prospecto: ProspectoResumen;
}

function soloDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

/** Compara los últimos 9-10 dígitos para no fallar por el indicativo del país. */
function mismoTelefono(a: string, b: string): boolean {
  const da = soloDigitos(a);
  const db = soloDigitos(b);
  if (!da || !db) return false;
  const cola = (s: string) => s.slice(-9);
  return cola(da) === cola(db);
}

/**
 * Busca si el correo, teléfono o nombre que se está escribiendo ya existe
 * en otro prospecto, para avisar antes de crear un duplicado.
 */
export function detectarDuplicados(
  datos: { nombre: string; whatsapp: string; email?: string },
  prospectos: ProspectoResumen[],
): CoincidenciaDuplicado[] {
  const coincidencias: CoincidenciaDuplicado[] = [];
  const nombre = datos.nombre.trim().toLowerCase();
  const email = datos.email?.trim().toLowerCase();
  const whatsapp = datos.whatsapp.trim();

  for (const p of prospectos) {
    if (email && p.email && p.email.trim().toLowerCase() === email) {
      coincidencias.push({ campo: "correo", prospecto: p });
    }
    if (whatsapp && mismoTelefono(whatsapp, p.whatsapp)) {
      coincidencias.push({ campo: "teléfono", prospecto: p });
    }
    if (nombre && nombre.length > 2 && p.nombre.trim().toLowerCase() === nombre) {
      coincidencias.push({ campo: "nombre", prospecto: p });
    }
  }

  return coincidencias;
}
