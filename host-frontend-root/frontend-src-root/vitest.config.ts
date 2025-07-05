import { defineConfig } from 'vitest/config';
import { WxtVitest } from 'wxt/testing';

export default defineConfig({
  plugins: [WxtVitest()],
  test: {
    globals: true,
    // Vitestテストファイルのみを対象とする
    include: ['**/*.test.ts'],
    // Playwrightテストファイルとnode_modulesを明示的に除外
    exclude: ['**/*.spec.ts', 'e2e/**/*', 'node_modules/**/*']
  },
});
