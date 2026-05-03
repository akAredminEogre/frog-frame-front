// Rule 2: else句禁止 — switch-case使用禁止
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
            'switch-case is not allowed (Rule 2: else句禁止/switch-case分離). Use early return, guard clauses, or polymorphism instead.',
        },
      ],
    },
  },
];
