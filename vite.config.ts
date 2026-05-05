import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf-8"),
) as { version: string };

export default defineConfig({
  plugins: [react(), tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'BeeConnect',
        short_name: 'BeeConnect',
        description: 'BeeConnect App',
        theme_color: '#fbbf24',
        background_color: '#fffbeb',
        display: 'standalone',
        icons: [
          {
            src: '/favicon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/favicon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  base: "/",
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
});
