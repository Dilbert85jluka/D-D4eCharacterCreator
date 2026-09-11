import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { version } from './package.json';

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // 'prompt', not 'autoUpdate': autoUpdate swaps the worker silently while the
      // open page keeps running the old bundle, with nothing on screen to say so.
      // UpdatePrompt.tsx surfaces it instead — the two must stay in sync, since
      // under 'autoUpdate' the worker self-activates and `needRefresh` never fires.
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'icons/*.png'],
      manifest: {
        name: 'D&D 4e Character Creator',
        short_name: 'DnD4e',
        description: 'Offline D&D 4th Edition character creator for tablets',
        theme_color: '#1a0a00',
        background_color: '#f5e6c8',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        categories: ['games', 'utilities'],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Per-FILE ceiling, not a total. Any single file above this is silently
        // dropped from the precache — the build still succeeds and offline
        // support just stops working for that asset. Keeping the limit at 2 MB
        // alongside the manualChunks split below means a data file that grows
        // past its chunk budget fails loudly here instead of quietly breaking
        // offline months later.
        maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        /**
         * Split the static rulebook data out of the entry chunk.
         *
         * src/data is ~6.8 MB of source — monsters, the magic item compendium,
         * equipment and powers — which all landed in one JS file, taking it to
         * 7.67 MiB against Workbox's 8 MiB per-file precache limit. Crossing
         * that limit produces no build error: the file is just excluded from
         * the precache and the app stops working offline.
         *
         * These are deliberately coarse, domain-aligned chunks rather than
         * per-file splits — every monster source is loaded together by
         * data/monsters/index.ts anyway, so finer granularity would add
         * requests without reducing what actually gets parsed.
         */
        manualChunks(id) {
          // Rollup ids use backslashes on Windows, where this project is developed.
          const path = id.replace(/\\/g, '/');

          // React, TipTap, Supabase and Dexie are ~1 MB and change only on a
          // dependency bump. Left in the entry chunk they shared its budget with
          // app code, leaving the file that grows fastest the least headroom.
          if (path.includes('/node_modules/')) return 'vendor';

          if (!path.includes('/src/data/')) return;
          // Monsters get one chunk PER SOURCE BOOK. All nine together are 2.1 MB,
          // and new books land here regularly (MM/MM2/MM3, DMG/DMG2, MV, MV:TttNV,
          // both Draconomicons). Per-book means the next import is its own chunk
          // instead of pushing a shared one over the precache ceiling.
          if (path.includes('/src/data/monsters/')) {
            const book = path.match(/\/src\/data\/monsters\/([^/]+)\.ts$/)?.[1];
            return book && book !== 'index' ? `data-monsters-${book}` : 'data-monsters';
          }
          // Magic item compendium: one chunk per category file, for the same
          // reason as monsters — 576 items today and it grows by import.
          if (path.includes('/src/data/magicItems/')) {
            const cat = path.match(/\/src\/data\/magicItems\/([^/]+)\.ts$/)?.[1];
            return cat && cat !== 'index' ? `data-magic-items-${cat}` : 'data-magic-items';
          }
          if (path.includes('/src/data/equipment/'))  return 'data-equipment';
          if (path.includes('/src/data/powers/'))     return 'data-powers';
          return 'data-rules';
        },
      },
    },
  },
});
