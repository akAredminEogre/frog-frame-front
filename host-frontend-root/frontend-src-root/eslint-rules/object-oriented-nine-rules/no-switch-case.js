// Rule 1: インデント1段階 — switch-case使用禁止
// See: docs/coding-standards/src/object-oriented-nine-rules.md

export default [
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
