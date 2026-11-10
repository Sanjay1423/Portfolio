// @ts-check
import { defineConfig } from 'astro/config';

// Gate 2: GitHub Pages project site. The base path is case-sensitive.
export default defineConfig({
  site: 'https://sanjay1423.github.io',
  base: '/Portfolio',
  output: 'static',
  build: {
    // Inline the (small) stylesheet so it does not block first paint with an extra request.
    inlineStylesheets: 'always',
  },
  devToolbar: { enabled: false },
});
