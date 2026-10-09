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
        <li key={i} className="flex flex-wrap items-center gap-1.5 text-sm sm:justify-end">
          {enlace.etiqueta && (
            <span className="text-text-secondary">{enlace.etiqueta}:</span>
          )}
          {enlace.href ? (
            <a
              href={enlace.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-full items-center gap-1 break-all text-accent hover:underline"
            >
              <span className="break-all">{enlace.valor}</span>
              <ExternalLink size={12} className="shrink-0" />
            </a>
          ) : (
            <span className="break-all text-white">{enlace.valor}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
