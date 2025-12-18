// React and React Hooks rules

export default {
  files: ['**/*.{ts,tsx,js,jsx}'],
  rules: {
    // React settings
    'react/react-in-jsx-scope': 'off', // Not required for React 17+
    'react/prop-types': 'off', // Not needed with TypeScript

    // React Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
