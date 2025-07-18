// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { qrcode } from "vite-plugin-qrcode";
import AstroPWA from "@vite-pwa/astro";

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
  devToolbar: {
    enabled: false,
  },
  integrations: [
    AstroPWA({
      mode: "development",
      base: "/",
      scope: "/",
      includeAssets: ["favicon.ico"],
      registerType: "autoUpdate",
      manifest: {
        name: "Moodle",
        short_name: "Moodle",
        theme_color: "oklch(0.85 0.2 84.36)",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{css,js,html,svg,png,ico,txt}"],
        skipWaiting: true,
        clientsClaim: true,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
});
