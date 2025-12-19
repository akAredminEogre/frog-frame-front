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
      input: {
        tabsRemained: [],
        tabsEliminated: [],
        matchingUrls: ['https://example.com'],
      },
      expected: {
        remainedIds: [],
        eliminatedIds: [],
      },
    },
    {
      description: '単一タブマッチ: 1件がフィルタリング結果に含まれる',
      input: {
        tabsRemained: [createMockTab(1, 'https://example.com')],
        tabsEliminated: [],
        matchingUrls: ['https://example.com'],
      },
      expected: {
        remainedIds: [1],
        eliminatedIds: [],
      },
    },
    {
      description: '単一タブ不一致: フィルタリング結果は空',
      input: {
        tabsRemained: [],
        tabsEliminated: [createMockTab(1, 'https://example.com')],
        matchingUrls: ['https://nomatch.com'],
      },
      expected: {
        remainedIds: [],
        eliminatedIds: [1],
      },
    },
  ];

  /**
   * 検証方法について:
   * Tabs.tabsはprivate readonlyのため、テストから直接アクセスできない。
   * reloadAllを実行し、chrome.tabs.reloadの呼び出し引数でフィルタリング結果を検証する:
   * - remainedIds: reloadが呼ばれるべきタブID
   * - eliminatedIds: reloadが呼ばれないべきタブID
   */
  it.each(testCases)('$description', async ({ input, expected }) => {
    // Arrange
    const tabsArray = [...input.tabsRemained, ...input.tabsEliminated];
    const tabs = new Tabs(tabsArray);
    const rule = createMockRule(input.matchingUrls);

    // Act
    const filtered = tabs.filterByRule(rule);
    await filtered.reloadAll();

    // Assert - 戻り値の型を検証
    expect(filtered).toBeInstanceOf(Tabs);

    // Assert - 残るべきタブがreloadされたことを検証
    for (const id of expected.remainedIds) {
      expect(mockReload).toHaveBeenCalledWith(id);
    }

    // Assert - 除外されるべきタブがreloadされていないことを検証
    for (const id of expected.eliminatedIds) {
      expect(mockReload).not.toHaveBeenCalledWith(id);
    }
  });
});
