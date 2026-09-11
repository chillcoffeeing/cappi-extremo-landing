export interface CorporateListItem {
	title: string;
	description?: string;
	icon?: string;
}

export const corporateReasons: CorporateListItem[] = [
	{ title: 'Respaldados por CAPI, Centro de Atención Psicopedagógica Integral', icon: 'lucide:graduation-cap' },
	{ title: 'Equipo capacitado en manejo de grupos y recreación infantil', icon: 'lucide:users-round' },
	{ title: 'Programas adaptados a la cantidad de niños y al espacio del evento', icon: 'lucide:sliders-horizontal' },
	{ title: 'Logística integral: nosotros llevamos todo lo necesario', icon: 'lucide:package-check' },
];

export const corporatePrinciples: CorporateListItem[] = [
	{ title: 'Estructura con espacio para la magia', description: 'planificamos cada detalle, pero dejamos lugar para la sorpresa.', icon: 'lucide:wand-sparkles' },
	{ title: 'Se gana en equipo', description: 'retamos a los niños a superarse, sabiendo que la meta se alcanza juntos.', icon: 'lucide:trophy' },
	{ title: 'Un espacio seguro para ser ellos mismos.', icon: 'lucide:shield' },
	{ title: 'Una comunidad real, no una pantalla más.', icon: 'lucide:users' },
];

export const corporateConversation: CorporateListItem[] = [
	{ title: 'Respuesta rápida por WhatsApp' },
	{ title: 'Programas personalizados según tu evento' },
	{ title: 'Equipo capacitado en recreación infantil' },
];

export const corporateEventTypes = [
	'Fiesta de fin de año',
	'Día del niño',
	'Jornada familiar',
	'Otro',
];

export const corporateChildrenRanges = [
	'1–20',
	'21–50',
	'51–100',
	'Más de 100',
];
