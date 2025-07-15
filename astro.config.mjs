// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { qrcode } from "vite-plugin-qrcode";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss(), qrcode()],
  },
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Moirai One",
        cssVariable: "--font-moodle",
      },
    ],
  },
});
