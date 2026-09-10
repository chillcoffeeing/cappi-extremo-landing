# Spec: Sistema de Diseño — Landing

Documentación de estilo del landing. Toda la documentación del proyecto vive en `/landing/docs`.

Stack: Astro 7 (SSG) + Tailwind CSS v4. Los tokens se declaran como variables CSS en `src/styles/global.css` bajo la directiva `@theme`: cada variable genera automáticamente sus utilidades (`--color-primary` → `bg-primary`, `text-primary`, `border-primary`, etc.). No existe `tailwind.config`; el tema es CSS-first.

**Librería de iconos**: astro-icon + Iconify (set **lucide**, vía `@iconify-json/lucide`). En componentes/páginas Astro se usa `import { Icon } from "astro-icon/components"` con `<Icon name="lucide:foo" />`; los iconos custom del proyecto viven en `src/icons/` y se referencian solo por su nombre (`<Icon name="flag" />`). En islas React se usa `@iconify/react` (`<Icon icon="lucide:foo" />`). Regla: nunca hardcodear `<svg>` para iconos de UI; los SVGs decorativos (`SectionPattern`, `UnderlineStroke`) sí son manuales.

---

## 1. Colores

| Token                   | Valor        | Variable CSS                   | Uso                                                        |
| ----------------------- | ------------ | ------------------------------ | ---------------------------------------------------------- |
| Primario                | `#008080`    | `--color-primary`              | CTAs, links de texto, acentos, eyebrows, underlines        |
| Primario (foreground)   | `#ffffff`    | `--color-primary-foreground`   | Texto/iconos sobre `bg-primary`                            |
| Secundario              | `#ff7f50`    | `--color-secondary`            | Acentos secundarios, bloques informativos                  |
| Secundario (foreground) | `#ffffff`    | `--color-secondary-foreground` | Texto/iconos sobre `bg-secondary`                          |
| Terciario               | `#bcf67b75`  | `--color-tertiary`             | SOLO decoración: franjas, subrayados, detalle (translúcido) |
| Sections                | `#e8fcfc`    | `--color-sections`             | Fondo de bandas/paneles (`bg-sections`)                    |
| Tipografía              | `"Poppins"`  | `--font-sans`                  | Fuente por defecto de todo el sitio                        |

Uso en clases:

```html
<button class="bg-primary text-primary-foreground">CTA principal</button>
<a class="text-primary hover:text-primary/80">Enlace</a>
<p class="bg-sections">Banda de sección</p>
```

Reglas:

- Los modificadores de opacidad funcionan con cualquier token: `bg-primary/10`, `text-secondary/70`.
- Foregrounds siempre tokenizados sobre fondos de marca: `text-primary-foreground` sobre `bg-primary`, `text-secondary-foreground` sobre `bg-secondary`. Nunca `text-black`/`text-white` crudos sobre fondos de marca.
- `tertiary` NUNCA como fondo de contenido ni como texto: solo decoración (`ImageAccent`, backdrops, detalles). Es translúcido; no sirve para texto.
- `bg-sections` es el fondo estándar de bandas (FAQ, sesiones, precio, servicios, countdown).
- Prohibido hardcodear hex en clases arbitrarias (`bg-[#008080]` ❌) cuando existe el token. Única excepción admitida: verde de WhatsApp (`bg-[#25D366]`, botón flotante en `Layout.astro`).
- Sobre `bg-sections` los textos de contenido van `text-neutral-900` o `text-neutral-600` según su jerarquía.

---

## 2. Tipografía

Fuente única: **Poppins**, del peso 300 al 700, cargada en `src/layouts/Layout.astro` vía Google Fonts (`preconnect` + `display=swap`). `--font-sans` se redefine con Poppins en `@theme`, así que es la fuente por defecto (no hace falta `font-sans` manual).

### Escala tipográfica base (definida en `global.css` `@layer base`)

Tamaños base (móvil) y aumento +20% desde `md:` (≥768px) vía media query. Los headings heredan de estos valores; las secciones pueden sobre-escribir con utilidades Tailwind cuando la spec lo pida (ej. countdown).

| Elemento | Móvil (base)      | Desktop (`md:`)  | Line-height |
| -------- | ----------------- | ---------------- | ----------- |
| `p`      | 14px              | 16.8px           | 1.65        |
| `h1`     | 40px              | 48px             | 1.15        |
| `h2`     | 28px              | 33.6px           | 1.2         |
| `h3`     | 20px              | 24px             | 1.35        |
| `h4`     | 16px              | 19.2px           | 1.4         |

### Eyebrow automático

`section > p:first-child` recibe automáticamente estilo de eyebrow (primary, semibold, uppercase, letter-spacing). Para eyebrows en secciones se prefiere el prop `eyebrow` de `SectionHeading`; este CSS actúa como red de seguridad en secciones legales/simples.

### Jerarquía en componentes

Los títulos de sección se generan con `SectionHeading` (h2) y el subrayado opcional con `UnderlineStroke`. Los pesos: títulos `font-semibold`, títulos grandes del hero `font-bold`, body `font-normal`. Regla general de espaciado: `SectionHeading` deja `mt-3` entre eyebrow y título y el intro a `mt-4`.

---

## 3. Contenedor

Todo el contenido vive en un contenedor de **máximo 1280px**. La utilidad `container` está definida en `global.css` (`max-width: 1280px`, `margin-inline: auto`, `padding-inline: theme(spacing.2)`).

```astro
<section class="py-12 md:py-20">
	<div class="container">…</div>
</section>
```

Los fondos full-bleed (bandas `bg-sections` y fotos) van en el `<section>` exterior; el contenido siempre dentro del contenedor interior. En secciones custom que no usan `container` se replica con `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`.

---

## 4. Espaciado y ritmo

Solo escala estándar de Tailwind (base 4px). Nunca valores arbitrarios (`p-[13px]` ❌).

| Caso                               | Utilidades       |
| ---------------------------------- | ---------------- |
| Ritmo vertical entre secciones     | `py-12 md:py-20` |
| Ritmo amplio (bandas, galería)     | `py-16 md:py-24` |
| Gap compacto                       | `gap-4`           |
| Gap en grids/listas                | `gap-5` / `gap-6` |
| Gap entre bloques grandes          | `gap-8` / `gap-10`|
| Título → contenido                 | `mt-14` (en secciones con heading) |

---

## 5. Botones

Todo botón o link **con fondo** lleva bordes completamente redondeados: **siempre `rounded-full`**, nunca `rounded-lg`.

`src/components/buttons/Button.astro` es el componente único. Props: `label`, `href` (renderiza `<a>`) u opcional sin `href` (renderiza `<button type>`), `variant`, `size`, `linkColor`, `class`, `disabled`, `target`, `rel`, `ariaLabel`.

| Variante  | Estilo                                                                                       | Uso                                           |
| --------- | -------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `primary` | `bg-primary text-primary-foreground hover:bg-primary/90`                                     | CTA principal                                 |
| `white`   | `bg-white text-neutral-900 hover:bg-neutral-100`                                             | CTA sobre fondos fotográficos/oscuros         |
| `outline` | `border border-neutral-300 text-neutral-800 hover:border-primary hover:text-primary`         | Acción secundaria / plan no destacado         |
| `link`    | texto plano uppercase, `linkColor` para el color (default `text-primary`)                    | Enlace con apariencia de texto                |

Tamaños: `default` (`px-8 py-3.5 text-base`) y `sm` (`px-6 py-3 text-base`). Botones deshabilitados: `disabled` → fondo `bg-neutral-300 text-neutral-500` sin hover.

Para grupos de CTAs usar `CtaList` (`ctas: {label, href, variant, linkColor}[]`, `size`, `class`). Default de la variante en `CtaList`: **`white`** (pensado para fondos fotográficos); `CtaSection` y `CountdownSection` lo reasignan a `primary` sobre fondos claros.

> El estilo de botón es opt-in: ningún link recibe fondo excepto por spec. Links de texto: `transition-opacity hover:opacity-70` o `text-primary hover:text-primary/80`.

---

## 6. Radios, bordes y sombras

| Elemento                                                       | Utilidades                          |
| -------------------------------------------------------------- | ----------------------------------- |
| Inputs y selects (formulario contact)                          | `rounded-lg border-neutral-300`     |
| Tarjetas de plan, features, sesiones                           | `rounded-2xl border shadow-sm`      |
| Tarjetas de contenido fotográfico (actividades, servicios)     | `shadow-sm` (bordes rectos)         |
| Tarjetas en banda `bg-sections`                                | `rounded-2xl border border-neutral-200 bg-white shadow-sm` |
| Badges / chips / pills de estado (Disponible, Más popular)     | `rounded-full`                      |
| Dropdown "Más" del header                                      | `rounded-2xl border shadow-lg`      |
| Píldoras del nav y botones                                     | `rounded-full`                      |

Elevar como máximo `shadow-md` en hover de tarjetas interactivas; `shadow-lg` solo overlays/dropdowns; `shadow-2xl` solo en lightbox.

---

## 7. Componentes reutilizables (catálogo)

Carpeta **`components/`**:

| Componente            | Ruta                                            | Resumen de props                                                              |
| --------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------- |
| `SectionHeading`      | `titles/SectionHeading.astro`                   | `eyebrow`, `eyebrowHighlight`, `title` *, `underline`, `underlineColor`, `underlineNowrap`, `tone ('light'|'dark'|'primary')`, `intro`, `introClass`, `titleClass`. Incluye `data-motion="fade-up"`. |
| `UnderlineStroke`     | `titles/UnderlineStroke.astro`                  | `color` (default `text-primary`), `height` (`h-2.5`), `bottom` (`-bottom-2`), `strokeWidth` (5), `nowrap` (true), `class`. SVG con `data-motion-underline`. |
| `Button`              | `buttons/Button.astro`                          | Ver §5.                                                                       |
| `CtaList`             | `cta/CtaList.astro`                             | `ctas` *, `class`, `size`.                                                    |
| `Countdown`           | `date-components/Countdown.astro`               | `id`, `target` (ISO), `size ('hero'|'standard')`, `units`. Script vanilla con `data-unit`/`data-target`. |
| `PriceDisplay`        | `price-components/PriceDisplay.astro`           | `price`, `period`, `style ('large'|'inline')`, `colorClass`, `periodClass`. Soporta `"Próximamente"`. |
| `SectionPattern`      | `astro/SectionPattern.astro`                    | `top`/`bottom` (`'base-pattern'` | `'slow-curve'`), `additionalClasses`. **Se renderiza standalone**, como hermano del `<section>`. |
| `ImageAccent`         | `astro/ImageAccent.astro`                       | `color` (`primary|secondary|tertiary`), `position` (`top|bottom`), `align` (`left|right`). Envuelve al `<img>`; franja decorativa `h-8 w-[55%]`. |
| `SectionHero`         | `sections/hero/SectionHero.astro`               | Ver LAYOUT/VISTAS: `bgImage`, `bgVideo?`, `eyebrow`, `title`, `highlight`, `titleAfter`, `subtitle`, `badge?`, `buttons`, `crumbs?`, `dock?`, `titleMargin?`, `disfuminar`. Altura fija `h-[680px]`. |
| `ComingSoonSection`   | `sections/hero/ComingSoonSection.astro`         | `title`, `description`, `links`. Página "próximamente" (tienda, coming-soon). |
| `FaqSection`          | `sections/faq/FaqSection.astro`                 | `tone ('dark'|'light')`, `eyebrow`, `title`, `underline`, `items`, `padding`. `<details>/<summary>`. |
| `StepsSection`        | `sections/steps/StepsSection.astro`             | `eyebrow`, `title`, `underline`, `steps`, `columns (3|4)`, `cta`. Banda `bg-sections` por defecto. |
| `CtaSection`          | `sections/cta/CtaSection.astro`                 | `variant ('image'|'light'|'dark')`, `bgImage?`, `disfuminar?`, `title`, `underline?`, `titleAfter?`, `intro?`, `buttons`, `padding`. |
| `ContactSection`      | `sections/contact/ContactSection.astro`         | `formTitle?`, `formIntro?`, `channels?`, `schedule`. Select de asunto con opción **"Quiero ser staff"**; preselección por `?asunto=staff`. |

Los wrappers de carrusel (`GallerySection`, `TestimonialsSection`) y bandas (`ServicesBand`, `InclusionsBandSection`, `CountdownSection`, `ServicesSection`, `PhilosophySection`, `ActivitiesSection`, `StaffSection`, `FeaturesSection`, `LegalSection`) se documentan en [VISTAS.md](./VISTAS.md) y en su uso real en las páginas.

---

## 8. Patrones ondulados de sección (`SectionPattern`)

Divisores full-width (`base-pattern` / `slow-curve`) para transiciones suaves. **Se usan standalone** como hermanos del `<section>` (NO envuelven contenido):

```astro
<SectionPattern bottom="base-pattern" />

<section class="relative z-10 isolate bg-sections py-16 md:py-24">…</section>

<SectionPattern top="base-pattern" />
```

| Prop   | Valores                       | Posición del SVG        |
| ------ | ----------------------------- | ----------------------- |
| `top`  | `'base-pattern'` | `'slow-curve'` | antes de la sección |
| `bottom` | `'base-pattern'` | `'slow-curve'` | después de la sección |

- El SVG es decorativo (`aria-hidden`) y anima con `data-motion="pattern-top"` / `"pattern-bottom"` (emerge desde detrás de la sección).
- La sección contigua debe llevar `relative z-10 isolate` para que la onda quede **detrás**.
- `-mb-px` / `-mt-px` eliminan la costura de subpíxel.
- Combinables (`top` + `bottom` en el mismo section).

---

## 9. Franja de imagen full view (`ImageAccent`)

Acento decorativo para imágenes a ancho completo (ej. foto del equipo). Franja de `h-8` y `w-[55%]` pegada arriba o debajo de la imagen.

```astro
<ImageAccent color="tertiary" position="bottom" align="right">
	<img src={img} alt="…" class="mt-14 w-full" />
</ImageAccent>
```

- Alineación vía `flex justify-start/end` → respeta el ancho del contenedor.
- `tertiary` permitido aquí por ser decoración pura.
- Anima con `data-motion="accent-left|accent-right"` (wipe `scaleX(0→1)` desde su lado).

---

## 10. Animaciones de aparición

Reveals on-scroll con **Motion** vanilla. Lógica centralizada en `src/scripts/reveal.ts`, cargada desde `Layout.astro`. Los elementos se marcan con `data-motion`:

| Valor `data-motion`     | Elemento                        | Animación                                                                 |
| ----------------------- | ------------------------------- | ------------------------------------------------------------------------- |
| `fade-up`               | títulos, párrafos, items grid   | opacity 0→1 + `translateY(28px→0)`, stagger automático (+80ms, máx 400ms) |
| `pattern-top`           | `SectionPattern top`            | opacity 0.6→1 + `translateY(-70%→0)`                                      |
| `pattern-bottom`        | `SectionPattern bottom`         | opacity 0.6→1 + `translateY(-70%→0)`                                      |
| `accent-left`/`right`   | franja `ImageAccent`            | `scaleX(0→1)` desde su lado (delay 0.2s)                                  |

Subrayados (`UnderlineStroke`): el SVG lleva `data-motion-underline` y se dibuja con `clip-path: inset(0 100% 0 0) → inset(0 0% 0 0)`.

Reglas:

- **Progressive enhancement**: `<html class="js">` inline en `<head>` (Layout); `html.js [data-motion] { opacity: 0 }` solo bajo `html.js` — sin JS todo es visible.
- `prefers-reduced-motion: reduce` → no corre `reveal.ts`.
- Cada animación corre **una sola vez** (`inView` + stop; `amount: 0.2`, `margin: "0px 0px -5% 0px"`).
- El hero queda estático a propósito (LCP).
- Sections contiguas a patrones: `relative z-10 isolate` (ver §8).

---

## 11. Fondos especiales

### `bg-sections` (bandas de sección y contenido)
Fondo estándar de las bandas de color: `#e8fcfc`. Se usa en `ServicesBand`, `InclusionsBandSection`, `FaqSection` (tone dark), `StepsSection` y `CountdownSection`. Los datos secundarios se presentan en tarjetas `bg-white` con borde `border-neutral-200` y `shadow-sm`; los acentos usan los tokens primary, secondary o tertiary según su función.

### `diffuminar-bottom` / `diffuminar-top`
Máscaras de degradado (`@utility` en `global.css`) para suavizar el borde de fondos fotográficos hacia la siguiente sección (hero y CTA finales): `disfuminar="bottom"` disuelve la parte inferior.

---

## 12. Reglas generales

1. Siempre usar tokens (`bg-primary`) en vez de valores crudos. Hex solo si no existe token y con justificación.
2. Medidas: primera opción utilidad estándar de Tailwind; extender `@theme` únicamente si Tailwind no tiene el paso.
3. Nuevos tokens SOLO en `src/styles/global.css` bajo `@theme`, nunca inline en componentes.
4. Botones/links con fondo: siempre `rounded-full`; el estilo de botón es opt-in.
5. Responsive es requisito: verificar en móvil (360px), `md:` (768px) y `lg:` (1024px).
6. Marks de animación `data-motion` en todo elemento visible nuevo (salvo hero y contenido dentro de islas React).
7. Alt y descripciones accesibles; imágenes decorativas `alt=""` + `aria-hidden`.
8. Cualquier cambio de estilo se refleja primero en este documento.