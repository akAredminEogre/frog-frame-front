/**
 * Tabs.filterByRule - エッジケーステスト
 *
 * 1. 空のTabs: タブ0件に対して実行
 * 2. 単一タブマッチ: 1件のみでマッチ
 * 3. 単一タブ不一致: 1件のみで不一致
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Tabs } from 'src/frameworks-and-drivers/browser/Tabs';

import { createMockRule } from '../mocks/createMockRule';
import { createMockTab } from '../mocks/createMockTab';

describe('Tabs.filterByRule - エッジケース', () => {
  const mockReload = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('chrome', {
      tabs: {
        reload: mockReload,
      },
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllGlobals();
  });

  const testCases = [
    {
      description: '空のTabs: エラーなく空のTabsを返す',
      input: [],
      matchingUrls: ['https://example.com'],
      expectedReloadCount: 0,
    },
    {
      description: '単一タブマッチ: 1件がフィルタリング結果に含まれる',
      input: [createMockTab(1, 'https://example.com')],
      matchingUrls: ['https://example.com'],
      expectedReloadCount: 1,
    },
    {
      description: '単一タブ不一致: フィルタリング結果は空',
      input: [createMockTab(1, 'https://example.com')],
      matchingUrls: ['https://nomatch.com'],
      expectedReloadCount: 0,
    },
  ];

  it.each(testCases)('$description', async ({ input, matchingUrls, expectedReloadCount }) => {
    // Arrange
    const tabs = new Tabs(input);
    const rule = createMockRule(matchingUrls);

    // Act
    const filtered = tabs.filterByRule(rule);
    await filtered.reloadAll();

    // Assert - reloadAllの呼び出し回数でフィルタリング結果のタブ数を検証
    expect(filtered).toBeInstanceOf(Tabs);
    expect(mockReload).toHaveBeenCalledTimes(expectedReloadCount);
  });
});
