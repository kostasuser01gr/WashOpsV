import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    exclude: ['node_modules/**', 'dist/**', 'coverage/**', 'tests/**', '**/*.e2e.{ts,tsx,js,jsx}'],
    coverage: {
      provider: 'v8',
    },
  },
});
