import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  // Évitez d'ajouter des options hmr directement ici
  // Si vous avez besoin de configurer le HMR, utilisez :
  server: {
    // Options du serveur ici
  }
});