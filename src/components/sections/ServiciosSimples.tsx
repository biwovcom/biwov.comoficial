import { Bot, Compass, Database, Mail, Megaphone, MessagesSquare, Workflow, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { linkWhatsApp } from "@/lib/panel/whatsapp";
import { WHATSAPP_BIWOV } from "@/lib/contacto";

interface Servicio {
  titulo: string;
  texto: string;
  icono: LucideIcon;
}

/**
 * Servicios del inicio, en versión simple y sin precios. La tienda y los
 * planes con precios quedaron ocultos (solo los abre Kathe desde el panel
 * para armar cotizaciones); aquí cada servicio lleva a WhatsApp para cotizar.
 */
const SERVICIOS: Servicio[] = [
  {
    titulo: "CRM",
    texto: "Toda la información de tus clientes en un solo lugar: quién te escribió, en qué va y a quién hacerle seguimiento.",
    icono: Database,
  },
  {
    titulo: "Chatbot",
    texto: "Tu WhatsApp responde solo las preguntas frecuentes, filtra curiosos y te pasa a quien está listo para comprar.",
    icono: Bot,
  },
  {
    titulo: "Email marketing",
    texto: "Correos automáticos para dar la bienvenida, hacer seguimiento y lograr que tus clientes vuelvan a comprar.",
    icono: Mail,
  },
  {
    titulo: "Mensajes masivos por WhatsApp",
    texto: "Campañas a tu base de datos autorizada para anunciar promociones, lanzamientos y recordatorios.",
    icono: MessagesSquare,
  },
  {
    titulo: "Publicidad · Campañas publicitarias",
    texto: "Campañas en Facebook e Instagram para que más personas te conozcan, te escriban y te compren.",
    icono: Megaphone,
  },
  {
    titulo: "Asesoría de marketing",
    texto: "Estrategia, planeación y lineamientos para que tú o tu equipo ejecuten con claridad y sin adivinar.",
    icono: Compass,
  },
  {
    titulo: "Automatizaciones",
    texto: "Conectamos tus herramientas para que las tareas repetitivas se hagan solas y no se pierda ningún cliente.",
    icono: Workflow,
  },
];

export function ServiciosSimples() {
  return (
    <section id="servicios" className="scroll-mt-24 py-16 md:py-24">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Lo que hacemos</p>
        <h2 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-white md:text-6xl">
          Servicios
        </h2>
        <p className="mt-4 max-w-2xl text-text-secondary md:text-lg">
          Elige lo que necesita tu negocio y te armamos una cotización a la medida.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICIOS.map(({ titulo, texto, icono: Icono }) => (
            <article key={titulo} className="card-universo flex flex-col rounded-[1.75rem] p-7">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent/10">
                <Icono className="h-5 w-5 text-accent" strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-white">{titulo}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-white/75">{texto}</p>
              <a
                href={linkWhatsApp(WHATSAPP_BIWOV, `¡Hola! Quiero cotizar el servicio de ${titulo.toLowerCase()} para mi negocio.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#03101b] transition-transform hover:scale-[1.03]"
              >
                <WhatsAppIcon className="h-4 w-4" /> Cotizar
              </a>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
