import { defineConfig } from 'vitest/config';
import { WxtVitest } from 'wxt/testing';
import path from 'path';

// WSL環境の検出（CI環境を除外。WSL_DISTRO_NAMEはWSL/WSL2で設定される）
const isWSL =
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
    // WSL環境のみforks poolを使用してmaxForks=2に制限（CI・その他環境はデフォルト）
    ...(isWSL ? {
      pool: 'forks',
      poolOptions: {
        forks: {
          maxForks: 2,
        },
      },
    } : {}),
  },
});
