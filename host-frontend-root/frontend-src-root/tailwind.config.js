/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // テストファイルのみをターゲット
    "./tests/e2e/test-pages/**/*.html",
    // プロダクションコードは除外
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Chrome拡張機能での競合を避ける
  },
  // E2Eテスト環境でのみ使用
  important: true,
}