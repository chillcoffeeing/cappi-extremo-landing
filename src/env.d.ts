/// <reference types="astro/client" />

declare module "*.svg?raw" {
	const content: string;
	export default content;
}

interface Window {
	cappiTurnstileSitekey: string;
	onloadTurnstileCallback: () => void;
	cappiValidateTurnstile: (widgetId: string, errorId?: string) => boolean;
}
