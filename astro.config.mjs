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

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), icon(), sitemap()],
});