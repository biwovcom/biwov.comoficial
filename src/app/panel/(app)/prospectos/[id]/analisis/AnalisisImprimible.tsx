import { PAQUETES_INFO, type AnalisisIA } from "@/lib/panel/ia/schema";

const ETAPA_LABEL: Record<AnalisisIA["etapaNegocio"], string> = {
  empezando: "Empezando",
  "vende-irregular": "Vende de forma irregular",
  "vende-estable-escalar": "Vende estable y quiere escalar",
};

const CUELLO_LABEL: Record<AnalisisIA["cuelloDeBotella"]["tipo"], string> = {
  captacion: "Captación — entran pocos interesados",
  conversion: "Conversión — entran muchos pero compran pocos",
  oferta: "Oferta — vende pero cada cliente deja poco",
  operacion: "Operación — vende bien pero no da abasto",
};

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 break-inside-avoid">
      <h2 className="text-sm font-bold uppercase tracking-wide text-[#0d3b66]">{titulo}</h2>
      <div className="mt-1.5 text-sm text-[#111827]">{children}</div>
    </div>
  );
}

function Lista({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function AnalisisImprimible({
  prospectoNombre,
  empresa,
  contenido,
  textoManual,
}: {
  prospectoNombre: string;
  empresa: string | null;
  contenido: AnalisisIA | null;
  textoManual: string | null;
}) {
  const fecha = new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="bg-white p-8 text-[#111827]">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#0d3b66]">
        Diagnóstico · biwov_
      </p>
      <h1 className="mt-1 text-2xl font-bold text-[#0d1420]">{empresa || prospectoNombre}</h1>
      <p className="mt-1 text-xs text-[#5b6677]">{fecha}</p>

      <div className="mt-6 border-t border-[#d1d5db] pt-6">
        {contenido ? (
          <>
            <Seccion titulo="Etapa del negocio">
              <p className="font-medium">{ETAPA_LABEL[contenido.etapaNegocio]}</p>
              <p className="mt-1 text-[#4b5563]">{contenido.etapaNegocioExplicacion}</p>
            </Seccion>

            <Seccion titulo="Diagnóstico">
              <p className="font-medium">Qué tiene</p>
              <Lista items={contenido.diagnostico.queTiene} />
              <p className="mt-2 font-medium">Qué le falta</p>
              <Lista items={contenido.diagnostico.queLeFalta} />
              <p className="mt-2 text-[#4b5563]">{contenido.diagnostico.porQueNoHaCrecido}</p>
            </Seccion>

            <Seccion titulo="Lo que pide vs. lo que necesita">
              <p>
                <span className="font-medium">Pide:</span> {contenido.pideVsNecesita.pide}
              </p>
              <p className="mt-1">
                <span className="font-medium">Necesita:</span> {contenido.pideVsNecesita.necesita}
              </p>
            </Seccion>

            <Seccion titulo="Evaluación del mercado (1 a 10)">
              <ul className="space-y-1.5">
                <li>
                  <span className="font-medium">Dolor:</span> {contenido.evaluacionMercado.dolor.puntaje}/10 —{" "}
                  {contenido.evaluacionMercado.dolor.justificacion}
                </li>
                <li>
                  <span className="font-medium">Capacidad de pago:</span>{" "}
                  {contenido.evaluacionMercado.capacidadDePago.puntaje}/10 —{" "}
                  {contenido.evaluacionMercado.capacidadDePago.justificacion}
                </li>
                <li>
                  <span className="font-medium">Facilidad para encontrarlo:</span>{" "}
                  {contenido.evaluacionMercado.facilidadParaEncontrarlo.puntaje}/10 —{" "}
                  {contenido.evaluacionMercado.facilidadParaEncontrarlo.justificacion}
                </li>
                <li>
                  <span className="font-medium">Crecimiento del sector:</span>{" "}
                  {contenido.evaluacionMercado.crecimiento.puntaje}/10 —{" "}
                  {contenido.evaluacionMercado.crecimiento.justificacion}
                </li>
              </ul>
            </Seccion>

            <Seccion titulo="Cuello de botella">
              <p className="font-medium">{CUELLO_LABEL[contenido.cuelloDeBotella.tipo]}</p>
              <p className="mt-1 text-[#4b5563]">{contenido.cuelloDeBotella.explicacion}</p>
            </Seccion>

            <Seccion titulo="Paquete recomendado">
              <p className="font-medium">{PAQUETES_INFO[contenido.paqueteRecomendado.paquete].nombre}</p>
              <p className="text-[#4b5563]">{PAQUETES_INFO[contenido.paqueteRecomendado.paquete].descripcion}</p>
              <p className="mt-1 text-[#4b5563]">{contenido.paqueteRecomendado.justificacion}</p>
            </Seccion>

            {contenido.noRecomendarPorAhora.length > 0 && (
              <Seccion titulo="Qué no recomendamos por ahora">
                <Lista items={contenido.noRecomendarPorAhora} />
              </Seccion>
            )}

            <Seccion titulo="Ideas de contenido">
              <Lista items={contenido.ideasContenido} />
            </Seccion>
          </>
        ) : (
          <p className="whitespace-pre-line text-sm">{textoManual}</p>
        )}
      </div>
    </div>
  );
}
