import { ExternalLink } from "lucide-react";
import { extraerEnlaces } from "@/lib/panel/linkify";

export function RedesSocialesLinks({ texto }: { texto: string | null | undefined }) {
  const enlaces = extraerEnlaces(texto);

  if (enlaces.length === 0) {
    return <span className="text-white">—</span>;
  }

  return (
    <ul className="space-y-1.5">
      {enlaces.map((enlace, i) => (
        <li key={i} className="flex items-center gap-1.5 text-sm">
          {enlace.etiqueta && (
            <span className="text-text-secondary">{enlace.etiqueta}:</span>
          )}
          {enlace.href ? (
            <a
              href={enlace.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-accent hover:underline"
            >
              {enlace.valor}
              <ExternalLink size={12} />
            </a>
          ) : (
            <span className="text-white">{enlace.valor}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
