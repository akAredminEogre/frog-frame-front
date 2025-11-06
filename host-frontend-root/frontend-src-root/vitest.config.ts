import { defineConfig } from 'vitest/config';
import { WxtVitest } from 'wxt/testing';
import path from 'path';

export default defineConfig({
  plugins: [WxtVitest()],
  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src'),
      'tests': path.resolve(__dirname, './tests')
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    // tests/ ディレクトリのVitestテストファイルのみを対象とする
    include: ['tests/**/*.test.ts'],
    // Playwrightテストファイルとnode_modulesを明示的に除外
    exclude: ['**/*.spec.ts', 'e2e/**/*', 'node_modules/**/*'],
    // tsyringeのreflect-metadataをグローバルに設定
    setupFiles: ['reflect-metadata']
  },
});
