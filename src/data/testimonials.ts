export interface Testimonial {
	id: string;
	quote: string;
	name: string;
	context: string;
}

export const testimonials: Testimonial[] = [
	{
		id: 'summer-camp',
		quote: 'Mi hijo vuelve cansado, sucio y feliz. Exactamente lo que esperábamos del verano.',
		name: 'Carolina M.',
		context: 'Mamá de Mateo · 9 años',
	},
	{
		id: 'organization',
		quote: 'La organización es impecable y el trato con los niños, espectacular. Repetimos sin dudarlo.',
		name: 'Andrés R.',
		context: 'Papá de Valentina · 7 años',
	},
	{
		id: 'activities',
		quote: 'Sofía no paraba de contar las actividades día tras día. La mejor experiencia de sus vacaciones.',
		name: 'Laura P.',
		context: 'Mamá de Sofía · 8 años',
	},
	{
		id: 'safety',
		quote: 'Seguridad, diversión y un equipo encantador. Como padres, tranquilidad total.',
		name: 'Javier T.',
		context: 'Papá de Diego · 10 años',
	},
	{
		id: 'next-vacation',
		quote: 'El plan vacacional superó todo lo que imaginábamos. Ya estamos contando los días para el próximo.',
		name: 'Daniela C.',
		context: 'Mamá de Emma · 6 años',
	},
	{
		id: 'themed-parties',
		quote: 'Las fiestas temáticas son de otro nivel. Nuestro hijo las espera con ansias todo el año.',
		name: 'Miguel Á.',
		context: 'Papá de Thiago · 9 años',
	},
	{
		id: 'custom-event',
		quote: 'El equipo se adaptó a nuestro espacio y creó una experiencia única. Recomendadísimos.',
		name: 'Carolina M.',
		context: 'Mamá de Mateo · 9 años',
	},
	{
		id: 'birthday-animation',
		quote: 'Contratamos la animación para el cumpleaños de Sofía y fue perfecto. Todos los niños se divirtieron.',
		name: 'Laura P.',
		context: 'Mamá de Sofía · 8 años',
	},
];
