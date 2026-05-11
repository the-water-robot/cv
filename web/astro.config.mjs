import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://the-water-robot.github.io",
  base: "/cv",
  integrations: [react(), sitemap()],
  output: "static",
  i18n: {
    defaultLocale: "it",
    locales: ["it", "en"],
    routing: { prefixDefaultLocale: true },
  },
});
