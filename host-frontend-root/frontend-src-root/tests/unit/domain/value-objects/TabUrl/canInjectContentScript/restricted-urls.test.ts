import { TabUrl } from 'src/domain/value-objects/TabUrl';
import { describe, it, expect } from 'vitest';

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
      url: 'https://chrome.google.com/webstore/',
      expected: false,
    },
    {
      name: 'should return false for Chrome Web Store extension page',
      url: 'https://chrome.google.com/webstore/detail/extension-name/abcdefghijklmnop',
      expected: false,
    },
    {
      name: 'should return false for Chrome Web Store category page',
      url: 'https://chrome.google.com/webstore/category/extensions',
      expected: false,
    },
    {
      name: 'should return true for other Google domains',
      url: 'https://google.com',
      expected: true,
    },
    {
      name: 'should return true for other chrome.google.com URLs',
      url: 'https://chrome.google.com/docs',
      expected: true,
    },
  ];

  testCases.forEach(({ name, url, expected }) => {
    it(name, () => {
      const tabUrl = new TabUrl(url);
      expect(tabUrl.canInjectContentScript()).toBe(expected);
    });
  });
});
