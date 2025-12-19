// General ESLint rules

export default {
  files: ['**/*.{ts,tsx,js,jsx}'],
  rules: {
    'no-console': 'off', // Allow console during development
    'no-debugger': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'no-unused-vars': 'off', // Use TypeScript version instead
    'no-undef': 'off', // Disabled for early development stage
  },
};
