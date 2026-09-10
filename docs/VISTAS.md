# Spec: Vistas y páginas

Mapa de todas las rutas, su composición de secciones y las plantillas que sirven de referencia para crear vistas nuevas. Toda la documentación del proyecto vive en `/landing/docs`.

- [ARQUITECTURA.md](./ARQUITECTURA.md)
- [SISTEMA-DISENO.md](./SISTEMA-DISENO.md)
- [LAYOUT-PRINCIPAL.md](./LAYOUT-PRINCIPAL.md)
- [VISTAS.md](./VISTAS.md) — este documento

---

## 1. Rutas actuales

| Ruta                                        | Vista              | Patrón                                   |
| ------------------------------------------- | ------------------ | ---------------------------------------- |
| `/`                                         | Inicio             | hero + contenido + bandas + CTA          |
| `/quienes-somos`                            | Quiénes somos      | editorial + franja con ImageAccent       |
| `/plan-vacacional`                          | Plan Navidad       | hero + datos + inclusiones + actividades + CTA |
| `/planes-vacacionales`                      | Alias legacy       | redirige a `/plan-vacacional`             |
| `/planes-vacacionales/[slug]`               | Detalle legacy     | conserva `dia-completo`; `vacacional` redirige |
| `/nuestro-staff`                            | Nuestro Staff      | recruitment + perfiles + popup            |
| `/experiencias-escolares`                   | Experiencias escolares | hero + contenido + formulario WhatsApp |
| `/eventos-corporativos`                     | Eventos corporativos | hero + principios + propuesta            |
| `/celebra-con-cappi`                        | Celebra con Cappi  | editorial + pasos + CTA WhatsApp         |
| `/programas-especiales`                     | Alias legacy       | redirige a `/celebra-con-cappi`           |
| `/familias`                                 | Portal de familias | features + pasos + CTA light             |
| `/contacto`                                 | Contacto           | hero + formulario + canales + horario    |
| `/tienda`                                   | Tienda             | **`ComingSoonSection`**                  |
| `/coming-soon`                              | Próximamente       | **`ComingSoonSection`** (portal/pagos)   |
| `/privacidad`                               | Legal              | **`LegalSection`**                       |
| `/terminos`                                 | Legal              | **`LegalSection`**                       |

`[slug]` (getStaticPaths) conserva `dia-completo` y el path legacy `vacacional`; este último redirige a `/plan-vacacional` para no publicar el contenido antiguo.

---

## 2. Inicio — `/`

Hero + filosofía + banda de servicios + actividades + testimonios + galería + staff + FAQ.

**Composición** (`src/pages/index.astro`):

1. `SectionHero` — vídeo (mp4) con póster, `disfuminar="bottom"`, botones [`primary`→planes, `white`→`#`], `dock`.
2. `PhilosophySection` — grid 4 pilares (iconos Tabler: flag, people, laugh, shield) + CTA.
3. `<SectionPattern top>` + `ServicesBand` + `<SectionPattern bottom>` — banda `bg-sections` con 3 service cards + **countdown** (`countdownSize="hero"`, target `NEXT_CAMP_START = '2027-06-15T09:00:00-04:00'`).
4. `ActivitiesSection` — 9 tarjetas de actividad con color de acento.
5. `TestimonialsSection` — carrusel auto-scroll (isla React `client:visible`).
6. `GallerySection` — 2 filas (horizontal + vertical) carrusel + lightbox.
7. `StaffSection` — foto de equipo full view + intro + CTA **"Conocer más" → `/nuestro-staff`** (centrado, `mt-12`).
8. `<SectionPattern top>` + `FaqSection tone="dark"` (banda `bg-sections`) + `<SectionPattern bottom>`.
9. `CtaSection variant="image"` — fotografía oscurecida, CTA final "Contáctanos".

---

## 3. Quiénes somos — `/quienes-somos`

Editorial con el patrón **sección blanca ↔ banda `bg-sections`** y franjas con `ImageAccent`.

**Composición** (`src/pages/quienes-somos.astro`):

1. `SectionHero` — foto, `disfuminar="bottom"`.
2. Sección blanca: `SectionHeading` "Quiénes somos" + 2 párrafos centrados (`max-w-3xl`).
3. Bandas `bg-sections` + `SectionHeading tone="dark"` ("Lo que nos mueve") y texto centrado.
4. **Historia**: párrafos + `ImageAccent color="tertiary" position="bottom" align="right"` con imagen; cita `blockquote border-l-4 border-primary`.
5. **Coordinadora**: grid 2 cols (texto + `ImageAccent color="secondary" position="top" align="left"`).
6. **2023**: `ImageAccent color="primary" position="bottom" align="left"`.
7. Banda "Un espacio para crecer y soñar" (`SectionHeading tone="dark"`).
8. `CtaSection variant="image"` — CTA final.

El recruitment y los perfiles viven de forma independiente en `/nuestro-staff`; no forman parte de esta vista.

---

## 4. Plan vacacional — `/plan-vacacional`

Página canónica del Plan Vacacional - Edición Navidad, con contenido exacto suministrado por el equipo.

**Composición** (`src/pages/plan-vacacional.astro`):

1. `SectionHero` con breadcrumb, fechas, horario y edades en el subtítulo y CTA a `https://cappixtremo.com`.
2. `CountdownSection` + `SectionPattern` — cuenta regresiva de la edición.
3. `InclusionsBandSection` — pills (fecha/horario/edades), ubicación e inclusiones con íconos lucide.
4. `ActivitiesSection` — 9 actividades navideñas y recreativas.
5. `CtaSection variant="light"` — enlaces a Cappixtremo.com e Instagram `@cappixtremo`.

Los datos viven en `src/data/plan-vacacional.ts`. No se muestra precio ni año porque no fueron suministrados.

---

## 5. Staff y recruitment — `/nuestro-staff` y `/quiero-ser-staff`

El recruitment y los perfiles viven de forma independiente; no forman parte de esta vista.

---

## 6. Nuestro Staff — `/nuestro-staff`

Recruitment, selección, capacitación y perfiles del equipo.

**Composición** (`src/pages/nuestro-staff.astro`):

1. `SectionHero` con el equipo Xtremo.
2. `StaffRecruitmentSection` con selección, capacitación y diálogo nativo.
3. `StaffProfilesSection` con los ocho perfiles; solo Maira y Deymar reciben imagen.
4. `CtaSection` con enlace de contacto para postulación.

## 7. Experiencias escolares — `/experiencias-escolares`

Landing para colegios con observaciones, propuesta, formas de trabajo, beneficios, razones, principios y formulario de cinco campos que continúa a WhatsApp.

## 8. Eventos corporativos — `/eventos-corporativos`

Landing para empresas con razones verificables, principios, bloque Hablemos y formulario de propuesta con selects para evento y cantidad de niños. La solicitud compone correo a `INFO@CAPPIXTREMO.COM` y continúa a WhatsApp.

## 9. Celebra con Cappi — `/celebra-con-cappi`

Eventos, fiestas y animación con cotización.

**Composición** (`src/pages/celebra-con-cappi.astro`):

1. `SectionHero` con `badge="100% personalizable"`.
2. `ServicesSection` — card de servicio (imagen, precio "Cotizaciones a medida", features, staff/director, CTA "Solicitar cotización" → WhatsApp `https://wa.link/lcjcpu`).
3. `<SectionPattern top>` + `StepsSection columns={3}` (cotización) + `<SectionPattern bottom>`.
4. `GallerySection` — galería completa (`import.meta.glob`).
5. `TestimonialsSection`.
6. `<SectionPattern top>` + `FaqSection tone="dark"` + `<SectionPattern bottom>`.
7. `CtaSection variant="image"` final.

---

## 10. Portal de Familias — `/familias`

Portal (próximamente en su mayoría) con features del producto.

**Composición** (`src/pages/familias.astro`):

1. `SectionHero` con 2 botones (Crear mi cuenta / Iniciar sesión → `/coming-soon`).
2. `FeaturesSection` — 6 cards con `FeatureIcon` (`dashboard|inscription|payments|health|photos|balance`).
3. `<SectionPattern top>` + `StepsSection columns={4}` + `<SectionPattern bottom>`.
4. `CtaSection variant="light"` — CTA claro (fondo `bg-sections`), botones `primary` + `outline`.

---

## 8. Contacto — `/contacto`

Formulario + canales.

**Composición** (`src/pages/contacto.astro`):

1. `SectionHero` (`disfuminar="bottom"`).
2. `ContactSection` — **formulario** (nombre, correo, **select de asunto**, mensaje), canales WhatsApp/Mail y `schedule` (con `dimmed: true` para "Cerrado").

Detalle del asunto (importante): el `<select id="subject">` incluye la opción **"Quiero ser staff"**. Un `<script>` vanilla lee el query `?asunto=` (ej. `/contacto?asunto=staff`, generado por el botón del Footer), preselecciona la opción cuyo `value` o texto coincida y **limpia la URL** con `history.replaceState`. El envío del formulario abre `mailto:` con el asunto prellenado.

---

## 9. Vistas simples

### Tienda — `/tienda`

`ComingSoonSection` con título "Tienda próximamente", descripción y 2 links (`primary`→`/`, `link`→planes).

### Próximamente — `/coming-soon`

`ComingSoonSection` **sin props** (usa defaults del componente). El portal de familias/pagos.

### Privacidad / Términos — `/privacidad`, `/terminos`

`LegalSection` con `sections: { heading, body, list? }[]`. El `body` acepta HTML (enlaces `text-secondary underline`).

---

## 10. Resumen de componentes de sección (por dominio)

| Dominio       | Componente               | Props destacadas                                                                                            |
| ------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| hero          | `SectionHero`            | `bgImage`, `bgVideo?`, `bgColor?`, `eyebrow`, `eyebrowHighlight`, `title`, `highlight`, `titleAfter`, `subtitle`, `badge?`, `buttons`, `crumbs?`, `dock?`, `titleMargin?`, `disfuminar` |
| hero          | `ComingSoonSection`      | `title?`, `description?`, `links?`                                                                           |
| cards         | `PhilosophySection`      | `title`, `underline`, `intro`, `items {icon,title,description}`, `cta`                                      |
| cards         | `ActivitiesSection`      | `eyebrow?`, `underline?`, `intro`, `items {image,title,color}`, `padding`                                   |
| cards         | `StaffSection`           | `eyebrow`, `title`, `underline`, `intro`, `image`, `imageAlt` + CTA interno → `/nuestro-staff`             |
| cards         | `ServicesSection`        | `title`, `underline`, `intro`, `service {name,priceLabel,image,features,staft,cta}`, `ctaHref`              |
| cards         | `FeaturesSection`        | `eyebrow?`, `title`, `underline`, `items` (`FeatureIcon`)                                                    |
| cta           | `ServicesBand`           | `headingTitle`, `underline`, `intro`, `cards`, `countdownId/Target/Size`, `ctas` — banda `bg-sections`       |
| cta           | `CtaSection`             | `variant image|light|dark`, `bgImage?`, `disfuminar?`, `title`, `underline?`, `titleAfter?`, `intro?`, `buttons`, `padding` |
| cta           | `InclusionsBandSection`  | `pills {text,fat}`, `location`, `items {label,color,icon}`, `cta` — banda `bg-sections` con tarjetas blancas |
| faq           | `FaqSection`             | `tone dark|light`, `eyebrow`, `title`, `underline`, `items`, `padding` (details/summary)                    |
| gallery       | `GallerySection`         | `eyebrow`, `title`, `underline?`, `intro?`, `introClass?`, `rows {images,direction}`, `padding` → isla `GalleryCarousel` `client:visible` |
| testimonials  | `TestimonialsSection`    | `eyebrow?`, `title`, `underline?`, `items`, `compactHeading?`, `padding` → isla `Testimonials` `client:visible` |
| schedule      | `CountdownSection`       | `title`, `target`, `countdownId?`, `ctas` — banda `bg-sections`, countdown `size="standard"`                  |
| steps         | `StepsSection`           | `eyebrow?`, `title?`, `underline?`, `steps {number,title,description}`, `columns 3|4`, `cta?` — banda `bg-sections` |
| legal         | `LegalSection`           | `title`, `updated`, `sections {heading, body, list?}`                                                        |
| contact       | `ContactSection`         | `formTitle?`, `formIntro?`, `channels?`, `schedule {range,hours,dimmed?}` — preselecciona `?asunto=`         |

Para las props completas y el comportamiento exacto, remitirse a la implementación (`src/components/sections/<dominio>/`) — deben documentar su interfaz en el frontmatter.

---

## 11. Patrón de hero unificado

Todas las vistas (menos legal y coming-soon) abren con `SectionHero`:

- `bgImage` (foto `?url`), tienes opcional `bgVideo` + `bgVideoPoster` (solo home).
- `eyebrow` "Cappi " + `eyebrowHighlight` "Xtremo" en casi todas (o "Portal de " + "Familias").
- Mensaje compuesto `title` + `highlight` + `titleAfter`.
- `subtitle` explicativo corto.
- `disfuminar="bottom"` para suavizar hacia la siguiente sección.
- Altura fija `h-[680px]`, overlay `brightness-50`.
- Variantes: `crumbs` y `titleMargin={false}` en plan-vacacional; `buttons` para CTAs del hero.

---

## 12. Reglas de contenido

1. Una vista nueva = 1 archivo en `src/pages/` + entrada en `navLinks` (Header) + footer; seguir el Mapa de rutas (§1).
2. Todo CTA de cierre usa `CtaSection variant="image"` (menos `familias` que usa `variant="light"` porque el portal no es un producto final cerrado; y `tienda`/`coming-soon`/legales que no llevan CTA final).
3. Fechas de countdown en formato ISO con offset (`2027-06-15T09:00:00-04:00`), definidas como `const NEXT_CAMP_START` en el frontmatter.
4. Estado "Próximamente": `PriceDisplay` recibe `price: 'Próximamente'`.
5. Imágenes de galería: siempre `alt` descriptivo; en galería masiva un alt genérico es aceptable.