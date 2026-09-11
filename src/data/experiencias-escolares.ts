export interface SchoolListItem {
	title: string;
	description?: string;
	icon?: string;
}

export const schoolObservations: SchoolListItem[] = [
	{ title: 'Demasiado tiempo frente a una pantalla', icon: 'lucide:monitor' },
	{ title: 'Todo lo quieren ya, sin esperar', icon: 'lucide:timer' },
	{ title: 'Les cuesta manejar la frustración', icon: 'lucide:angry' },
	{ title: 'Cada vez menos tiempo al aire libre', icon: 'lucide:sun' },
	{ title: 'Amistades que se quedan solo en el chat', icon: 'lucide:message-circle' },
];

export const schoolWays: SchoolListItem[] = [
	{ title: 'En tu colegio', description: 'llevamos la experiencia Xtremo directo a tus instalaciones.', icon: 'lucide:school' },
	{ title: 'Donde tú lo sueñes', description: 'tú eliges el lugar, nosotros ponemos la logística y la diversión.', icon: 'lucide:map-pin' },
	{ title: 'Sello Cappi', description: 'dinámicas con propósito, organizadas al detalle.', icon: 'lucide:badge-check' },
];

export const schoolBenefits: SchoolListItem[] = [
	{ title: 'Más movimiento y actividad física', icon: 'lucide:activity' },
	{ title: 'Tiempo real al aire libre, lejos de las pantallas', icon: 'lucide:mountain' },
	{ title: 'Amistades genuinas, menos sensación de soledad', icon: 'lucide:users' },
	{ title: 'Herramientas para resolver conflictos y trabajar en equipo', icon: 'lucide:handshake' },
	{ title: 'Más confianza en sí mismos', icon: 'lucide:sparkles' },
	{ title: 'Menos dependencia digital', icon: 'lucide:wifi-off' },
];

export const schoolReasons: SchoolListItem[] = [
	{ title: 'Respaldados por CAPI, Centro de Atención Psicopedagógica Integral', icon: 'lucide:graduation-cap' },
	{ title: 'Equipo capacitado en primeros auxilios, manejo de grupos y dinámicas infantiles', icon: 'lucide:users-round' },
	{ title: 'Enfoque en el bienestar emocional, no solo en la diversión', icon: 'lucide:heart' },
	{ title: 'Planificación cuidada al detalle, pensada para grupos escolares completos', icon: 'lucide:clipboard-check' },
];

export const schoolPrinciples: SchoolListItem[] = [
	{ title: 'Estructura con espacio para la magia', description: 'planificamos cada detalle, pero dejamos lugar para la sorpresa.', icon: 'lucide:wand-sparkles' },
	{ title: 'Se gana en equipo', description: 'retamos a los niños a superarse, sabiendo que la meta se alcanza juntos.', icon: 'lucide:trophy' },
	{ title: 'Un espacio seguro para ser ellos mismos.', icon: 'lucide:shield' },
];
