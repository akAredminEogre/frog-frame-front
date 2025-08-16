import { defineConfig } from 'vitest/config';
import { WxtVitest } from 'wxt/testing';
import path from 'path';

export default defineConfig({
  plugins: [WxtVitest()],
  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src')
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    // Vitestテストファイルのみを対象とする
    include: ['**/*.test.ts'],
    // Playwrightテストファイルとnode_modulesを明示的に除外
    exclude: ['**/*.spec.ts', 'e2e/**/*', 'node_modules/**/*']
  },
});
