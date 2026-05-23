import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    // Unit tests only — Playwright owns e2e under tests/e2e.
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
});
