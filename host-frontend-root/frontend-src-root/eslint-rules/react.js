// React and React Hooks rules

export default {
  files: ['**/*.{ts,tsx,js,jsx}'],
  rules: {
    // React rules (React-specific ESLint rules; React settings like `settings.react.version` are defined in base.js)
    'react/react-in-jsx-scope': 'off', // Not required for React 17+
    'react/prop-types': 'off', // Not needed with TypeScript

    // React Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
