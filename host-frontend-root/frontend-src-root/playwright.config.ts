import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ESモジュールで__dirnameの代替を作成
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // Playwright のテストを置くディレクトリ
  testDir: './e2e',

  // .spec.tsファイルのみを対象とする
  testMatch: '**/*.spec.ts',

  // Vitest のテストフォルダを完全に無視
  // ※必要に応じて他のパターンも追加してください
  forbidOnly: !!process.env.CI,
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,

  // テスト実行時のブラウザセット
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
        channel: 'chromium',
        launchOptions: {
          args: [
            `--disable-extensions-except=${path.resolve(__dirname, '.output/chrome-mv3-dev')}`,
            `--load-extension=${path.resolve(__dirname, '.output/chrome-mv3-dev')}`
          ]
        }
      },
    },
  ],

  // Vitest のファイルを無視
  // （e2e/testDir に置かないだけでも OK ですが、念のため）
  testIgnore: [
    '**/utils/**',
    '**/__tests__/**'
  ],

  // テストレポート出力など必要に応じて追記
});
