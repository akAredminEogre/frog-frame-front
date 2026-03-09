import { defineConfig } from 'vitest/config';
import { WxtVitest } from 'wxt/testing';
import path from 'path';

// WSL2環境の検出（WSL_DISTRO_NAMEはWSL2でのみ設定される）
const isWSL2 =
  process.env.CI === undefined &&
  process.env.WSL_DISTRO_NAME !== undefined;

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
    // tests/ ディレクトリのVitestテストファイル（.ts, .tsx形式）を対象とする
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    // Playwrightテストファイルとnode_modulesを明示的に除外
    exclude: ['**/*.spec.ts', 'e2e/**/*', 'node_modules/**/*'],
    pool: 'forks',
    poolOptions: {
      forks: {
        maxForks: isWSL2 ? 2 : undefined,
      },
    }
  },
});
