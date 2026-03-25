// Rule 6: エンティティを小さく — メソッド行数・クラス行数制限
// 閾値定義:
//   - メソッド10行超: warning
//   - メソッド100行超: error
//   - クラス80行超: warning
//   - クラス300行超: error
// See: docs/coding-standards/src/object-oriented-nine-rules.md

const TARGET_FILES = [
  '**/frameworks-and-drivers/browser/**/*.ts',
  '**/application-business-rules/interactors/**/*.ts',
];

export default [
  {
    // warning閾値: メソッド10行超 / クラス80行超
    files: TARGET_FILES,
    rules: {
      'max-lines-per-function': ['warn', { max: 10, skipBlankLines: true, skipComments: true }],
      'max-lines': ['warn', { max: 80, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    // error閾値: メソッド100行超 / クラス300行超
    files: TARGET_FILES,
    rules: {
      'max-lines-per-function': ['error', { max: 100, skipBlankLines: true, skipComments: true }],
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
    },
  },
];
