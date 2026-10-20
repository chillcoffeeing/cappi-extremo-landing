import { WHATSAPP_URL } from './social';

// Acortadores wa.link: SOLO para botones de CTA directos (abren WhatsApp con un
// saludo fijo). wa.link descarta cualquier `?text=`, así que nunca se usan para
// enviar datos de un formulario (F-060, fe-A-3).
// Destino comprobado el 2026-10-19 con `curl -sI`: los tres redirigen (301) a
// api.whatsapp.com/send?phone=584140712311.
export const SCHOOL_EXPERIENCES_WHATSAPP_URL = 'https://wa.link/0emz5n';
export const CORPORATE_EVENTS_WHATSAPP_URL = 'https://wa.link/ox0bdz';
export const CELEBRA_CON_CAPPI_WHATSAPP_URL = 'https://wa.link/lcjcpu';

// Formularios de leads: wa.me con el mismo número que los wa.link, para que el
// texto con los datos del formulario llegue a WhatsApp.
export const SCHOOL_EXPERIENCES_FORM_WHATSAPP_URL = WHATSAPP_URL;
export const CORPORATE_EVENTS_FORM_WHATSAPP_URL = WHATSAPP_URL;

// Saludos que antes ponían los wa.link; ahora encabezan el mensaje del formulario.
export const SCHOOL_EXPERIENCES_GREETING = 'Hola! Vengo del sitio web de Cappi y estoy interesad@ en cotizar una experiencia escolar.';
export const CORPORATE_EVENTS_GREETING = 'Hola! Vengo del sitio web de Cappi y estoy interesad@ en cotizar un evento corporativo.';

export const INFO_EMAIL = 'info@cappixtremo.com';

export function buildWhatsAppUrl(baseUrl: string, lines: string[]) {
	const message = lines.filter(Boolean).join('\n');
	const separator = baseUrl.includes('?') ? '&' : '?';
	return `${baseUrl}${separator}text=${encodeURIComponent(message)}`;
}

export function buildMailtoUrl(email: string, subject: string, lines: string[]) {
	const body = lines.filter(Boolean).join('\n');
	return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// F-060 (decisión del usuario 2026-10-19): los botones de inscripción y de
// acceso que antes iban a /coming-soon abren el WhatsApp de la landing (wa.me)
// con un saludo. Button.astro los abre en pestaña nueva con rel="noopener noreferrer".
export const ENROLL_WHATSAPP_URL = buildWhatsAppUrl(WHATSAPP_URL, ['Hola, quiero inscribir a mi hijo en Cappi Xtremo.']);
export const PORTAL_ACCESS_WHATSAPP_URL = buildWhatsAppUrl(WHATSAPP_URL, ['Hola, necesito ayuda para entrar al portal de familias de Cappi Xtremo.']);
