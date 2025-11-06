import { describe, expect,it } from 'vitest';

import { TabUrl } from 'src/domain/value-objects/TabUrl';

/**
 * Tests for TabUrl.canInjectContentScript() - Restricted URL cases
 *
 * These tests verify that canInjectContentScript() returns false for specific URLs
 * where content scripts cannot be injected (e.g., Chrome Web Store).
 */
describe('TabUrl.canInjectContentScript() - Restricted URLs', () => {
  const testCases = [
    {
      name: 'should return false for Chrome Web Store URL',
      url: 'https://chromewebstore.google.com/',
      expected: false,
    },
    {
      name: 'should return false for Chrome Web Store extension page',
      url: 'https://chromewebstore.google.com/detail/extension-name/abcdefghijklmnop',
      expected: false,
    },
    {
      name: 'should return false for Chrome Web Store category page',
      url: 'https://chromewebstore.google.com/category/extensions',
      expected: false,
    },
    {
      name: 'should return true for other Google domains',
      url: 'https://google.com',
      expected: true,
    }
  ];

  testCases.forEach(({ name, url, expected }) => {
    it(name, () => {
      const tabUrl = new TabUrl(url);
      expect(tabUrl.canInjectContentScript()).toBe(expected);
    });
  });
});
