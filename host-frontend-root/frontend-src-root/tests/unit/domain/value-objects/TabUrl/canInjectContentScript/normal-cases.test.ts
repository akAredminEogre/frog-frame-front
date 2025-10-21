import { TabUrl } from 'src/domain/value-objects/TabUrl';
import { describe, it, expect } from 'vitest';

/**
 * Tests for TabUrl.canInjectContentScript() - Normal cases
 *
 * These tests verify that canInjectContentScript() returns true for URLs where
 * content scripts can be injected (http://, https://, ftp://).
 */
describe('TabUrl.canInjectContentScript() - Normal cases', () => {
  const testCases = [
    {
      name: 'should return true for http:// URL',
      url: 'http://example.com',
      expected: true,
    },
    {
      name: 'should return true for https:// URL',
      url: 'https://example.com',
      expected: true,
    },
    {
      name: 'should return true for http:// URL with path',
      url: 'http://example.com/path/to/page',
      expected: true,
    },
    {
      name: 'should return true for https:// URL with query params',
      url: 'https://example.com/page?param=value',
      expected: true,
    },
    {
      name: 'should return true for https:// URL with hash',
      url: 'https://example.com/page#section',
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
