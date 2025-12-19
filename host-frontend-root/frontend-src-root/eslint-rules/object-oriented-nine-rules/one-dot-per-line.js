// Rule 4: 1行につきドットは1つまでにすること
// 除外パターン: chrome APIの呼び出しコード
// See: docs/coding-standards/src/object-oriented-nine-rules.md

export default {
  files: ['**/frameworks-and-drivers/browser/**/*.ts'],
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        // メソッドチェーン（a.b.c()）を検出、ただしchrome.xxx.yyyは除外
        selector: 'CallExpression > MemberExpression > MemberExpression:not([object.object.name="chrome"])',
        message: 'Method chaining with more than one dot is not allowed (Rule 4: 1行につきドットは1つまで). Exception: chrome API calls.',
      },
    ],
  },
};
