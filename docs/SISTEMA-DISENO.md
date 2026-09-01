# Spec: Sistema de Diseño — Landing

Documentación de estilo del landing. Toda la documentación del landing vive en `/landing/docs`.

Stack: Astro 7 (SSG) + Tailwind CSS v4. Los tokens de diseño se declaran como variables CSS en `src/styles/global.css` bajo la directiva `@theme` (metodología nativa de Tailwind v4): cada variable genera automáticamente sus utilidades (`--color-primary` → `bg-primary`, `text-primary`, `border-primary`, etc.).

**Librería de iconos**: Tabler Icons (ISC). Todos los iconos se almacenan como archivos SVG en `src/assets/ui/` (optimizados por Vite en build). Se importan directamente en los componentes — en Astro vía import normal, en React vía `?raw` para renderizado inline. Nunca se instala el paquete npm; los SVGs se copian manualmente desde el repo de Tabler.

---

## 1. Colores

| Token                   | Valor     | Variable CSS                   | Uso                                                                |
| ----------------------- | --------- | ------------------------------ | ------------------------------------------------------------------ |
| Primario                | `#F7A721` | `--color-primary`              | CTAs principales, acento de marca, elementos destacados            |
| Primario (foreground)   | `#000000` | `--color-primary-foreground`   | Texto/iconos sobre fondos primarios                                |
| Secundario              | `#04BEE4` | `--color-secondary`            | Enlaces, bloques informativos, iconografía de apoyo                |
| Secundario (foreground) | `#FFFFFF` | `--color-secondary-foreground` | Texto/iconos sobre fondos secundarios                              |
| Terciario               | `#97D84E` | `--color-tertiary`             | Solo decoración: subrayados de texto, `::after`, detalles visuales |

Uso en clases:

```html
<button class="bg-primary text-primary-foreground">CTA principal</button>
<a class="text-secondary hover:text-secondary/80">Enlace</a>
<a class="bg-secondary text-secondary-foreground">Botón informativo</a>
<h2 class="underline decoration-tertiary decoration-4 underline-offset-4">
  Título subrayado
</h2>
```

Reglas:

- Los modificadores de opacidad funcionan con cualquier token: `bg-primary/10`, `text-secondary/70`.
- Foregrounds siempre tokenizados: sobre `bg-primary` usar `text-primary-foreground`; sobre `bg-secondary` usar `text-secondary-foreground`. Nunca `text-black`/`text-white` crudos sobre fondos de marca.
- Terciario NUNCA como fondo (`bg-tertiary`) ni como color de texto de contenido: únicamente elementos decorativos (`after:bg-tertiary`, `decoration-tertiary`).
- Accesibilidad: los tres colores son claros; no usarlos como texto pequeño sobre fondo blanco (contraste insuficiente). Como texto solo sobre fondos oscuros o en tamaños grandes; como fondo, combinar con su foreground tokenizado.
- Prohibido hardcodear hex en clases arbitrarias (`bg-[#F7A721]` ❌) cuando existe el token.

---

## 2. Tipografía

Fuente única: **Poppins**, del peso light (300) al bold (700), cargada en `src/layouts/Layout.astro` vía Google Fonts con `preconnect` + `display=swap` (precarga temprana de la conexión antes del render).

| Peso | Nombre   | Clase Tailwind  |
| ---- | -------- | --------------- |
| 300  | Light    | `font-light`    |
| 400  | Regular  | `font-normal`   |
| 500  | Medium   | `font-medium`   |
| 600  | SemiBold | `font-semibold` |
| 700  | Bold     | `font-bold`     |

`--font-sans` se redefine con Poppins en `@theme`, por lo que es la fuente por defecto de todo el sitio (el preflight de Tailwind la aplica a `<html>`). No hace falta poner `font-sans` manualmente.

### Escala tipográfica responsive (móvil → desktop)

Criterio introducido en el hero y aplicado a todo el sitio: **en móvil los tamaños son más
contenidos; en `md:` (≥768px) escalan hacia arriba**. Siempre se define primero el tamaño
base (móvil) y luego el `md:` (desktop). No se usan breakpoints intermedios (`sm:`) para la
tipografía de títulos, salvo en contadores numéricos.

El hero (`src/pages/index.astro`) es la implementación de referencia de este patrón.

| Nivel                    | Móvil (base)       | Desktop (`md:`)                         | Peso / extra                                         |
| ------------------------ | ------------------ | --------------------------------------- | ---------------------------------------------------- |
| H1 (solo hero)           | `text-3xl` (30px)  | `md:text-5xl` (48px)                    | `font-bold tracking-tight` · `text-white` sobre foto |
| H2 (título de sección)   | `text-3xl` (30px)  | `md:text-[40px]` (40px)                 | `font-semibold` · `md:leading-tight`                 |
| H3 (ítem filosofía)      | `text-lg` (18px)   | `md:text-xl` (20px)                     | `font-medium`                                        |
| H3 (título countdown)    | `text-3xl` (30px)  | (igual)                                 | `font-semibold uppercase tracking-tight`             |
| H4 (tarjeta de servicio) | `text-xl` (20px)   | `md:text-2xl` (24px)                    | `font-semibold uppercase tracking-wide`              |
| Eyebrow (hero)           | `text-lg` (18px)   | `md:text-xl` (20px)                     | `font-semibold uppercase tracking-wide`              |
| Eyebrow (sección)        | `text-sm` (14px)   | `md:text-base` (16px)                   | `font-semibold uppercase tracking-widest`            |
| Subtítulo / p secundario | `text-sm` (14px)   | `md:text-base` (16px)                   | `font-normal leading-relaxed`                        |
| Body / p intro           | `text-base` (16px) | (igual)                                 | `font-normal leading-relaxed`                        |
| Caption / meta           | `text-xs` (12px)   | `md:text-sm` (14px)                     | `font-light` / `font-medium`                         |
| Botón grande             | `text-base` (16px) | (igual, `font-medium md:font-semibold`) | pill `rounded-full`                                  |
| Botón base / compacto    | `text-sm` (14px)   | (igual)                                 | `font-semibold`                                      |

> Nota de migración: el hero ya implementa todas las clases responsivas de la tabla. El
> resto de secciones debe seguir el mismo patrón (`md:` en cada nivel); donde el markup
> actual solo declara el tamaño móvil, añadir el paso `md:` correspondiente.

---

## 3. Layout y contenedor

Todo el contenido vive dentro de un contenedor centrado de **máximo `max-w-7xl`** (80rem = 1280px, el paso mayor de la escala estándar de Tailwind). No se extiende la escala de contenedores con medidas custom.

Patrón estándar de sección (obligatorio en todo el sitio):

```astro
<section class="container">
	<!-- contenido -->
</section>
```

Reglas:

- `max-w-7xl` siempre con `mx-auto`.
- Padding lateral responsivo estándar: `px-4 sm:px-6 lg:px-8`.
- Los fondos full-bleed (bandas de color, gradientes) van en el `<section>` exterior; el contenido siempre dentro del contenedor interior.

---

## 4. Espaciado y ritmo

Solo escala estándar de Tailwind (base 4px). Nunca valores arbitrarios (`p-[13px]` ❌): siempre existe el paso de escala correcto.

| Caso                           | Utilidades       |
| ------------------------------ | ---------------- |
| Ritmo vertical entre secciones | `py-12 md:py-20` |
| Gap compacto                   | `gap-4`          |
| Gap en grids/listas            | `gap-6`          |
| Gap entre bloques grandes      | `gap-8`          |
| Título → contenido             | `mt-4` / `mt-6`  |

---

## 5. Botones, radios y sombras

### Botones

Todo botón o link **con fondo** (sólido u outline, sea `<button>` o `<a>`) lleva **bordes completamente redondeados**: siempre `rounded-full`, nunca `rounded-lg`.

| Variante            | Clases                                                                                                                                                                                        |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primario (sólido)   | `inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90`                             |
| Secundario (sólido) | `inline-flex items-center justify-center rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/90`                       |
| Outline             | `inline-flex items-center justify-center rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-800 transition-colors hover:border-primary hover:text-primary` |

- Tamaños: default `px-5 py-2.5 text-sm`; compacto `px-3 py-1.5 text-xs`; grande (hero) `px-6 py-3 text-base`.
- Con icono: añadir `gap-2` e icono `size-4`.
- **El estilo de botón es opt-in**: ningún link o botón recibe fondo/borde/padding de botón salvo que una spec lo especifique explícitamente. Por defecto, los links son solo texto (`text-secondary`, `text-neutral-700 hover:text-primary`) y los controles de UI (hamburguesas, cierres) son iconos sin fondo persistente.

### Radios y sombras

| Elemento                                                | Utilidades                                 |
| ------------------------------------------------------- | ------------------------------------------ |
| Inputs                                                  | `rounded-lg`                               |
| Tarjetas de contenido (galería, servicios, testimonios) | `shadow-sm` — **sin radio**, bordes rectos |
| Badges / chips                                          | `rounded-full`                             |
| Modales / dropdowns                                     | `rounded-2xl shadow-xl`                    |

Elevar solo hasta `shadow-md` en tarjetas interactivas (hover); nada más fuerte salvo overlays.

---

## 6. Reglas generales

1. Siempre usar tokens (`bg-primary`) en vez de valores crudos.
2. Medidas: primera opción utilidad estándar de Tailwind; extender `@theme` únicamente si Tailwind no tiene el paso equivalente.
3. Nuevos tokens se definen SOLO en `src/styles/global.css` bajo `@theme`, nunca inline en componentes.
4. Botones/links con fondo: siempre `rounded-full` (ver sección 5); el estilo de botón es opt-in y requiere respaldo en spec.
5. Cualquier cambio de estilo se refleja primero en este documento.

---

## 7. Subrayado pluma (componente reutilizable)

Trazo curvo a mano (decoración terciaria) que subraya cualquier palabra o frase dentro de un título. Implementado como componente Astro: `src/components/astro/UnderlineStroke.astro`. El span contenedor lleva `whitespace-nowrap`, así el subrayado nunca se parte entre líneas.

```astro
---
import UnderlineStroke from '../components/astro/UnderlineStroke.astro';
---

<h2>Nuestra <UnderlineStroke>filosofía</UnderlineStroke></h2>
```

| Prop          | Default         | Descripción                                                                                                                                                  |
| ------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `color`       | `text-tertiary` | Clase de color del trazo (usa `currentColor`; ej. `text-primary`)                                                                                            |
| `height`      | `h-2.5`         | Altura del trazo                                                                                                                                             |
| `bottom`      | `-bottom-2`     | Posición vertical del trazo respecto al texto                                                                                                                |
| `strokeWidth` | `5`             | Grosor en px — queda fijo gracias a `vector-effect="non-scaling-stroke"`, sin importar cuánto se estire el SVG (`preserveAspectRatio="none"`)                |
| `nowrap`      | `true`          | `whitespace-nowrap` en el span; desactivar (`nowrap={false}`) en títulos largos que puedan necesitar 2 líneas en móvil (el trazo queda bajo la última línea) |
| `class`       | —               | Clases extra para el span contenedor                                                                                                                         |

Reglas:

- Es decoración pura: el SVG va `aria-hidden` y no debe envolver contenido semántico aparte del propio slot.
- Grosor mínimo recomendado: 4px. Color por defecto terciario; otros acentos (p. ej. primario) solo sobre fondos donde haya contraste suficiente.

---

## 8. Patrones ondulados de sección (componente reutilizable)

Divisores ondulados full-width (`/assets/ui/*-pattern.svg`) para transiciones suaves entre secciones, implementados en `src/components/astro/SectionPattern.astro`. El componente **envuelve el `<section>`**: si se especifica `top`, inyecta el SVG **antes** del section; si se especifica `bottom`, **después**.

```astro
---
import SectionPattern from '../components/astro/SectionPattern.astro';
---

<SectionPattern top>
	<section class="bg-sections">…</section>
</SectionPattern>
```

| Prop     | Valores                                      | Posición del SVG        |
| -------- | -------------------------------------------- | ----------------------- |
| `top`    | `true` (default: "flip"), `"fade"`           | antes del `<section>`   |
| `bottom` | `true` (default: "base"), `"flip"`, `"fade"` | después del `<section>` |

Variantes de orientación del patrón `primary-translucent.svg`:

| Variante | Forma                                     | Uso                |
| -------- | ----------------------------------------- | ------------------ |
| `base`   | onda arriba, relleno abajo                | cierra una sección |
| `flip`   | onda abajo, relleno arriba                | abre una sección   |
| `fade`   | degradado horizontal transparente → color | salida del hero    |

Detalles:

- Los SVG escalan proporcionalmente (`block h-auto w-full`); son decorativos (`alt=""` + `aria-hidden`) y con `loading="lazy"`.
- `-mb-1` / `-mt-1` eliminan la costura de subpíxel entre el patrón y el section.
- Combinables: un section puede llevar `top` y `bottom` a la vez.
- El componente también puede usarse **standalone** (sin envolver), como llamada vacía justo antes/después del `<section>`: `<SectionPattern top />`.

---

## 9. Franja de imagen full view (componente reutilizable)

Acento decorativo para imágenes a ancho completo (ej. foto del equipo): una franja de **poco más de la mitad del ancho total** (`w-[55%]`) y altura fija **`h-8`**, pegada arriba o debajo de la imagen. Implementado en `src/components/astro/ImageAccent.astro`; el componente **envuelve al `<img>`**:

```astro
---
import ImageAccent from '../components/astro/ImageAccent.astro';
---

<ImageAccent color="primary" position="bottom" align="right">
	<img src="…" class="mt-14 h-[480px] w-full object-cover md:h-[850px]" />
</ImageAccent>
```

| Prop       | Valores                                         | Default   |
| ---------- | ----------------------------------------------- | --------- |
| `color`    | `primary` · `secondary` · `tertiary`            | `primary` |
| `position` | `top` (antes de la imagen) · `bottom` (después) | `bottom`  |
| `align`    | `left` · `right`                                | `left`    |

Notas:

- La franja queda **pegada** al borde de la imagen indicado; el espaciado respecto al contenido anterior va en el `<img>` (ej. `mt-14`).
- Alineación vía `flex justify-start/end`, así que respeta el ancho del contenedor donde viva la imagen.
- Decorativa: `aria-hidden="true"`.
- Terciario permitido aquí por ser decoración pura (no fondo de contenido).

---

## 10. Animaciones de aparición

Reveals on-scroll con **Motion** en versión vanilla (`motion` — `animate` + `inView`, sin React). Lógica centralizada en `src/scripts/reveal.ts`, cargada desde `Layout.astro`; los elementos se marcan con `data-motion`.

| Valor `data-motion`            | Elemento                           | Animación                                                                             |
| ------------------------------ | ---------------------------------- | ------------------------------------------------------------------------------------- |
| `fade-up`                      | títulos, párrafos e items de grids | opacity 0→1 + translateY 28px→0, stagger automático entre hermanos (+80ms, máx 400ms) |
| `pattern-top`                  | SectionPattern en `top`            | emerge desde detrás del section hacia arriba (translateY 70%→0)                       |
| `pattern-bottom`               | SectionPattern en `bottom`         | emerge desde detrás del section hacia abajo (translateY -70%→0)                       |
| `accent-left` / `accent-right` | franja ImageAccent                 | wipe scaleX 0→1 desde su lado de alineación                                           |

Subrayados (`UnderlineStroke`): el SVG lleva `data-motion-underline` y se **dibuja como trazo** (stroke-dasharray/dashoffset con `getTotalLength()`), de izquierda a derecha.

Reglas:

- **Progressive enhancement**: `<html class="js">` se agrega inline en `<head>`; `[data-motion] { opacity: 0 }` solo aplica bajo `html.js` — sin JS, todo es visible.
- **Accesibilidad**: con `prefers-reduced-motion: reduce` no se inicializa ninguna animación y los elementos quedan visibles.
- Cada animación corre **una sola vez** al entrar en viewport (`inView` + stop).
- El hero queda estático a propósito (LCP).
- **Stacking**: durante la animación, el transform del patrón crea contexto de apilamiento y lo pintaría por encima de las secciones estáticas vecinas. Toda sección contigua a un patrón lleva `relative z-10` para que la onda emerja **desde detrás** de ella (hero, banda primario y banda secundario en la Home).
- **Punto de disparo**: las animaciones se activan cuando el elemento llega al **5% de altura desde abajo** del viewport (`inView` con `margin: "0px 0px -5% 0px"`, root reducido a los 95% superiores). Antes se disparaban cerca del borde inferior.

---

## 12. Fondo de madera clara (decoración de sección)

Nuevo tipo de fondo de sección: **madera clara/marrón** con vetas (tablones verticales). Implementado
como utilidad `.bg-wood` en `src/styles/global.css` (color base `--color-wood: #c9a36b` + dos
`repeating-linear-gradient` que simulan tablones y costuras). No es un componente: se aplica como
clase al `<section>`.

Reglas:

- Color base declarado como token `--color-wood` en `@theme` (sigue la regla de no hardcodear hex suelto).
- Se usa como fondo de sección completa (`relative isolate bg-wood`); el contenido va en el contenedor interior.
- Capas del fondo (de arriba abajo): (1) **vetas curvas** en SVG (`<path>` con curvas Bézier, color `%239a7440` a 22% de opacidad, repetidas) que simulan las vetas de madera; (2) costuras finas entre tablones; (3) tablones verticales alternando `#ddcaa6` / `#cbb78f`.
- Las vetas **no** usan `clip-path: path()` porque ese recorte trabaja con coordenadas fijas en píxeles y no escala al ancho responsive del sitio; se prefiere el SVG de fondo repetido, que sí es fluido.
- Los textos sobre madera usan `text-neutral-900` (contraste suficiente sobre el marrón claro).
- Combinable con tarjetas de colores (primario / secundario / terciario / madera) para ítems visuales.
- No confundir con los fondos de marca (`bg-primary` / `bg-secondary`): la madera es un fondo temático aparte.

---

## 11. Secciones con fondo de color

Las secciones que requieren un fondo de color utilzan la clase `bg-sections` que aplica el color
`#E8FCFC`. Los trazos decorativos (subrayados, patrones SVG) usan los colores primario (`#008080`)
o secundario (`#ff7f50`). Los enlaces de texto clicable van en color primario.
