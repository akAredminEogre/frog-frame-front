// Rule 1: インデント1段階 — ネスト深度制限（errorのみ）
// 閾値定義:
//   - try-catch内: 深度5以上でerror（TryStatement自体が深度1にカウントされるため、内部で4段ネスト可能）
//   - それ以外: 深度4以上でerror
// Note: ESLint max-depth は1設定のみ有効。try-catch内の緩和閾値(depth>=5)は
//       カスタムルール実装が必要。現時点では error 閾値(depth>=4)を設定。
// See: docs/coding-standards/src/object-oriented-nine-rules.md

export default [
  {
    // 深度4以上: error（全対象ファイル）
    files: [
      '**/frameworks-and-drivers/browser/**/*.ts',
      '**/application-business-rules/interactors/**/*.ts',
    ],
    rules: {
      // 深度4以上: error
      // try-catch内は TryStatement 自体が深度1カウントされるため、
      // 内部では最大4段ネストまで許容（= 全体深度5）が本来の設計意図だが、
      // ESLint max-depth では1閾値のみのため depth>=4 で error とする
      'max-depth': ['error', 3],
    },
  },
];
