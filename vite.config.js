import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
  ],
  build: {
    // Increase the warning limit if your app has large assets
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // Split vendor code into smaller chunks (separate big libs like lottie)
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lottie-web') || id.includes('react-lottie-player')) {
              return 'vendor_lottie';
            }
            return 'vendor';
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      // Use the lighter lottie build that avoids expression eval
      'lottie-web': 'lottie-web/build/player/lottie_light.js',
    },
  },
});