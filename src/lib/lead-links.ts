export const SCHOOL_EXPERIENCES_WHATSAPP_URL = 'https://wa.link/0emz5n';
export const CORPORATE_EVENTS_WHATSAPP_URL = 'https://wa.link/ox0bdz';
export const CELEBRA_CON_CAPPI_WHATSAPP_URL = 'https://wa.link/lcjcpu';
export const INFO_EMAIL = 'info@cappiextremo.com';

export function buildWhatsAppUrl(baseUrl: string, lines: string[]) {
	const message = lines.filter(Boolean).join('\n');
	return `${baseUrl}?text=${encodeURIComponent(message)}`;
}

export function buildMailtoUrl(email: string, subject: string, lines: string[]) {
	const body = lines.filter(Boolean).join('\n');
	return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
