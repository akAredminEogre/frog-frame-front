// Background handlers: prohibit contentContainer import
// Background script should use the main container with DexieRewriteRuleRepository

export default {
  files: ['**/handlers/background/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/contentContainer', '**/contentContainer.ts'],
            message: 'Background handlers must use "container" (not "contentContainer"). contentContainer is for Content Script only.',
          },
        ],
      },
    ],
  },
};
