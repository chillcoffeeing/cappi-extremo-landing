# Spec: Layout Principal

Estructura compartida por todas las páginas del landing: **Header** (franja social + menú) y **Footer** (contenido centrado + barra legal). Tokens definidos en [SISTEMA-DISENO.md](./SISTEMA-DISENO.md).

## Estructura general

```
<Header>
├── Franja social     h-8 · bg-primary · contacto izq (icono+nombre desktop) · redes der
└── Menú              responsive · bg-white · uppercase · logo grande | nav | CTA

<main> …contenido de la página… </main>

<Footer>
├── Fila horizontal   WhatsApp · Mail · logo h-24 · CTA inscripción · login
└── Barra legal       links centrados + copyright
```

---

## 1. Header

### 1.1 Franja social

Franja superior de altura fija `h-8` (32px), fondo primario con foreground negro. Dos grupos anclados a los extremos (`justify-between`):

| Grupo | Contenido                           | Clases                    |
| ----- | ----------------------------------- | ------------------------- |
| Izq   | **WhatsApp** y **Mail** con nombre  | `flex items-center gap-4` |
| Der   | **Instagram** y **Facebook**, icono | `flex items-center gap-4` |

Contenedor: contenedor estándar + `flex h-full items-center justify-between`.

- Iconos SVG importados desde `src/assets/ui/` (Tabler Icons, ISC) — en Astro vía import directo, en React vía `?raw`. NO isla React: cero JS en el header.
- Iconos `size-6`; cada enlace con `aria-label`, `target="_blank"` y `rel="noopener noreferrer"`.
- **Nombre de la red solo en desktop**: `hidden text-xs font-medium md:inline` junto al icono; en móvil se ve solo el icono.
- Hover: `transition-opacity hover:opacity-70`.

```astro
<div class="h-8 bg-primary text-primary-foreground">
	<div class="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
		<div class="flex items-center gap-4">
			<a href="https://wa.me/{numero}" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer"
				class="inline-flex items-center gap-1.5 transition-opacity hover:opacity-70">
				<Fragment set:html={injectClass(whatsappSvg, "size-6")} />
				<span class="hidden text-xs font-medium md:inline">WhatsApp</span>
			</a>
			<a href="mailto:{correo}" aria-label="Mail" target="_blank" rel="noopener noreferrer"
				class="[mismo patrón]">
				<Fragment set:html={injectClass(mailSvg, "size-6")} />
				<span class="hidden text-xs font-medium md:inline">Mail</span>
			</a>
		</div>

		<div class="flex items-center gap-4">
			<!-- Instagram y Facebook: mismo <svg>, sin span de nombre -->
		</div>
	</div>
</div>
```

### 1.2 Menú principal

Responsive, fondo blanco. En **móvil son solo 2 columnas** (`grid-cols-2`: logo izq · hamburguesa alineada a la derecha); desde `md:` pasan a tres zonas con grid `[1fr_auto_1fr]` (permite nav realmente centrado):

| Zona   | Contenido                        | Clases                                     |
| ------ | -------------------------------- | ------------------------------------------ |
| Izq    | Logo grande                      | `justify-self-start`                       |
| Centro | Navegación principal (uppercase) | `hidden justify-self-center gap-2 md:flex` |
| Der    | CTA + hamburguesa                | `flex justify-self-end items-center gap-3` |

```astro
<header class="sticky top-0 z-40 bg-white shadow-sm">
	<nav
		class="mx-auto grid h-18 max-w-7xl grid-cols-2 items-center px-4 sm:px-6 md:h-24 md:grid-cols-[1fr_auto_1fr] lg:px-8"
	>
		<a href="/" class="justify-self-start">
			<img src="/assets/cappi-extremo-logo.png" alt="Cappi Extremo" class="h-12 w-auto md:h-20" />
		</a>

		<ul class="hidden items-center justify-self-center gap-2 md:flex">
			<li><a href="/campamentos" aria-current="page"
				class="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold uppercase text-primary">Campamentos</a></li>
			<li><a href="/contacto"
				class="rounded-full px-4 py-2 text-sm font-medium uppercase text-neutral-700 transition-colors hover:text-primary">Contacto</a></li>
		</ul>

		<div class="flex items-center justify-self-end gap-3">
			<button type="button" class="md:hidden" aria-label="Abrir menú" aria-expanded="false">
				<ListIcon class="size-6" weight="bold" />
			</button>
			<a href="/campamentos"
				class="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 md:inline-flex">
				Inscribir ahora
			</a>
		</div>
	</nav>
</header>
```

Detalles:

- Altura del nav: `h-18` (72px) móvil / `md:h-24` (96px) desktop.
- Sticky recomendado: `sticky top-0 z-40` + `shadow-sm`.
- **Logo**: el doble del tamaño base → `h-12 w-auto md:h-20`; entra con aire en ambos altos del nav.
- Links del nav: siempre `uppercase` con padding de píldora (`rounded-full px-4 py-2`) para que activo e inactivo compartan geometría.
  - Inactivo: `text-sm font-medium uppercase text-neutral-700 transition-colors hover:text-primary`.
  - **Activo (estilo CTA redondeado)**: `bg-primary/10 text-sm font-semibold uppercase text-primary` — es la única píldora con fondo del nav además del CTA.
- CTA del menú: botón sólido primario pill con `text-primary-foreground`.
- **Móvil (< `md`)**: nav y CTA ocultos; hamburguesa visible abre panel desplegable bajo el menú.
  - El menú móvil es una **isla React** (`src/components/react/MobileMenu.tsx`) montada con **`client:load`** — decisión fija del proyecto: _todo menú móvil o dropdown se implementa como isla React + Tailwind con hidratación inmediata_.
  - Comportamiento requerido: `aria-expanded` / `aria-controls`, cierre con `Escape`, cierre al click fuera, cierre al navegar un link, panel `inert` cuando está cerrado.
  - El panel usa posicionamiento absoluto (`absolute inset-x-0 top-full`) anclado al header sticky → ocupa todo el ancho del viewport sin JS extra.
- Panel móvil: espejo del menú desktop — links `uppercase` como píldoras (`block rounded-full px-4 py-2.5`), activo `bg-primary/10 text-primary font-semibold`, CTA a ancho completo.

---

## 2. Footer

El footer es una **sola fila horizontal centrada**. El único elemento con tratamiento de botón es el **CTA de inscripción**; todos los demás enlaces son **texto en UPPERCASE** sin fondo ni borde (regla opt-in del sistema de diseño).

### 2.1 Fila principal

Alto mínimo 150px → `md:min-h-40` (160px, paso estándar inmediato superior; evita valor arbitrario). Orden estricto de la fila:

**WhatsApp · Mail · Logo · Inscribir ahora (CTA) · Iniciar sesión**

```astro
<footer class="bg-white">
	<div class="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-4 px-4 py-10 sm:px-6 md:min-h-40 lg:px-8">

		<a href="https://wa.me/{numero}"
			class="text-sm font-medium uppercase text-neutral-700 transition-colors hover:text-primary">WhatsApp</a>

		<a href="mailto:{correo}"
			class="text-sm font-medium uppercase text-neutral-700 transition-colors hover:text-primary">Mail</a>

		<a href="/" aria-label="Cappi Extremo — Inicio" class="order-first flex w-full justify-center md:order-none md:w-auto">
			<img src="{logo}" alt="Cappi Extremo" class="h-24 w-auto" />
		</a>

		<a href="/campamentos"
			class="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
			Inscribir ahora
		</a>

		<a href="{PORTAL_URL}/login"
			class="text-sm font-medium uppercase text-neutral-700 transition-colors hover:text-primary">Iniciar sesión</a>
	</div>
```

- **Orden fijo**: WhatsApp → Mail → Logo → CTA → Login.
- **Logo**: el doble del tamaño anterior → `h-24 w-auto`. En móvil pasa al frente y ocupa toda la fila (`order-first w-full`, centrado); en `md:` recupera su posición en la grilla (`md:order-none md:w-auto`).
- CTA inscripción: botón sólido primario pill — único elemento con estilo de botón en el footer.
- Enlaces secundarios (WhatsApp · Mail · Iniciar sesión): `text-sm font-medium uppercase text-neutral-700 hover:text-primary` — jamás estilo botón (ni fondo ni borde).
- Responsive: `flex-wrap` — en pantallas angostas los elementos bajan como filas centradas, conservando el orden.

### 2.2 Barra legal

Debajo del borde separador (`border-t`): menú horizontal de links centrado + copyright **al final**, con año auto-actualizable. Orden estricto de los enlaces:

**Inicio · Campamentos · Programas · Contacto · Políticas de privacidad · Términos y condiciones**

```astro
---
const year = new Date().getFullYear();
---

	<div class="border-t border-neutral-200">
		<div class="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-6 text-sm text-neutral-600 sm:px-6 lg:px-8">
			<a href="/" class="transition-colors hover:text-primary">Inicio</a>
			<a href="/campamentos" class="transition-colors hover:text-primary">Campamentos</a>
			<a href="/programas" class="transition-colors hover:text-primary">Programas</a>
			<a href="/contacto" class="transition-colors hover:text-primary">Contacto</a>
			<a href="/privacidad" class="transition-colors hover:text-primary">Políticas de privacidad</a>
			<a href="/terminos" class="transition-colors hover:text-primary">Términos y condiciones</a>
		</div>
		<p class="text-center text-sm text-neutral-600 pb-6">© {year} Cappi Extremo. Todos los derechos reservados.</p>
	</div>
</footer>
```

> Nota SSG: `{year}` se hornea en build y se refresca con cada deploy. Si se exige exactitud en runtime, micro-script cliente:
> `<script>document.getElementById('footer-year').textContent = new Date().getFullYear();</script>`

---

## Reglas del layout

1. **Responsive es requisito, no opcional**: toda spec e implementación debe verse correcta en móvil (360px), tablet (`md`) y desktop (`lg`). Breakpoints estándar de Tailwind.
2. Todo el contenido vive en el contenedor estándar: `container`.
3. Foregrounds siempre tokenizados sobre fondos de marca: `text-primary-foreground` (negro), `text-secondary-foreground` (blanco). Nunca `text-black` / `text-white` crudos.
4. El terciario queda reservado para decoración futura (`after:bg-tertiary`, `decoration-tertiary`); nunca fondo ni texto de contenido.
5. Header y Footer son componentes `.astro` estáticos (cero hidratación). **Excepción única y obligatoria: menús móviles y dropdowns → islas React + `client:load`.**
6. **Iconos como archivos SVG** en `src/assets/ui/` (Tabler Icons, ISC) — importados directamente en los componentes. Prohibido instalar paquetes de iconos como npm dependency o hardcodear paths como strings.
7. Alturas con pasos estándar: franja `h-8`, menú `h-18 md:h-24`, footer `md:min-h-40`.
8. Enlaces de navegación (header y footer) siempre `uppercase`. El estilo de botón es opt-in: en el header solo CTA y link activo; en el footer únicamente el CTA de inscripción.

---

## Implementación

| Archivo                               | Rol                                                                                                      |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `src/layouts/Layout.astro`            | Shell global: Poppins, `<Header />`, `<main>`, `<Footer />`, sticky footer con `flex min-h-dvh flex-col` |
| `src/components/astro/Header.astro`   | Franja social + menú (estático, cero JS)                                                                 |
| `src/components/react/MobileMenu.tsx` | Isla del menú móvil — `client:load` · iconos SVG inline                                                  |
| `src/components/astro/Footer.astro`   | Fila horizontal (WhatsApp · Mail · logo · CTA · login) + barra legal                                     |
| `src/lib/social.ts`                   | URLs de redes/contacto (sin SVGs — los iconos están en `src/assets/ui/`)                                 |

Variables de entorno: `PUBLIC_PORTAL_URL` (login del footer; placeholder `#` si no está definida).
Placeholders pendientes de reemplazar en `src/lib/social.ts`: número WhatsApp, correo, handles de Instagram/Facebook.
