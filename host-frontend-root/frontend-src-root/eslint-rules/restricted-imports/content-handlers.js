// Content handlers: prohibit main container import
// Content script should use contentContainer with ChromeRuntimeRewriteRuleRepository

export default {
  files: ['**/handlers/content/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/di/container', '**/di/container.ts'],
            message: 'Content handlers must use "contentContainer" (not "container"). container is for Background Script only.',
          },
        ],
      },
    ],
  },
};
