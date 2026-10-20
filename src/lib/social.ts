export const WHATSAPP_URL = "https://wa.me/584140712311";
export const EMAIL_URL = "mailto:info@cappixtremo.com";
// F-060 (decisión del usuario 2026-10-19): la cuenta real es "cappixtremo".
// Único origen de verdad de las redes en toda la landing.
export const SOCIAL_HANDLE = "cappixtremo";
export const INSTAGRAM_HANDLE = `@${SOCIAL_HANDLE}`;
export const INSTAGRAM_URL = `https://instagram.com/${SOCIAL_HANDLE}`;
export const FACEBOOK_URL = `https://facebook.com/${SOCIAL_HANDLE}`;

// Portal de familias (inscripción y login). Ver docs/despliegue-cpanel.md.
export const PORTAL_URL = "https://app.cappixtremo.com";
export const PORTAL_ONBOARDING_URL = `${PORTAL_URL}/onboarding`;

// F-048: todo link a WhatsApp abre en pestaña nueva. Hosts reconocidos como
// WhatsApp (incluye los acortadores wa.link usados en lib/lead-links.ts).
const WHATSAPP_HOSTS = new Set([
	"wa.me",
	"wa.link",
	"api.whatsapp.com",
	"web.whatsapp.com",
	"chat.whatsapp.com",
	"whatsapp.com",
	"www.whatsapp.com",
]);

export function isWhatsAppUrl(href?: string | null): boolean {
	if (!href) return false;
	if (href.toLowerCase().startsWith("whatsapp:")) return true;
	try {
		return WHATSAPP_HOSTS.has(new URL(href).hostname.toLowerCase());
	} catch {
		// Rutas relativas (/contacto, #ancla) no son WhatsApp.
		return false;
	}
}
