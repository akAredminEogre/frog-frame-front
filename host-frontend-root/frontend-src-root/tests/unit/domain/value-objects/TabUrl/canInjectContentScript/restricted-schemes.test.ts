import { TabUrl } from 'src/domain/value-objects/TabUrl';
import { describe, it, expect } from 'vitest';

/**
 * Tests for TabUrl.canInjectContentScript() - Restricted scheme cases
 *
 * These tests verify that canInjectContentScript() returns false for URLs with
 * restricted schemes where content scripts cannot be injected.
 */
describe('TabUrl.canInjectContentScript() - Restricted schemes', () => {
  const testCases = [
    {
      name: 'should return false for chrome:// URL',
      url: 'chrome://extensions/',
      expected: false,
    },
    {
      name: 'should return false for chrome:// URL with errors parameter',
      url: 'chrome://extensions/?errors=bdgnfbfnmjofkhbooelohnpgcoieiclh',
      expected: false,
    },
    {
      name: 'should return false for chrome-extension:// URL',
      url: 'chrome-extension://abcdefghijklmnopqrstuvwxyz/popup.html',
      expected: false,
    },
  ];

  testCases.forEach(({ name, url, expected }) => {
    it(name, () => {
      const tabUrl = new TabUrl(url);
      expect(tabUrl.canInjectContentScript()).toBe(expected);
    });
  });
});
