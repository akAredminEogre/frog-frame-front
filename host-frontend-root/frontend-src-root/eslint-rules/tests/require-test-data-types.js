// Require explicit type annotations for test case arrays
// Enforces type safety for test data to catch typos and type mismatches at compile time

export default {
  files: ['tests/integration/**/*.test.ts', 'tests/integration/**/*.test.tsx'],
  rules: {
    '@typescript-eslint/typedef': [
      'warn',
      {
        variableDeclaration: true,
        variableDeclarationIgnoreFunction: true,
      },
    ],
  },
};
