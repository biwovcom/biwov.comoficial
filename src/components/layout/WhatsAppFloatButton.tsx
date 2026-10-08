import { linkWhatsApp } from "@/lib/panel/whatsapp";
import { WHATSAPP_BIWOV, MENSAJE_WHATSAPP_BIWOV } from "@/lib/contacto";

export function WhatsAppFloatButton() {
  return (
    <a
      href={linkWhatsApp(WHATSAPP_BIWOV, MENSAJE_WHATSAPP_BIWOV)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 transition-transform hover:scale-110"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
        <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.1-.472-.15-.671.15-.197.295-.771.966-.944 1.164-.175.195-.349.21-.646.075-.3-.15-1.26-.465-2.4-1.485-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.149-.15.3-.344.449-.521.146-.149.198-.3.3-.52.1-.22.049-.42-.05-.624-.1-.197-.546-1.314-.75-1.796-.2-.473-.405-.408-.57-.408-.172-.015-.372-.015-.572-.015-.198 0-.52.074-.792.37-.272.297-1.04 1.016-1.04 2.478 0 1.462 1.065 2.875 1.213 3.075.149.198 2.052 3.133 4.967 4.27 2.916 1.137 2.916.757 3.439.71.52-.046 1.69-.69 1.927-1.36.235-.666.235-1.24.165-1.36-.07-.12-.26-.198-.558-.346z" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.004 2c-5.518 0-9.997 4.478-9.997 9.997 0 1.76.46 3.47 1.334 4.966L2 22l5.264-1.38a9.955 9.955 0 0 0 4.74 1.207h.004c5.518 0 9.997-4.478 9.997-9.997C21.997 6.478 17.52 2 12.004 2Zm0 18.17h-.003a8.159 8.159 0 0 1-4.158-1.14l-.298-.177-3.097.812.827-3.02-.194-.31a8.147 8.147 0 0 1-1.25-4.338c0-4.51 3.67-8.18 8.183-8.18 2.186 0 4.238.852 5.786 2.4a8.128 8.128 0 0 1 2.397 5.787c0 4.51-3.67 8.18-8.193 8.18Z"
        />
      </svg>
    </a>
  );
}
