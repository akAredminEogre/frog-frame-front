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

    // React Aria rules
    'no-restricted-syntax': [
      'error',
      {
        selector:
          "JSXOpeningElement[name.name='FocusScope'] > JSXAttribute[name.name='autoFocus']",
        message:
          'FocusScopeのautoFocusは使用しないでください。手動useEffectで初期フォーカスを設定してください。詳細: docs/coding-standards/src/frameworks-and-drivers/ui/react-hooks/react-aria-integration.md',
      },
    ],
  },
};
