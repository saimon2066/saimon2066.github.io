import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// IMPORTANT for GitHub Pages:
//  - repo named "saimon2066.github.io"  -> base: '/'
//  - repo named anything else (e.g. "portfolio") -> base: '/'
// Wrong base = blank page with 404s on the JS/CSS files.
export default defineConfig({
  plugins: [react()],
  base: '/'
});
