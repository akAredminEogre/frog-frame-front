// Frameworks and Drivers UI Atoms import restrictions
// See: docs/coding-standards/src/frameworks-and-drivers/ui/components.md
//
// Atoms must not import entity or value-object types from domain layer

export default {
  files: ['**/components/atoms/**/*.tsx', '**/components/atoms/**/*.ts'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/domain/entities/**', '**/domain/value-objects/**'],
            message:
              'Atoms must only use primitive types. Entity/ValueObject imports are not allowed.',
          },
        ],
      },
    ],
  },
};
