// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import 'dotenv/config';
import alpinejs from '@astrojs/alpinejs';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  vite: {
      build: {
          target: 'esnext',
      },
      plugins: [tailwindcss(), alpinejs()],
  },

  output: 'server',
  adapter: netlify(),
});