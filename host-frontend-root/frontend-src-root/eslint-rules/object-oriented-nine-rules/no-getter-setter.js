// Rule 9: Getter、Setter、プロパティを使用しないこと
// See: docs/coding-standards/src/object-oriented-nine-rules.md

export default {
  files: ['**/frameworks-and-drivers/browser/**/*.ts'],
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: 'MethodDefinition[kind="get"]',
        message: 'Getter is not allowed (Rule 9: Getter、Setter、プロパティを使用しないこと)',
      },
      {
        selector: 'MethodDefinition[kind="set"]',
        message: 'Setter is not allowed (Rule 9: Getter、Setter、プロパティを使用しないこと)',
      },
    ],
  },
};
