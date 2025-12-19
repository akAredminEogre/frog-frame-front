// Rule 2: else句を使用しないこと
// See: docs/coding-standards/src/object-oriented-nine-rules.md

export default {
  files: ['**/frameworks-and-drivers/browser/**/*.ts'],
  rules: {
    'no-else-return': ['error', { allowElseIf: false }],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'IfStatement > .alternate',
        message: 'else clause is not allowed (Rule 2: else句を使用しないこと)',
      },
    ],
  },
};
