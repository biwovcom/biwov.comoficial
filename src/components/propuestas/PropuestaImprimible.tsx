export interface ItemPropuesta {
  nombre: string;
  descripcion?: string;
  incluye?: string[];
  noIncluye?: string[];
  precio: string;
  periodicidad?: "mensual" | "único";
}

export interface TotalPropuesta {
  label: string;
  valor: string;
}

export interface PropuestaImprimibleProps {
  titulo: string;
  subtitulo?: string;
  cliente?: { nombre?: string; empresa?: string };
  items: ItemPropuesta[];
  totales: TotalPropuesta[];
  formasPago: string[];
  validez?: string;
  notas?: string[];
}

export function PropuestaImprimible({
  titulo,
  subtitulo,
  cliente,
  items,
  totales,
  formasPago,
  validez,
  notas,
}: PropuestaImprimibleProps) {
  const fecha = new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="bg-white px-2 py-2 text-[#111827]">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-logo text-2xl font-bold text-[#0f172a]">biwov_</span>
          <p className="mt-0.5 text-xs text-[#6b7280]">Agencia de Marketing Digital · Kathe Digital</p>
        </div>
        <p className="text-xs text-[#6b7280]">{fecha}</p>
      </div>
      <div className="mt-3 h-1 w-full rounded-full bg-gradient-to-r from-[#1e3d52] to-[#1fc4de]" />

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#1fc4de]">
        Propuesta comercial
      </p>
      <h1 className="mt-1 text-2xl font-bold text-[#0f172a]">{titulo}</h1>
      {subtitulo && <p className="mt-1 text-sm text-[#4b5563]">{subtitulo}</p>}
      {cliente && (cliente.nombre || cliente.empresa) && (
        <p className="mt-2 text-sm text-[#4b5563]">
          Para: <span className="font-medium text-[#111827]">{cliente.nombre}</span>
          {cliente.empresa && <> · {cliente.empresa}</>}
        </p>
      )}

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Qué incluye</p>
      <div className="mt-2 space-y-2">
        {items.map((item, i) => (
          <div key={`${item.nombre}-${i}`} className="break-inside-avoid rounded-2xl border border-[#e5e7eb] p-3">
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1e3d52] text-xs font-bold text-white">
                {i + 1}
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-base font-semibold text-[#0f172a]">{item.nombre}</h3>
                  <p className="text-sm font-bold text-[#1e3d52]">
                    {item.precio}
                    {item.periodicidad === "mensual" ? " /mes" : ""}
                  </p>
                </div>
                {item.descripcion && <p className="mt-1 text-sm text-[#4b5563]">{item.descripcion}</p>}
                {item.incluye && item.incluye.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {item.incluye.map((inc) => (
                      <li key={inc} className="text-xs text-[#374151]">
                        <span className="text-[#1fc4de]">✓</span> {inc}
                      </li>
                    ))}
                  </ul>
                )}
                {item.noIncluye && item.noIncluye.length > 0 && (
                  <ul className="mt-1.5 space-y-1">
                    {item.noIncluye.map((no) => (
                      <li key={no} className="text-xs text-[#9ca3af]">
                        ✕ {no}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {totales.length > 0 && (
        <div className="break-inside-avoid mt-4 rounded-2xl bg-[#f3f4f6] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Inversión</p>
          <div className="mt-2 space-y-1">
            {totales.map((t) => (
              <p key={t.label} className="flex justify-between text-sm">
                <span className="text-[#4b5563]">{t.label}</span>
                <span className="font-semibold text-[#0f172a]">{t.valor}</span>
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="break-inside-avoid mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Forma de pago</p>
          <ul className="mt-2 space-y-1">
            {formasPago.map((f) => (
              <li key={f} className="text-sm text-[#374151]">
                • {f}
              </li>
            ))}
          </ul>
        </div>
        {(validez || (notas && notas.length > 0)) && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Notas</p>
            <ul className="mt-2 space-y-1">
              {validez && <li className="text-sm text-[#374151]">• {validez}</li>}
              {notas?.map((n) => (
                <li key={n} className="text-sm text-[#374151]">
                  • {n}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="break-inside-avoid mt-4 border-t border-[#e5e7eb] pt-2">
        <p className="text-[11px] text-[#9ca3af]">
          biwov_ · {titulo} · Kathe Digital · {fecha}
        </p>
      </div>
    </div>
  );
}
