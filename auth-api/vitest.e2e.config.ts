import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      'src/**/*.e2e.spec.ts',
      'src/**/*.e2e-spec.ts',
      'src/http/controllers/auth/*.spec.ts',
    ],
    setupFiles: [],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
});
