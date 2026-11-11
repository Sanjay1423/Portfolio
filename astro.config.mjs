// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages user site. The repository must be named sanjay1423.github.io.
export default defineConfig({
  site: 'https://sanjay1423.github.io',
  base: '/',
  output: 'static',
  build: {
    // Inline the (small) stylesheet so it does not block first paint with an extra request.
    inlineStylesheets: 'always',
  },
  devToolbar: { enabled: false },
});
