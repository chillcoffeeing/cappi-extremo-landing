// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: "https://www.cappixtremo.com",

  // F-060 (fe-A-21): alias legacy documentado en docs/VISTAS.md; antes daba 404.
  // En build estático Astro genera una página con meta refresh + canonical.
  redirects: {
    "/planes-vacacionales": "/plan-vacacional",
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), icon(), sitemap()],
});