/**
 * Tabs.constructor - 正常系テスト
 *
 * 1. 有効なタブのみで初期化
 * 2. 空配列で初期化
 * 3. 単一タブで初期化
 *
 * 検証方法: filterByRuleで特定URLにマッチするタブを抽出し、
 * そのタブ数が期待値と一致することを確認
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Tabs } from 'src/frameworks-and-drivers/browser/Tabs';

import { createMockRule } from '../mocks/createMockRule';
import { createMockTab } from '../mocks/createMockTab';

describe('Tabs.constructor - 正常系', () => {
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
      description: '有効なタブのみで初期化した場合、全タブが保持される',
      input: [
        createMockTab(1, 'https://example.com'),
        createMockTab(2, 'https://test.com'),
      ],
      matchingUrls: ['https://example.com', 'https://test.com'],
      expectedTabCount: 2,
    },
    {
      description: '空配列で初期化した場合、タブは0件',
      input: [],
      matchingUrls: [],
      expectedTabCount: 0,
    },
    {
      description: '単一タブで初期化した場合、1件のタブが保持される',
      input: [createMockTab(1, 'https://example.com')],
      matchingUrls: ['https://example.com'],
      expectedTabCount: 1,
    },
  ];

  it.each(testCases)('$description', async ({ input, matchingUrls, expectedTabCount }) => {
    // Arrange
    const rule = createMockRule(matchingUrls);

    // Act
    const tabs = new Tabs(input);

    // Assert - filterByRuleで全URLにマッチするタブを取得し、reloadAllで数を検証
    const filtered = tabs.filterByRule(rule);
    await filtered.reloadAll();
    expect(mockReload).toHaveBeenCalledTimes(expectedTabCount);
  });
});
