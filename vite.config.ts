import path from "path";
import { defineConfig } from "vite";
//import { VitePWA } from "vite-plugin-pwa";
import changelog from "./plugins/changelog.js";

export default defineConfig({
  plugins: [
    changelog(),
    /*VitePWA({
      devOptions: {
        enabled: true,
      },
    }),*/
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./assets"),
      "@pages": path.resolve(__dirname, "./data/pages"),
    },
  },
});
