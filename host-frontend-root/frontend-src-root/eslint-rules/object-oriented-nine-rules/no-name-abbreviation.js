// Rule 5: 名前を省略しないこと — 識別子名の最低文字数制限
// 例外: forループ変数（i, j, k）、catch節変数（e）
// See: docs/coding-standards/src/object-oriented-nine-rules.md

export default {
  files: [
    '**/frameworks-and-drivers/browser/**/*.ts',
    '**/application-business-rules/interactors/**/*.ts',
  ],
  rules: {
    'id-length': ['warn', { min: 3, exceptions: ['i', 'j', 'k', 'e'] }],
  },
};
