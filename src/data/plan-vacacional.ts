export interface VacationPlan {
  name: string;
  date: string;
  hours: string;
  location: string;
  ages: string;
  inclusions: string[];
  activities: string[];
  registrationUrl: string;
  instagramHandle: string;
  instagramUrl: string;
}

export const christmasVacationPlan: VacationPlan = {
  name: "PLAN VACACIONAL - EDICIÓN NAVIDAD",
  date: "Diciembre 14 al 18",
  hours: "8AM - 5 PM",
  location: "Carlos Park",
  ages: "De 4 a 15 años.",
  inclusions: [
    "Franela",
    "Transporte",
    "Almuerzo",
    "Merienda PM",
    "Hidratación",
    "Materiales para actividades",
    "Juegos recreativos",
    "Staff Calificado",
    "Seguridad",
    "Servicio Médico primario",
    "9 horas diarias de diversión por 5 días.",
  ],
  activities: [
    "Paintball hidrogel (para los grandes)",
    "Cuatrimotos",
    "Tirolesa",
    "Rally",
    "Carta de Navidad",
    "Piscina",
    "Gymcanas",
    "Deportes",
    "Manualidades",
    "Competencias",
    "Sorpresas",
  ],
  registrationUrl: "https://cappixtremo.com",
  instagramHandle: "@cappixtremo",
  instagramUrl: "https://instagram.com/cappixtremo",
};
