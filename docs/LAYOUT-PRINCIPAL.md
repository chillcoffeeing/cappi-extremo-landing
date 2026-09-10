# Spec: Layout Principal

Estructura global y componentes compartidos del landing. Toda la documentación del proyecto vive en `/landing/docs`.

- [ARQUITECTURA.md](./ARQUITECTURA.md)
- [SISTEMA-DISENO.md](./SISTEMA-DISENO.md)
- [LAYOUT-PRINCIPAL.md](./LAYOUT-PRINCIPAL.md) — este documento
- [VISTAS.md](./VISTAS.md)

---

## 1. `src/layouts/Layout.astro` — shell global

Toda página se renderiza dentro de `<Layout title description />`.

Props: `title` (default `"Cappi Extremo"`), `description` (default comercial genérica). Formato recomendado para el title: `"<Página> - Cappi Extremo"`.

Estructura del body (`flex min-h-dvh flex-col overflow-x-hidden`):

```
<Header />        → navbar sticky (ver §2)
<main class="flex-1">
	<slot />      → secciones de la página
</main>
<a WhatsApp flotante>  → botón sustituto secundario §3
<Footer />        → footer (ver §4)
<script type="module"> import "../scripts/reveal" </script>
```

Cargas en el `<head>`:

- `<script is:inline> document.documentElement.classList.add("js") </script>` — permite progressive enhancement (ver SISTEMA-DISENO §10).
- Favicons: `/favicon.svg` + `/favicon.ico`.
- Preconnect + Google Fonts Poppins (300–700, `display=swap`).
- `meta name="description"`, `generator`, but **sin theme-color** (se vistió `#008080` antiguo; hoy no se declara).
- sidebar no existe: basta `<title>` + `<meta description>`.

---

## 2. Header — `src/components/astro/Header.astro`

Navbar **sticky** (`sticky top-0 z-40 bg-white shadow-sm`). La fila interna conserva `mx-auto grid h-18 max-w-7xl grid-cols-2 items-center md:h-24 md:grid-cols-[1fr_auto_1fr]`; el mega panel se posiciona fuera de ese ancho máximo para ocupar todo el viewport.

### Fuente única de navegación — `src/data/navigation.ts`

El header, el mega menú desktop y la isla mobile consumen el árbol discriminado exportado desde `src/data/navigation.ts`. El orden raíz es:

| # | Link/grupo | Destino | Comportamiento |
| - | --- | --- | --- |
| 0 | Inicio | `/` | enlace directo |
| 1 | Aventuras | `/plan-vacacional` | grupo con mega panel |
| 2 | Programas especiales | `/celebra-con-cappi` | grupo con mega panel |
| 3 | Quiénes somos | `/quienes-somos` + `/nuestro-staff` | grupo con mega panel |
| 4 | Tienda | `/tienda` | enlace directo |
| 5 | Contacto | `/contacto` | enlace directo |

`Familias` ya no forma parte del árbol principal, pero la página `/familias` se conserva para enlaces internos futuros y no se elimina del footer en esta tarea. La ruta canónica del plan es `/plan-vacacional`; `/planes-vacacionales` se conserva como alias compatible que redirige a ella.

### Composición del header

| Zona | Contenido |
| --- | --- |
| Izquierda | Link al logo (`/`): `<img src={logoSrc} />`, h-12 md:h-20. |
| Centro | `<DesktopMegaMenu navigation={navigation} currentPath={pathname} />`, visible desde `lg`; enlaces directos y triggers de grupos. En tablet se conserva el menú móvil para evitar overflow. |
| Derecha | `<MobileMenu client:load navigation={navigation} ctaHref="/coming-soon" currentPath={pathname} />` en mobile + CTA `Inscribir ahora` en desktop. |

El CTA de escritorio mantiene `/coming-soon` y sus estilos de marca.

### Mega menú desktop — `src/components/astro/DesktopMegaMenu.astro`

- Los grupos `Aventuras`, `Programas especiales` y `Quiénes somos` usan triggers con `aria-haspopup="true"`, `aria-expanded` y `aria-controls`.
- Cada panel es una región semántica con `aria-labelledby`, `aria-hidden`, `inert` y `data-state`. Las secciones usan headings y listas de navegación nativas; no se usa `role="menu"`/`menuitem`.
- El surface usa `absolute inset-x-0 top-full w-full` bajo el header. Solo su contenido interno usa la utilidad `container` existente, con grid de hasta cuatro columnas, altura natural limitada y `overflow-y-auto` de protección.
- El puntero abre al entrar en un grupo y permite cruzar hacia el panel con un pequeño delay de cierre. Solo un grupo permanece abierto.
- `focusin`, Enter/Espacio y ArrowDown ofrecen una ruta equivalente para teclado. Escape, `pointerdown` externo y `focusout` externo cierran; Escape devuelve el foco al trigger.
- Los enlaces activos conservan `aria-current="page"`; el trigger padre refleja el estado activo de sus descendientes.
- Los estados usan `transition-[opacity,transform,visibility]`, duración breve y `motion-reduce:transition-none`, sin `transition-all`.

### Estado activo

`isActive(href) = href === "/" ? pathname === "/" : pathname.startsWith(href)`. Los links activos usan `bg-primary/10 text-primary font-semibold`; los inactivos, `text-neutral-700` y `hover:text-primary`. Triggers, links y botones tienen foco visible con los tokens primarios.

### Menú móvil — `src/components/react/MobileMenu.tsx`

La isla mobile recibe `navigation: NavigationItem[]`, `ctaHref` y `currentPath`. Los links directos permanecen como anchors. Cada grupo es un único disclosure con `aria-expanded`/`aria-controls`; su `mobile-group-panel-*` contiene directamente los títulos de sección y sus listas de enlaces, sin dropdowns internos. El panel mantiene `inert`/`aria-hidden` cerrado, altura limitada con scroll vertical, objetivos táctiles mínimos de 44 px, cierre por Escape/pointerdown exterior y retorno de foco al botón. Cualquier enlace cierra el panel antes de navegar. Los iconos se cargan desde los SVG locales con `?raw`.

---

## 3. Botón flotante WhatsApp

Directamente en `Layout.astro` (no en el footer). `<a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">` fijo abajo-derecha:

- `fixed bottom-6 right-6 z-50 inline-flex size-14 items-center justify-center rounded-full bg-[#25D366] text-primary-foreground shadow-lg`
- Icono WhatsApp inline (svg 24x24, stroke). Alineado con `text-primary-foreground` aunque el fondo sea hex de WhatsApp (única excepción justificada de token).
- Hover `scale-105`, focus ring `outline-primary`. `aria-label` y `title` = "Contactar por WhatsApp".
- Cercano a `<main>` por z-index y fuera del flujo contenido; se coloca justo después de `</main>` y antes de `<Footer />` para quedar sobre el contenido pero debajo del footer.

---

## 4. Footer — `src/components/astro/Footer.astro`

`<footer class="bg-white">` con dos bloques:

### 4.1 Bloques principales — grid 5 columnas (`md:grid-cols-5`, `md:min-h-40`)

MOVIL: `flex flex-wrap items-center justify-center gap-x-8 gap-y-4 py-10`.
DESKTOP: `md:grid md:grid-cols-5 md:max-w-max md:text-center`.

| Columna | Contenido                                                  |
| ------- | ---------------------------------------------------------- |
| 1 | Link **WhatsApp** (→ `WHATSAPP_URL`, `target="_blank"`)     |
| 2 | Link **Mail** (→ `EMAIL_URL`)                               |
| 3 | Link **Inscribirse** (→ `/coming-soon`)                     |
| 4 | Link **Login** (→ `/coming-soon`)                           |
| 5 | `<Button href="/contacto?asunto=staff" label="¡QUIERO SER STAFF!" variant="primary" />` |

Cada columna: `text-lg font-medium uppercase text-neutral-700 hover:text-primary`.

> El botón staff es un `Button variant="primary"` **tipo link** (posee `href`). El query `?asunto=staff` es leído por `ContactSection` para preseleccionar el asunto del formulario (ver VISTAS.md → Contacto).

### 4.2 Fila inferior — links de pie

`border-t border-neutral-200`, dentro contenedor `max-w-7xl` con `flex flex-wrap justify-center gap-x-8 gap-y-2 py-6 text-sm text-neutral-600`:

1. Inicio `/`
2. Quiénes somos `/quienes-somos`
3. Plan vacacional `/plan-vacacional` (alias legacy: `/planes-vacacionales`)
4. Tienda `/tienda`
5. Celebra con Cappi `/celebra-con-cappi`
6. Experiencias escolares `/experiencias-escolares`
7. Eventos corporativos `/eventos-corporativos`
8. Nuestro Staff `/nuestro-staff`
9. Familias `/familias`
10. Contacto `/contacto`
11. Políticas de privacidad `/privacidad`
12. Términos y condiciones `/terminos`

Debajo, `© {year} Cappi Extremo. Todos los derechos reservados.` (año dinámico con `new Date().getFullYear()`).

---

## 5. Reglas del layout

1. Cualquier página nueva se declara con `<Layout title description>` y sus secciones dentro de `<main>` (automático por el shell).
2. Los links de navegación (y del footer) deben mantenerse consistentes con `navLinks`/pie del footer al añadir rutas.
3. El orden de zonas del hero/CTA del header no deben duplicarse en el footer si no cambia de propósito (el footer repite Secciones completas: inscribirse/login apuntan a `coming-soon`).
4. No mover el botón WhatsApp del `<Layout>` (es global). Evitar anidarlo en el footer.
5. No usar `theme-color` ni tokens hardcodeados en este archivo; todo color se hereda de tokens del spec de diseño.