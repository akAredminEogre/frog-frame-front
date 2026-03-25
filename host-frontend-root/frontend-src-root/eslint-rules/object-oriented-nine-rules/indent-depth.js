// Rule 1: インデント1段階 — ネスト深度制限
// 閾値定義:
//   - 深度2以上: warning
//   - switch-case使用禁止: error
//   - try-catch内: 深度5以上でerror（TryStatement自体が深度1にカウントされるため、内部で4段ネスト可能）
//   - それ以外: 深度4以上でerror
// Note: ESLint max-depth は1設定のみ有効。warningとerrorの複合閾値は
//       別途カスタムルール実装が必要。現時点では warning 閾値(depth>=2)を設定。
// See: docs/coding-standards/src/object-oriented-nine-rules.md

export default [
  {
    // 深度2以上: warning（全対象ファイル）
    files: [
      '**/frameworks-and-drivers/browser/**/*.ts',
      '**/application-business-rules/interactors/**/*.ts',
    ],
    rules: {
      // 深度2以上: warning
      // try-catch内は TryStatement 自体が深度1カウントされるため、
      // 内部では最大4段ネストまで許容（= 全体深度5 → エラー閾値に相当）
      'max-depth': ['warn', 1],
    },
  },
  {
    // switch-case使用禁止: error
    files: [
      '**/frameworks-and-drivers/browser/**/*.ts',
      '**/application-business-rules/interactors/**/*.ts',
    ],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'SwitchStatement',
          message:
            'switch-case is not allowed (Rule 1: インデント1段階). Use if/else or polymorphism instead.',
        },
      ],
    },
  },
];
