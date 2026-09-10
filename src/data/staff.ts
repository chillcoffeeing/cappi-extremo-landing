export interface RecruitmentCopy {
  eyebrow: string;
  title: string;
  intros: string[];
  selectionEyebrow: string;
  selectionIntro: string;
  selectionItems: string[];
  trainingIntro: string;
  trainingItems: string[];
}

export interface StaffProfile {
  name: string;
  role: string;
  bio: string;
  image?: string;
  imageAlt?: string;
}

export const recruitmentCopy: RecruitmentCopy = {
  eyebrow: "EL EQUIPO XTREMO",
  title: "Quienes hacen posible la magia",
  intros: [
    "Detrás de cada Jugada Extrema hay un equipo comprometido con una sola misión: que tu hijo viva días inolvidables en un espacio seguro. Desde la dirección hasta cada facilitador en cancha, todos en Cappi Xtremo compartimos la misma pasión por la niñez, el juego y el bienestar.",
    "Formar parte del equipo Xtremo es formar parte de una comunidad que se prepara y se exige cada temporada, porque sabemos que detrás de cada risa hay una responsabilidad enorme: la confianza de una familia.",
  ],
  selectionEyebrow: "Selección",
  selectionIntro:
    "Buscamos a los mejores para cuidar a los tuyos. Nuestro equipo pasa por un proceso de selección exigente, priorizando personas:",
  selectionItems: [
    "Proactivas y con energía contagiosa",
    "Con liderazgo natural",
    "Creativas",
    "Que disfrutan genuinamente trabajar con niños",
    "Comprometidas y alineadas con nuestros valores",
  ],
  trainingIntro:
    "Antes de cada temporada, todo el equipo se prepara a través de:",
  trainingItems: [
    "Talleres de formación (manejo de grupos, primeros auxilios, dinámicas y juegos)",
    "Jornadas de campo previas a la temporada",
    "Acompañamiento y retroalimentación personalizada durante el plan",
  ],
};

export const staffSelectionItems = [
  "Con energía que se contagia",
  "Que lideran con el ejemplo",
  "Creativas, siempre con una idea nueva bajo la manga",
  "Que aman genuinamente estar con niños",
  "Que viven nuestros valores, no solo los repiten",
];

export const staffPreparationItems = [
  "Talleres de formación (manejo de grupos, primeros auxilios, dinámicas y juegos)",
  "Jornadas de práctica en campo",
  "Acompañamiento cercano durante toda la temporada",
];

export const staffSharedValues = [
  "Apasionadas por el trabajo con niños",
  "Responsables con la seguridad de cada participante",
  "Creativas y llenas de energía",
  "Capaces de sostenerse en equipo, incluso bajo presión",
  "Un reflejo real de lo que representa Cappi Xtremo",
];

export const staffProfiles: StaffProfile[] = [
  {
    name: "Maira Zambrano",
    role: "Directora",
    bio: "Licenciada en Educación, directora de CAPI y fundadora de Vacaciones Extremas Con CAPPI desde 2023.",
  },
  {
    name: "Deymar Oropeza",
    role: "Directora de Recreación (Petrolandía)",
    bio: "Recreadora nacional e internacional con 9+ años de experiencia.",
  },
  {
    name: "Victor Moyetones",
    role: "Recreador",
    bio: "Recreador con 7+ años de experiencia en eventos y planes vacacionales.",
  },
  {
    name: "Valeria Ramos",
    role: "Fisioterapeuta y recreadora",
    bio: "Especialista en primera infancia. 4+ años de experiencia.",
  },
  {
    name: "José Herrera",
    role: "DJ y Productor",
    bio: "A cargo de la musicalización y puesta en escena. 5+ años de experiencia.",
  },
  {
    name: "Annette Zambrano",
    role: "Recreadora",
    bio: "Enfocada en los más pequeños. Estudiante de Fisioterapia. 2 años en el equipo.",
  },
  {
    name: "Sebastian Barbosa",
    role: "Fotógrafo deportivo",
    bio: "Fotógrafo deportivo del equipo.",
  },
  {
    name: "Katiuska Cañizales",
    role: "Especialista en maquillaje artístico y glitter",
    bio: "5+ años de experiencia.",
  },
];
