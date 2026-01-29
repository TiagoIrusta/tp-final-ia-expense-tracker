import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [], // Lo dejamos vacío para hacerlo simple
  },
});