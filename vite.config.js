import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/api/tmdb": {
        target: "https://api.themoviedb.org",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/tmdb/, "/3"),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader(
              "Authorization",
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOWFhM2I1ZDBlMjk2NGMzZmNhMjFlNGNlYzRjMTQ0NSIsIm5iZiI6MTc0OTk5ODM5MS43NDEsInN1YiI6IjY4NGVkYjM3MDBlYmI2Y2E3ZjFiZjNkYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.I88LaleX844d4jdnIIYUs1ZOoZ3J_zWhY9Mdv50on0w",
            );
            proxyReq.setHeader("accept", "application/json");
          });
        },
      },
    },
  },
});
