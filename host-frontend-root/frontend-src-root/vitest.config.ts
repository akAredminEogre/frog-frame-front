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
    // テスト実行前にモックを設定（@webext-core/proxy-service対応）
    setupFiles: ['./tests/setup.ts'],
    // tests/ ディレクトリのVitestテストファイルのみを対象とする（.tsx含む）
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    // Playwrightテストファイルとnode_modulesを明示的に除外
    exclude: ['**/*.spec.ts', 'e2e/**/*', 'node_modules/**/*']
  },
});
