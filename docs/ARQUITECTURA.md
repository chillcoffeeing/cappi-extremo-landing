# Spec: Arquitectura del Proyecto

Documentación de arquitectura y **patrones para crear componentes y vistas futuras** del landing de Cappi Xtremo. Toda la documentación vive en `/landing/docs`.

- [SISTEMA-DISENO.md](./SISTEMA-DISENO.md) — tokens, tipografía, espaciado, botones y componentes reutilizables.
- [LAYOUT-PRINCIPAL.md](./LAYOUT-PRINCIPAL.md) — Header y Footer (estructura compartida).
- [VISTAS.md](./VISTAS.md) — mapa de páginas existentes y plantillas de vista.
- [ARQUITECTURA.md](./ARQUITECTURA.md) — este documento.

---

## 1. Stack

| Capa        | Tecnología                                                              |
| ----------- | ----------------------------------------------------------------------- |
| Framework   | Astro 7 — salida **`static`** (SSG puro)                                 |
| Estilos     | Tailwind CSS v4 (via `@tailwindcss/vite`) — **tokens CSS-first**        |
| Tipografía  | Poppins (300–700), cargada en `src/layouts/Layout.astro`                |
| UI interactiva | React 19 (islas `@astrojs/react`) — única vía permitida para JSX      |
| Animaciones | `motion` (vanilla `animate` + `inView`) + reveal central `src/scripts/reveal.ts` |
| Carruseles  | Embla Carousel + `embla-carousel-auto-scroll`                           |
| Iconos      | astro-icon + Iconify (set lucide); iconos custom en `src/icons/`; React vía `@iconify/react` |
| Datos       | Módulos TS estáticos (`src/data/`) + objetos en el frontmatter de cada página |

Regla de oro: **todo lo que no necesite interactividad es Astro + Tailwind estático (SSG). Las islas React se reservan para interacción real** (menú móvil, carruseles, lightbox).

---

## 2. Estructura de carpetas

```
src/
├── assets/                       # Imágenes y recursos (importados con ?url / ?raw)
│   ├── cappi-extremo-logo.png
│   ├── gallery/                  # fotos por categoría (motos-*, fiesta-*, juegos-*, …)
│   │   └── all/                  # galería completa (horizontal-images/, vertical-images/)
│   ├── icons/                    # iconos custom del proyecto (astro-icon locales)
│   └── videos/                   # vídeo hero
├── components/
│   ├── astro/                    # componentes estáticos genéricos
│   │   ├── Header.astro          # navbar (desktop dropdown + isla MobileMenu)
│   │   ├── Footer.astro
│   │   ├── SectionPattern.astro  # divisores ondulados full-width
│   │   └── ImageAccent.astro     # franja decorativa para imágenes full view
│   ├── buttons/Button.astro      # botón/link pill (variants: primary|white|outline|link)
│   ├── titles/
│   │   ├── SectionHeading.astro  # eyebrow + h2 + intro (tone light/dark/primary)
│   │   └── UnderlineStroke.astro # subrayado pluma decorativo
│   ├── cta/CtaList.astro         # grupo de botones (default: white sobre foto)
│   ├── date-components/Countdown.astro    # cuenta regresiva vanilla (data-unit)
│   ├── price-components/PriceDisplay.astro
│   ├── react/                    # islas React (SÓLO aquí)
│   │   ├── MobileMenu.tsx        # menú hamburguesa — client:load
│   │   ├── Testimonials.tsx      # carrusel testimonios — client:visible
│   │   └── GalleryCarousel.tsx   # carrusel galería + lightbox — client:visible
│   └── sections/                 # secciones de página (cada una es un componente)
│       ├── hero/      SectionHero.astro · ComingSoonSection.astro
│       ├── cards/     PhilosophySection · ActivitiesSection · StaffSection
│       │              ServicesSection · FeaturesSection
│       ├── cta/       ServicesBand · CtaSection · InclusionsBandSection
│       ├── faq/       FaqSection
│       ├── gallery/   GallerySection (wrap de GalleryCarousel)
│       ├── testimonials/ TestimonialsSection (wrap de Testimonials)
│       ├── schedule/  CountdownSection
│       ├── steps/     StepsSection
│       ├── legal/     LegalSection
│       ├── contact/   ContactSection
│       ├── content/   ContentListSection · SplitContentSection
│       ├── forms/     LeadFormDialog
│       └── staff/     StaffRecruitmentSection · StaffProfilesSection
├── data/
│   ├── eventos-corporativos.ts    # contenido de la vista corporativa
│   ├── experiencias-escolares.ts  # contenido de la vista escolar
│   ├── faqs.ts                    # listas de contenido reutilizables
│   ├── plan-vacacional.ts         # datos del plan Navidad
│   ├── staff.ts                   # copy de recruitment y perfiles
│   └── testimonials.ts
├── layouts/Layout.astro           # shell global (head + Header + main + WhatsApp + Footer)
├── lib/social.ts                  # URLs de contacto/redes
├── lib/lead-links.ts              # destinos de WhatsApp y correo de formularios
├── pages/                         # rutas (ver VISTAS.md)
└── scripts/reveal.ts              # animaciones on-scroll (data-motion)
```

---

## 3. Arquitectura de una página

Todas las páginas siguen el mismo esqueleto:

```astro
---
import Layout from '../layouts/Layout.astro';
import SectionHero from '../components/sections/hero/SectionHero.astro';
// …demás secciones de la vista
import type { MiCard } from '../components/sections/cards/MiSection.astro';

import heroBg from '../assets/gallery/fiesta-3.jpg?url';

const cards: MiCard[] = [ /* datos estáticos en el frontmatter */ ];
---

<Layout title="Mi página - Cappi Extremo" description="Meta description…">
	<SectionHero
		bgImage={heroBg}
		eyebrow="Cappi "
		eyebrowHighlight="Xtremo"
		title="…"
		highlight="…"
		titleAfter="…"
		disfuminar="bottom"
	/>
	<MiSection … />
	<SectionPattern top="base-pattern" />
	<Banda />
	<SectionPattern bottom="base-pattern" />
	<CtaSection … />
</Layout>
```

### 3.1 Reglas del frontmatter

- **Datos en el frontmatter, no en la vista**: se declaran `interface Props`, se importan los `type` de los componentes y se construyen los arrays (cards, items, sesiones) arriba del markup.
- Imágenes: `import img from '../assets/…/foto.jpg?url'` para background/`<img>` simple; **`astro:assets` `<Image>`** (`import { Image } from 'astro:assets'`) para imágenes optimizadas (planes, servicios, programas).
- Galería masiva: `import.meta.glob('../assets/gallery/all/**/*.{jpg,jpeg,png,webp,avif,gif}', { eager: true, query: '?url', import: 'default' })` (patrón usado en `planes-vacacionales.astro` y `programas-especiales.astro`).

### 3.2 Anatomía de una sección/vista

Cada `<section>` vive en `components/sections/<dominio>/` y,

1. **Recibe sus datos por props** (`Astro.props`), tipados con `export interface Props`.
2. Si los datos son listas, declara un `export interface MiItem` para poder tiparlos desde la página.
3. Usa `SectionHeading` para encabezados (nunca escribir el h2 manualmente en la vista, salvo casos especiales como `ComingSoonSection`, `LegalSection` o el título del countdown).
4. Los items se marcan `data-motion="fade-up"`.
5. Se renderiza con el wrapper de colores correcto (ver Patrones de sección abajo).

---

## 4. Patrones de sección

### A. Fondo blanco / contenido estándar

```astro
<section class="py-12 md:py-20">
	<div class="container">
		<SectionHeading eyebrow="Mi eyebrow" title="Mi " underline="título" intro="Intro…" />
		{/* grid o contenido */}
	</div>
</section>
```

Padding estándar: `py-12 md:py-20`; variante amplia: `py-16 md:py-24` (usar prop `padding="large"` cuando el componente la exponga).

### B. Banda de color full-bleed (`bg-sections`)

```astro
<SectionPattern top="base-pattern" />
<section class="relative z-10 isolate bg-sections py-16 md:py-24">
	<div class="container">
		<SectionHeading … tone="dark" />
		…
	</div>
</section>
<SectionPattern bottom="base-pattern" />
```

- `relative z-10 isolate` es **obligatorio**: deja los patrones ondulados **detrás** de la banda (las ondas emergen desde debajo).
- El eyebrow y los underlines sobre banda usan `tone="dark"` (texto `text-primary`, contenidos `text-neutral-600/900`).

### C. Fondo fotográfico oscurecido (hero / CTA final)

`SectionHero` (banda de 680px, `h-[680px]`) y `CtaSection variant="image"` son los dos usos canónicos. La imagen de fondo va `brightness-50` + `disfuminar` (`diffuminar-bottom`/`top`) hacia la sección siguiente. Texto y botones en claro (blanco permitido sobre overlay fotográfico).

### D. Banda de información simple (`bg-sections`)

```astro
<section class="relative isolate bg-sections">
	<div class="container py-16 md:py-24">…</div>
	<SectionPattern top="base-pattern" />
</section>
```

Banda de color estándar para información agrupada (ver `ServicesBand` e `InclusionsBandSection`). Usa tarjetas blancas con borde neutro y sombra sutil para separar cada dato sin introducir fondos temáticos adicionales.

---

## 5. Hidratación y JS (muy importante)

| Caso                          | Implementación                        | Hidratación     |
| ----------------------------- | ------------------------------------- | --------------- |
| Menú móvil / dropdowns        | isla React (`components/react/`)      | `client:load`   |
| Testimonios (carrusel inf.)   | isla React + Embla auto-scroll        | `client:visible`|
| Galería (carrusel + lightbox) | isla React + Embla + `motion`         | `client:visible`|
| Cuenta regresiva              | `<script>` vanilla inline (`data-unit`, `data-target`) | — |
| Dropdown "Más" del header     | `<script>` vanilla inline (`data-dropdown-*`)         | — |
| Preselección asunto contacto  | `<script>` vanilla inline (lee `?asunto=`)            | — |
| FAQ                           | `<details>/<summary>` nativos        | —                |
| Animaciones reveal            | `motion` vanilla (`src/scripts/reveal.ts`, `data-motion`) | — |
| Resto                         | HTML estático puro                    | —                |

Reglas:

1. **Una isla React por pieza interactiva**, en `components/react/`. El componenten `.astro` correspondiente (ej. `GallerySection`, `TestimonialsSection`) es el **wrapper**: recibe props tipadas, arma el heading y monta la isla con `client:visible`.
2. Los `<script>` vanilla de un componente Astro se colocan **al final del propio archivo** y quedan aislados por Astro en build.
3. `prefers-reduced-motion: reduce` desactiva reveals (ver SISTEMA-DISENO §Animaciones).
4. Iconos: en Astro `<Icon name="lucide:..." />` (astro-icon) o nombre local (`src/icons/`); en React `<Icon icon="lucide:..." />` (`@iconify/react`). No inyectar iconos por `?raw`.

---

## 6. Cómo crear un componente de sección nuevo

1. **Decidir el patrón** (A blanco / B banda `bg-sections` / C foto) — ver §4.
2. Crear `src/components/sections/<dominio>/<Nombre>Section.astro` con:
   - `export interface Props` y types exportados para los items.
   - `SectionHeading` para el encabezado.
   - `data-motion="fade-up"` en los elementos visibles.
   - Prop `padding` (`default` = `py-12 md:py-20`, `large` = `py-16 md:py-24`) si aplica.
3. Usar `Button`, `CtaList`, `ImageAccent`, `SectionPattern`, `PriceDisplay`, `Countdown` cuando corresponda (catálogo en SISTEMA-DISENO).
4. Si requiere interactividad, montar una isla React en `components/react/` y envolverla aquí.
5. Consumirla en una página pasando los datos desde el frontmatter.

> Plantilla mínima:
```astro
---
import SectionHeading from '../../titles/SectionHeading.astro';

export interface Props {
	eyebrow?: string;
	title: string;
	underline?: string;
	items: string[];
	padding?: 'default' | 'large';
}

const { eyebrow, title, underline, items, padding = 'default' } = Astro.props;
const paddingClass = padding === 'large' ? 'py-16 md:py-24' : 'py-12 md:py-20';
---

<section class={paddingClass}>
	<div class="container">
		<SectionHeading eyebrow={eyebrow} title={title} underline={underline} />
		<ul class="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
			{items.map((item) => (
				<li data-motion="fade-up" class="rounded-2xl border border-neutral-200 p-6 shadow-sm">{item}</li>
			))}
		</ul>
	</div>
</section>
```

---

## 7. Cómo crear una vista nueva

1. Crear `src/pages/<ruta>.astro` con la arquitectura del §3.
2. **Añadir al menú** en `src/components/astro/Header.astro`:
   - Insertar el link en `navLinks` (esto alimenta móvil + desktop).
   - El nav desktop separa visualmente: los 4 primeros (`navLinks.slice(0, 4)`) van como links planos y el resto caen dentro del dropdown **"Más"** (`navLinks.slice(4)`). Ajustar los slices si cambia el orden.
3. **Añadir al footer** en `src/components/astro/Footer.astro` (fila de links legales).
4. Definir `title` y `description` en `<Layout>` (formato `"Título - Cappi Extremo"`).
5. Reutilizar `SectionHero` para el encabezado de página (unificado en todas las vistas).
6. Cerrar la vista con `CtaSection` (variant `image` sobre foto, o `light`) para el CTA final.

---

## 8. Datos e imágenes

- **Contenido recurrente** en `src/data/`: `faqs.ts`, `testimonials.ts`. Añadir nuevos módulos aquí si una lista se usa en más de una vista.
- **URLs sociales** SOLO en `src/lib/social.ts` (`WHATSAPP_URL`, `EMAIL_URL`, `INSTAGRAM_URL`, `FACEBOOK_URL`). Nunca hardcodear números/correos en componentes.
- **Imágenes**:
  - `?url` → `src` para `<img>` y fondos.
  - `?raw` → contenido crudo (solo para SVGs decorativos si hace falta).
  - `astro:assets <Image>` → imágenes optimizadas con dimensiones explícitas (`width`, `height`, `loading="lazy"`); requiere importar `ImageMetadata` para tipar props.