/**
 * Tabs.constructor - 正常系テスト
 *
 * 1. 有効なタブのみで初期化
 * 2. 空配列で初期化
 * 3. 単一タブで初期化
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
      input: {
        tabsRemained: [
          createMockTab(1, 'https://example.com'),
          createMockTab(2, 'https://test.com'),
        ],
        tabsEliminated: [],
      },
      expected: {
        remainedIds: [1, 2],
        eliminatedIds: [],
      },
    },
    {
      description: '空配列で初期化した場合、タブは0件',
      input: {
        tabsRemained: [],
        tabsEliminated: [],
      },
      expected: {
        remainedIds: [],
        eliminatedIds: [],
      },
    },
    {
      description: '単一タブで初期化した場合、1件のタブが保持される',
      input: {
        tabsRemained: [createMockTab(1, 'https://example.com')],
        tabsEliminated: [],
      },
      expected: {
        remainedIds: [1],
        eliminatedIds: [],
      },
    },
  ];

  /**
   * 検証方法について:
   * Tabs.tabsはprivate readonlyのため、テストから直接アクセスできない。
   * reloadAllを実行し、chrome.tabs.reloadの呼び出し引数でconstructorの結果を検証する:
   * - remainedIds: reloadが呼ばれるべきタブID（constructorで保持されたタブ）
   * - eliminatedIds: reloadが呼ばれないべきタブID（constructorで除外されたタブ）
   */
  it.each(testCases)('$description', async ({ input, expected }) => {
    // Arrange
    const tabsArray = [...input.tabsRemained, ...input.tabsEliminated];
    const matchingUrls = input.tabsRemained.map((tab) => tab.url!);
    const rule = createMockRule(matchingUrls);

    // Act
    const tabs = new Tabs(tabsArray);

    // Assert - filterByRuleで全URLにマッチするタブを取得し、reloadAllで検証
    const filtered = tabs.filterByRule(rule);
    await filtered.reloadAll();

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
