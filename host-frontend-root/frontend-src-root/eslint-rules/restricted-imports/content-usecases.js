// contentOnMessageReceived UseCases: prohibit IChromeTabsService import
// Content script context cannot use chrome.tabs API (only available in extension pages)

export default {
  files: ['**/usecases/contentOnMessageReceived/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/IChromeTabsService', '**/IChromeTabsService.ts'],
            message: 'contentOnMessageReceived UseCases cannot use IChromeTabsService. chrome.tabs API is not available in Content Script context.',
          },
        ],
      },
    ],
  },
};
