// Rule 6: エンティティを小さく — メソッド行数・ファイル行数制限
// 閾値定義:
//   - メソッド100行超: error
//   - ファイル300行超: error
// Note: ESLint flat config では同一ルール・同一ファイル対象に warn→error の2段階 severity を
//       設定しても後発エントリが先行エントリを上書きするため実現不可。
//       warn 段階（メソッド10行・ファイル80行）は別途カスタムルール化で補完すること。
// See: docs/coding-standards/src/object-oriented-nine-rules.md

const TARGET_FILES = [
  '**/frameworks-and-drivers/browser/**/*.ts',
  '**/application-business-rules/interactors/**/*.ts',
];

export default [
  {
    // error閾値: メソッド100行超 / ファイル300行超
    files: TARGET_FILES,
    rules: {
      'max-lines-per-function': ['error', { max: 100, skipBlankLines: true, skipComments: true }],
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
    },
  },
];
