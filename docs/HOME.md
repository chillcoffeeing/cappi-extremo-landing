# Spec: Home (`/`)

Secciones de la homepage. Este documento es la **fuente de verdad** de la implementación y la **plantilla** para generar las demás vistas.

Tokens y reglas generales en [SISTEMA-DISENO.md](./SISTEMA-DISENO.md); layout compartido (Header/Footer) en [LAYOUT-PRINCIPAL.md](./LAYOUT-PRINCIPAL.md).

---

## Arquitectura de la página

```
index.astro
├── frontmatter: datos estáticos (arrays de cards, FAQs, testimonios, etc.)
├── <Layout>               ← shell global (Header + Footer + reveal.ts)
│   ├── Section 1: Hero         (fondo foto, z-10, sin contenedor interno)
│   ├── <SectionPattern>        (bottom="orange-pattern-fade")
│   ├── Section 2: Filosofía    (fondo blanco)
│   ├── <SectionPattern>        (top="orange-pattern" flipTop)
│   ├── Section 3: Servicios    (fondo primario, z-10)
│   ├── <SectionPattern>        (bottom="orange-pattern")
│   ├── Section 3.1: Jugadas extremas (fondo blanco, grid 3x3 actividades)
│   ├── Section 4: Testimonios  (fondo blanco, isla React client:visible)
│   ├── Section 5: Galería      (fondo blanco, cero JS)
│   ├── Section 6: Staff        (fondo blanco, ImageAccent)
│   ├── <SectionPattern>        (top="blue-pattern" flipTop)
│   ├── Section 7: FAQ          (fondo secundario, z-10, details/summary)
│   └── Section 8: CTA final    (fondo foto, z-10)
└── <script>                ← countdown vanilla inline
```

**Clave**: las secciones con fondo de color/foto llevan `relative z-10 isolate` para que los patrones ondulados queden **detrás** de ellas (effetto de onda emergence). Las secciones de fondo blanco no necesitan z-index.

---

## Patrones reutilizables por sección

Cada sección de la home sigue uno de estos patrones:

### Patrón A: Fondo blanco (secciones 2, 4, 5, 6)

```astro
<section class="py-12 md:py-20">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <!-- contenido centrado -->
  </div>
</section>
```

### Patrón B: Banda de color full-bleed (secciones 3, 7)

```astro
<SectionPattern top="..." flipTop />   <!-- onda de entrada -->
<section class="relative z-10 isolate bg-{color} py-12 md:py-20">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <!-- contenido centrado -->
  </div>
</section>
<SectionPattern bottom="..." />       <!-- onda de salida -->
```

### Patrón C: Fondo fotográfico oscurecido (secciones 1, 8)

```astro
<section class="relative z-10 isolate overflow-hidden">
  <img src="..." alt="" aria-hidden="true" loading="eager|lazy" class="absolute inset-0 -z-10 h-full w-full object-cover" />
  <div class="absolute inset-0 -z-10 bg-neutral-950/70" aria-hidden="true"></div>
  <div class="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
    <div class="flex flex-col items-center text-center">
      <!-- contenido centrado -->
    </div>
  </div>
</section>
```

---

## Encabezados de sección (reutilizar en todas las páginas)

### Eyebrow + h2 (fondo blanco)

```astro
<p data-motion="fade-up" class="text-center text-sm font-semibold uppercase tracking-widest text-primary md:text-base">
  {eyebrow}
</p>
<h2 data-motion="fade-up" class="mt-3 text-center text-3xl font-semibold text-neutral-900 md:text-[40px] md:leading-tight">
  {titulo}
</h2>
```

### Eyebrow + h2 (fondo secundario)

```astro
<p data-motion="fade-up" class="text-center text-sm font-semibold uppercase tracking-widest text-secondary-foreground md:text-base">
  {eyebrow}
</p>
<h2 data-motion="fade-up" class="mt-3 text-center text-3xl font-semibold uppercase text-secondary-foreground md:text-[40px] md:leading-tight">
  <UnderlineStroke color="text-primary" nowrap={false}>{titulo}</UnderlineStroke>
</h2>
```

### Párrafo introductorio

```astro
<p data-motion="fade-up" class="mx-auto mt-4 max-w-[700px] text-center text-base leading-relaxed text-neutral-600">
  {copy}
</p>
```

> Nota: en la sección de servicios el párrafo usa `text-neutral-800` (sobre fondo primario, no blanco).

---

## 1. Hero

Fondo fotográfico oscurecido. Contenido centrado vertical y horizontalmente.

| Aspecto | Valor |
|---------|-------|
| Fondo | `motos-full-view-2.jpg` (`/assets/gallery/`) |
| Overlay | `bg-neutral-950/70` |
| Ritmo | `py-20 md:py-28` |
| Patrón salida | `<SectionPattern bottom="orange-pattern-fade" />` |
| Imagen | `loading="eager"` + `fetchpriority="high"` (LCP) |

### Contenido

| Elemento | Copy | Móvil | Desktop (`md:`) |
|----------|------|-------|----------------|
| p | CAPPI XTREMO | `text-lg font-semibold uppercase tracking-wide` · "Cappi Xtremo" en `<span class="text-primary">` | `md:text-xl` |
| h1 | ¡Las vacaciones más **divertidas** están por comenzar! | `mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white` · "divertidas" en `<span class="text-primary">` | `md:text-5xl` |
| h2 | Deporte, amigos, aventura y risas sin parar... | `mt-6 max-w-2xl text-sm font-normal leading-relaxed text-white` | `md:text-base` |
| Botones | "Ver fechas y plan vacacional" + "Únete ahora" | `mt-8 flex flex-col items-center gap-4 sm:flex-row`; botones `text-base font-medium` | `md:font-semibold` |

### Botones del hero (variante grande)

- **Primario**: `rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90` → `/campamentos`
- **Blanco**: `rounded-full bg-white px-6 py-3 text-base font-semibold text-neutral-900 transition-colors hover:bg-neutral-100` → `#` (placeholder)

> Texto blanco permitido: se apoya sobre overlay fotográfico oscuro.

---

## 2. Nuestra filosofía

Fondo blanco. 4 items con icono en grid responsivo.

| Aspecto | Valor |
|---------|-------|
| Ritmo | `py-12 md:py-20` |
| h2 | "Nuestra" + `<UnderlineStroke>filosofía</UnderlineStroke>` |
| Grid items | `mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4` |
| CTA | `mt-14 flex justify-center` → botón primario grande → `/campamentos` |

### Items (`philosophyItems` en frontmatter)

| # | Icono | h3 | Descripción |
|---|-------|----|-------------|
| 1 | `/assets/ui/flag.svg` | Aventura sin límites | Actividades al aire libre que sacan lo mejor de cada niño. |
| 2 | `/assets/ui/people.svg` | Amistades para toda la vida | Un ambiente donde se hacen amigos de verdad. |
| 3 | `/assets/ui/laugh.svg` | Aprender jugando | Cada actividad enseña algo, sin que se sienta como clase. |
| 4 | `/assets/ui/shield.svg` | Seguridad ante todo | Personal capacitado y protocolos claros en cada momento. |

> Iconos: Tabler Icons (ISC), importados desde `src/assets/ui/` (optimizados por Vite en build).

### Estructura de cada item

```
flex flex-col items-center text-center
├── círculo: flex size-[110px] items-center justify-center rounded-full bg-secondary/50 p-[30px]
│   └── img: importado desde src/assets/ui/ (Tabler outline, Vite-optimizado, loading="lazy")
├── h3: mt-6 text-lg font-medium text-neutral-900
└── p:  mt-2 text-base leading-relaxed text-neutral-600
```

---

## 3. Servicios + cuenta regresiva

Banda primario full-bleed. 3 tarjetas fotográficas + countdown + CTAs.

| Aspecto | Valor |
|---------|-------|
| Fondo | `bg-primary` |
| Ritmo | `py-12 md:py-20` |
| Patrón entrada | `<SectionPattern top="orange-pattern" flipTop />` |
| Patrón salida | `<SectionPattern bottom="orange-pattern" />` |
| z-index | `relative z-10 isolate` |

### Tarjetas de servicios (`serviceCards` en frontmatter)

Grid: `mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3`

Cada tarjeta (`<article>`):
```
relative isolate flex h-[460px] flex-col items-center justify-end overflow-hidden text-center shadow-sm
├── img: absolute inset-0 -z-10 object-cover (hover: group-hover:scale-105 transition-transform duration-500)
├── overlay: absolute inset-0 -z-10 bg-neutral-950/60
└── contenido: flex flex-col items-center gap-5 px-6 pb-10
    ├── h4: text-xl font-semibold uppercase tracking-wide text-white
    └── a: rounded-full bg-white px-5 py-2.5 text-sm font-semibold uppercase text-neutral-900 transition-colors hover:bg-neutral-100
```

| # | Imagen | h4 | CTA href |
|---|--------|----|----------|
| 1 | `motos-full-view-1.jpg` | Planes vacacionales | `/campamentos` |
| 2 | `fiesta-1.jpg` | Fiestas y eventos | `#` |
| 3 | `juegos-1.jpg` | Animación y recreación | `#` |

### Cuenta regresiva

| Elemento | Copy | Clases |
|----------|------|--------|
| h3 | Días hasta que empieza el próximo plan vacacional | `mt-16 md:mt-24 text-center text-3xl font-semibold uppercase tracking-tight text-neutral-900` |
| Contador wrapper | — | `mt-8 flex items-start justify-center gap-6 sm:gap-20` · `role="timer"` · `aria-labelledby="camp-countdown-title"` · `data-target={NEXT_CAMP_START}` |

Unidad: número `text-6xl font-bold tabular-nums tracking-tight text-neutral-900 sm:text-7xl` + etiqueta `mt-2 text-xs font-medium uppercase tracking-widest text-neutral-800 sm:text-sm`.

**Implementación**: script vanilla inline en `<script>` al final del archivo. Usa `data-unit="days|hours|minutes|seconds"` y `data-target` ISO. Renderiza `00` en build, primer tick inmediato, diff negativo clampea a 0.

### CTAs finales

| Elemento | Copy | Clases |
|----------|------|--------|
| CTA | Apartar cupo para mi hijo | `rounded-full bg-white px-6 py-3 text-base font-semibold uppercase tracking-wide text-neutral-900 transition-colors hover:bg-neutral-100` → `/campamentos` |
| Link | Ver detalles del plan vacacional | `text-base font-medium uppercase text-neutral-900 transition-opacity hover:opacity-70` → `/campamentos` |

Envueltos en `mt-10 flex flex-col items-center gap-4`.

---

## 3.1 Jugadas extremas (Actividades)

Fondo blanco. Grid de 9 tarjetas (3×3 en desktop) con foto + franja de color por columna.

| Aspecto | Valor |
|---------|-------|
| Ritmo | `py-12 md:py-20` |
| Eyebrow | "Actividades" · `text-primary` |
| h2 | "Jugadas extremas" |
| p intro | `max-w-[700px]` · `text-neutral-600` |
| Grid | `mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3` |

Cada tarjeta (`<article>`):

```
overflow-hidden shadow-sm
├── img: h-40 w-full object-cover (loading="lazy", alt={title})
└── div franja: flex h-[70px] items-center justify-center px-3 text-center text-sm font-semibold uppercase tracking-wide text-white
    └── style background-color por columna
```

Franjas de color según columna (lectura de izquierda → derecha, fila por fila):

| Columna | Color | Aplica a (posiciones 1,4,7 / 2,5,8 / 3,6,9) |
|---------|-------|----------------------------------------------|
| 1 | `#805611` | Pádel Fest · Deportes · VAR ritmo |
| 2 | `#59802E` | Paseo a caballo · Spa · Planetario |
| 3 | `#026A80` | Acuático · Rally barro · Rústicos |

Datos (`activitiesCards` en frontmatter): 9 items `{ image, title, color }`. Imágenes placeholder reutilizadas de la galería (`h1`–`h8` + `motos-full-view-1`); reemplazar por fotos específicas de cada actividad cuando existan.

---

## 4. Testimonios

Fondo blanco. Carrusel infinito (isla React).

| Aspecto | Valor |
|---------|-------|
| Ritmo | `py-12 md:py-20` |
| Eyebrow | "Testimonios" · `text-primary` |
| h2 | "Lo que dicen las familias" |
| Marrgin h2 | `mt-3` |
| Wrapper carrusel | `mt-14` |
| Isla | `<Testimonials client:visible items={testimonials} />` |

### Carrusel (Testimonials.tsx)

- **Librería**: Embla Carousel + embla-carousel-auto-scroll
- **Hydratación**: `client:visible` (solo cuando entra en viewport)
- **Config**: `loop: true`, `align: "start"`, auto-scroll speed 1, `stopOnMouseEnter: false`, `stopOnInteraction: false`
- **Slides**: `basis-full sm:basis-1/2 lg:basis-1/4` · **Separación**: `pr-6` en cada slide (NO gap en contenedor)
- **Viewport**: `-my-6 overflow-hidden py-6` (padding vertical para sombras)
- **Sin** flechas ni dots: desplazamiento continuo autónomo

### Tarjeta de testimonio

```
figure: flex h-full flex-col bg-white p-6 shadow-sm
├── Stars: 5× SVG size-4 fill-primary (aria-hidden)
├── blockquote: mt-4 text-base leading-relaxed text-neutral-600
└── figcaption: mt-auto pt-6
    ├── p: text-sm font-semibold text-neutral-900 (nombre)
    └── p: mt-0.5 text-xs font-light text-neutral-500 (contexto)
```

### Datos (`testimonials` en frontmatter)

| # | Quote | Nombre | Contexto |
|---|-------|--------|----------|
| 1 | Mi hijo vuelve cansado, sucio y feliz... | Carolina M. | Mamá de Mateo · 9 años |
| 2 | La organización es impecable... | Andrés R. | Papá de Valentina · 7 años |
| 3 | Sofía no paraba de contar las actividades... | Laura P. | Mamá de Sofía · 8 años |
| 4 | Seguridad, diversión y un equipo encantador... | Javier T. | Papá de Diego · 10 años |
| 5 | El plan vacacional superó todo... | Daniela C. | Mamá de Emma · 6 años |
| 6 | Las fiestas temáticas son de otro nivel... | Miguel Á. | Papá de Thiago · 9 años |

> **Placeholders** — reemplazar por testimonios reales cuando existan (CMS/API).

---

## 5. Galería

Fondo blanco. Grid fotográfico estático (cero JS).

| Aspecto | Valor |
|---------|-------|
| Ritmo | `py-12 md:py-20` |
| Eyebrow | "Galería" · `text-primary` |
| h2 | "Así se vive Cappi Xtremo" |
| p intro | `max-w-175` · `text-neutral-600` |
| Grid | `mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4` |

Cada imagen (`<figure>`):
```
group relative aspect-square overflow-hidden shadow-sm
└── img: absolute inset-0 h-full w-full object-cover (hover: group-hover:scale-105 transition-transform duration-500, loading="lazy", alt descriptivo)
```

### Datos (`galleryImages` en frontmatter)

8 imágenes: `juegos-1`, `motos-1..5`, `fiesta-2`, `fiesta-3`. Disponibles `juegos-2..9.jpg` para sustituir.

---

## 6. Nuestro staff

Fondo blanco. Foto del equipo con franja decorativa.

| Aspecto | Valor |
|---------|-------|
| Ritmo | `py-12 md:py-20` |
| Eyebrow | "Nuestro staff" · `text-primary` |
| h2 | "El equipo" + `<UnderlineStroke>Cappi</UnderlineStroke>` |
| p intro | `max-w-[700px]` · `text-neutral-600` |

### Imagen del equipo

```astro
<ImageAccent color="tertiary" position="bottom" align="right">
  <img src="/assets/gallery/team-full-view.jpg" alt="El equipo de monitores y coordinadores de Cappi Xtremo"
    loading="lazy" class="mt-14 h-[480px] w-full object-cover md:h-[850px]" />
</ImageAccent>
```

> Franja `tertiary` (no `primary`): es decoración pura, permitido según SISTEMA-DISENO §9.

---

## 7. Preguntas frecuentes

Banda secundario full-bleed. Acordeón nativo sin JS.

| Aspecto | Valor |
|---------|-------|
| Fondo | `bg-secondary` |
| Ritmo | `py-12 md:py-20` |
| z-index | `relative z-10 isolate` |
| Patrón entrada | `<SectionPattern top="blue-pattern" flipTop />` |
| Eyebrow | "Respondemos tus dudas" · `text-secondary-foreground` |
| h2 | `<UnderlineStroke color="text-primary" nowrap={false}>Preguntas frecuentes</UnderlineStroke>` · `uppercase text-secondary-foreground` |

### Lista de FAQs

Wrapper: `mx-auto mt-14 max-w-3xl divide-y divide-white/25 border-y border-white/25`

Cada FAQ (`<details>`):
```
details: group
├── summary: flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-lg font-semibold text-secondary-foreground transition-opacity hover:opacity-80 [&::-webkit-details-marker]:hidden
│   ├── {question}
│   └── svg chevron: size-5 shrink-0 group-open:rotate-180 transition-transform duration-200
└── p: pb-6 pr-8 leading-relaxed text-secondary-foreground/85
```

### Datos (`faqs` en frontmatter)

7 preguntas con respuesta. **Placeholders** — reemplazar por contenido real.

---

## 8. CTA final

Banner fotográfico oscurecido. Mismo patrón del hero.

| Aspecto | Valor |
|---------|-------|
| Fondo | `motos-full-view-1.jpg` (`/assets/gallery/`) |
| Overlay | `bg-neutral-950/70` |
| Ritmo | `py-20 md:py-24` |
| Imagen | `loading="lazy"` (no es LCP) |

### Contenido

| Elemento | Copy | Clases |
|----------|------|--------|
| h2 | ¿Tienes preguntas sobre nuestros planes vacacionales? Escríbenos. | `mx-auto max-w-3xl text-center text-3xl font-semibold text-white md:text-[40px] md:leading-tight` |
| CTA | Contáctanos | `rounded-full bg-white px-6 py-3 text-base font-semibold text-neutral-900 transition-colors hover:bg-neutral-100` → `/contacto` |

---

## Tokens aplicados

| Token | Dónde se usa |
|-------|-------------|
| `primary` / `primary-foreground` | banda servicios (bg), CTAs primarios, eyebrows, acentos spans en hero, estrellas testimonios, underlines en filosofía/servicios |
| `secondary` / `secondary-foreground` | banda FAQs (bg), círculos de iconos filosofía (`bg-secondary/50`), texto sobre bg-secondary |
| `tertiary` | solo decoración: trazos `<UnderlineStroke>`, franja `<ImageAccent>` en staff |
| `neutral-950/60–70` | overlays fotográficos (hero, servicios, CTA final) |
| `neutral-900/800/600/500` | texto sobre fondo blanco y sobre bg-primary |

---

## Jerarquía tipográfica

Patrón responsive móvil → desktop (ver SISTEMA-DISENO §2). El tamaño base es para móvil; el paso `md:` aplica en escritorio (≥768px).

| Nivel | Uso | Móvil (base) | Desktop (`md:`) |
|-------|-----|--------------|-----------------|
| h1 | solo hero | `text-3xl font-bold tracking-tight text-white` | `md:text-5xl` |
| h2 | títulos de sección | `text-3xl font-semibold text-neutral-900` | `md:text-[40px] md:leading-tight` |
| h3 | items filosofía | `text-lg font-medium` | `md:text-xl` |
| h3 | título countdown | `text-3xl font-semibold uppercase tracking-tight text-neutral-900` | (igual) |
| h4 | títulos tarjetas servicio | `text-xl font-semibold uppercase tracking-wide text-white` | `md:text-2xl` |
| Eyebrow | pre-título de sección | `text-sm font-semibold uppercase tracking-widest text-primary` | `md:text-base` |
| Countdown | números grandes | `text-6xl font-bold tabular-nums tracking-tight text-neutral-900` | `sm:text-7xl` |

---

## Botones (todas pill, estilo opt-in)

| Variante | Clases | Dónde |
|----------|--------|-------|
| Primario grande | `rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90` | hero, filosofía |
| Blanco grande | `rounded-full bg-white px-6 py-3 text-base font-semibold text-neutral-900 transition-colors hover:bg-neutral-100` | hero, servicios (apartar cupo), CTA final |
| Blanco compacto | `rounded-full bg-white px-5 py-2.5 text-sm font-semibold uppercase text-neutral-900 transition-colors hover:bg-neutral-100` | tarjetas servicio |
| Texto plano | `text-base font-medium uppercase text-neutral-900 transition-opacity hover:opacity-70` | "Ver detalles plan vacacional" |

---

## Estrategia JS

| Componente | Implementación | Hydratación |
|------------|---------------|-------------|
| Testimonios | Embla Carousel + auto-scroll | `client:visible` |
| MobileMenu | React state + panel desplegable | `client:load` |
| Contador | script vanilla inline (`<script>` en index.astro) | — |
| FAQs | `<details>/<summary>` nativos | — |
| Animaciones reveal | Motion vanilla (`src/scripts/reveal.ts`) | — |
| Resto | HTML estático puro (SSG) | — |

### reveal.ts — Animaciones disponibles

| `data-motion` | Elemento | Animación |
|----------------|----------|-----------|
| `fade-up` | títulos, párrafos, items de grid | opacity 0→1 + translateY 28px→0, stagger automático (+80ms, máx 400ms) |
| `pattern-top` | SectionPattern `top` | opacity 0→1 + translateY -70%→0 |
| `pattern-bottom` | SectionPattern `bottom` | opacity 0→1 + translateY -70%→0 |
| `accent-left` / `accent-right` | ImageAccent stripe | opacity 0→1 + scaleX 0→1 desde su lado |
| `data-motion-underline` (attr en SVG) | UnderlineStroke SVG | clip-path del padre: inset(0 100% 0 0) → inset(0 0% 0 0) |

**Reglas**:
- Progressive enhancement: `<html class="js">` en Layout.astro; `[data-motion] { opacity: 0 }` solo bajo `html.js`
- `prefers-reduced-motion: reduce` → no se ejecuta `init()`, todo queda visible
- Cada animación corre una sola vez (`inView` + stop)
- Hero estático a propósito (LCP)
- Secciones con `relative z-10 isolate` para stacking correcto con patrones

---

## Accesibilidad

- Imágenes decorativas: `alt=""` + `aria-hidden="true"` (fondos, iconos, estrellas, patrones)
- Fotos de contenido: alt descriptivo
- Contador: `role="timer"` + `aria-labelledby` → h3
- Carrusel: `role="region"` + `aria-label="Testimonios de familias"`
- Menú móvil: `aria-expanded`, `aria-controls`, cierre con `Escape`, cierre al click fuera, `inert` cuando cerrado
- FAQs: `<details>/<summary>` nativos — accesibles por defecto

---

## Pendientes

1. **Hrefs placeholder**: "Únete ahora" (hero) → `#`; "Ver servicio" ×2 (servicios) → `#`
2. **Datos placeholder**: `NEXT_CAMP_START`, testimonios, galería, FAQs → conectar a API/CMS
3. **Imágenes**: migrar a `src/assets/` + `astro:assets <Image>` (WebP/AVIF responsive)
4. **Staff**: detalle por miembro (nombres + roles) cuando existan datos
5. **SEO**: metas dinámicas, JSON-LD, sitemap.xml, robots.txt (ver módulo 09)

---

## Cómo usar esta spec para generar otras vistas

Para crear una nueva página (ej. `/campamentos`, `/contacto`):

1. **Elegir patrón**: ¿fondo blanco (A), banda de color (B), o foto oscurecida (C)?
2. **Copiar encabezado**: usar el bloque de eyebrow + h2 del patrón correspondiente
3. **Reutilizar componentes**: `<UnderlineStroke>`, `<SectionPattern>`, `<ImageAccent>` ya están disponibles
4. **Aplicar animaciones**: agregar `data-motion="fade-up"` a títulos, párrafos y items
5. **Mantener container**: `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` siempre
6. **Botones**: seguir la tabla de variantes (pill siempre, estilo opt-in)
7. **JS mínimo**: preferir `<details>`, scripts vanilla, islas React solo para interacción real
8. **SEO**: agregar `<Layout title="..." description="...">` con metas por página
