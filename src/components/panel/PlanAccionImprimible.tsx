import type { PlanCreativoEntrada } from "@/lib/panel/planCreativos";

function Seccion({ titulo, items }: { titulo: string; items: PlanCreativoEntrada[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-6 break-inside-avoid">
      <h2 className="text-sm font-bold uppercase tracking-wide text-[#0d3b66]">{titulo}</h2>
      <div className="mt-2 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="break-inside-avoid border-t border-[#e5e7eb] pt-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#0d3b66]">{item.tipo}</span>
              {item.aprobado && (
                <span className="rounded-full bg-[#dcfce7] px-2 py-0.5 text-[10px] font-semibold text-[#15803d]">
                  ✓ Aprobado{item.aprobado_en ? ` el ${new Date(item.aprobado_en).toLocaleDateString("es-CO")}` : ""}
                </span>
              )}
            </div>
            {item.titulo && <p className="mt-1 text-sm font-semibold text-[#111827]">{item.titulo}</p>}
            {item.link && (
              <p className="mt-0.5 text-xs text-[#1d4772] underline">{item.link}</p>
            )}
            {item.contenido && (
              <p className="mt-1 whitespace-pre-line text-sm text-[#111827]">{item.contenido}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlanAccionImprimible({
  prospectoNombre,
  empresa,
  creativos,
  embudo,
}: {
  prospectoNombre: string;
  empresa: string | null;
  creativos: PlanCreativoEntrada[];
  embudo: PlanCreativoEntrada[];
}) {
  const fecha = new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="bg-white p-8 text-[#111827]">
      <span className="font-logo text-2xl font-bold">biwov_</span>
      <p className="mt-0.5 text-xs text-[#4b5563]">Agencia de Marketing Digital</p>
      <div className="mt-3 h-1 w-full rounded-full bg-gradient-to-r from-[#1d4772] to-[#3d98cc]" />

      <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-[#0d3b66]">
        Plan de acción · biwov_
      </p>
      <h1 className="mt-1 text-2xl font-bold text-[#0d1420]">{empresa || prospectoNombre}</h1>
      <p className="mt-1 text-xs text-[#5b6677]">{fecha}</p>

      <div className="mt-6 border-t border-[#d1d5db] pt-6">
        <Seccion titulo="Creativos" items={creativos} />
        <Seccion titulo="Embudo y campaña" items={embudo} />
        {creativos.length === 0 && embudo.length === 0 && (
          <p className="text-sm text-[#4b5563]">Todavía no hay ítems en el plan de acción.</p>
        )}
      </div>
    </div>
  );
}
