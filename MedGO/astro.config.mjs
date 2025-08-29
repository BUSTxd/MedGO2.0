// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  devToolbar: { enabled: false },
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'firebase': ['@firebase/app', '@firebase/auth', '@firebase/firestore']
          }
        }
      }
    }
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },
  compressHTML: true
});