export interface NavigationLink {
  kind: "link";
  id: string;
  label: string;
  href: string;
}

export interface NavigationSection {
  id: string;
  label: string;
  items: NavigationLink[];
}

export interface NavigationGroup {
  kind: "group";
  id: string;
  label: string;
  sections: NavigationSection[];
}

export type NavigationItem = NavigationLink | NavigationGroup;

/**
 * Shared navigation tree for the desktop mega menu and mobile group disclosures.
 *
 * Group panels intentionally expose section headings and direct links only; the
 * mobile menu does not create another nested dropdown level for these sections.
 */
export const navigation: NavigationItem[] = [
  {
    kind: "group",
    id: "aventuras",
    label: "Aventuras",
    sections: [
      {
        id: "aventuras-planes",
        label: "PLANES VACACIONES",
        items: [
          {
            kind: "link",
            id: "aventuras-navidad",
            label: "PLAN VACACIONAL EDICIÓN NAVIDAD",
            href: "/plan-vacacional",
          },
        ],
      },
    ],
  },
  {
    kind: "group",
    id: "programas-especiales",
    label: "Programas especiales",
    sections: [
      {
        id: "programas-familias",
        label: "FAMILIAS Y GRUPOS",
        items: [
          {
            kind: "link",
            id: "programas-celebra",
            label: "CELEBRA CON CAPPI",
            href: "/celebra-con-cappi",
          },
        ],
      },
      {
        id: "programas-escolares",
        label: "ESCOLARES",
        items: [
          {
            kind: "link",
            id: "programas-experiencias",
            label: "EXPERIENCIAS ESCOLARES",
            href: "/experiencias-escolares",
          },
        ],
      },
      {
        id: "programas-empresas",
        label: "EMPRESAS",
        items: [
          {
            kind: "link",
            id: "programas-corporativos",
            label: "EVENTOS CORPORATIVOS",
            href: "/eventos-corporativos",
          },
        ],
      },
    ],
  },
  {
    kind: "group",
    id: "quienes-somos",
    label: "Quiénes somos",
    sections: [
      {
        id: "quienes-nosotros",
        label: "NOSOTROS",
        items: [
          {
            kind: "link",
            id: "quienes-conocenos",
            label: "CONÓCENOS",
            href: "/quienes-somos",
          },
          {
            kind: "link",
            id: "quienes-staff",
            label: "EL STAFF",
            href: "/nuestro-staff",
          },
          {
            kind: "link",
            id: "quienes-querer-ser-staff",
            label: "QUIERO SER STAFF",
            href: "/quiero-ser-staff",
          },
        ],
      },
    ],
  },
  {
    kind: "link",
    id: "tienda",
    label: "Tienda",
    href: "/tienda",
  },
  {
    kind: "link",
    id: "contacto",
    label: "Contacto",
    href: "/contacto",
  },
];
