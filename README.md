# Cappi Xtremo — Landing

Sitio público en `https://www.cappixtremo.com` (Astro estático). Repo
`chillcoffeeing/cappi-extremo-landing`. No tiene backend: los formularios y los botones de
inscripción abren WhatsApp con los datos (`wa.me`; la postulación de staff abre un `mailto:`) y "Login" lleva al portal
(`app.cappixtremo.com`).

## Stack

Astro 7 (salida `static`) · Tailwind v4 (tokens CSS-first) · islas React 19 solo en
`src/components/react/` · `motion` · Embla · astro-icon (lucide) · `@astrojs/sitemap`.

## Desarrollo

```powershell
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # dist/ (sitio estático + sitemap-index.xml)
pnpm preview
```

## Desplegar

`.\scripts\deploy.ps1 [--dry-run]` publica `dist/` en `~/cappixtremo.com` (nunca en
`public_html/`). Independiente del API y del portal. Guía: [scripts/README.md](scripts/README.md)
y [../docs/despliegue.md](../docs/despliegue.md).

## Documentación

| Documento | Contenido |
| --- | --- |
| [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md) | Stack, carpetas, anatomía de una página, hidratación |
| [docs/VISTAS.md](docs/VISTAS.md) | Rutas y patrón de cada página |
| [docs/SISTEMA-DISENO.md](docs/SISTEMA-DISENO.md) | Tokens, tipografía, componentes |
| [docs/LAYOUT-PRINCIPAL.md](docs/LAYOUT-PRINCIPAL.md) | Header, footer y layout global |
