/**
 * Tabs.constructor - フィルタリングテスト
 *
 * 1. urlがundefinedのタブを除外
 * 2. idがundefinedのタブを除外
 * 3. url/id両方undefinedのタブを除外
 * 4. 有効/無効タブが混在するケース
 */
import { createMockRule } from 'tests/unit/frameworks-and-drivers/browser/Tabs/mocks/createMockRule';
import { createMockTab } from 'tests/unit/frameworks-and-drivers/browser/Tabs/mocks/createMockTab';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Tabs } from 'src/frameworks-and-drivers/browser/Tabs';

describe('Tabs.constructor - フィルタリング', () => {
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
      description: 'urlがundefinedのタブは除外される',
      input: {
        tabsRemained: [createMockTab(2, 'https://example.com')],
        tabsEliminated: [createMockTab(1, undefined)],
      },
      expected: {
        remainedIds: [2],
        eliminatedIds: [1],
      },
    },
    {
      description: 'idがundefinedのタブは除外される',
      input: {
        tabsRemained: [createMockTab(2, 'https://test.com')],
        tabsEliminated: [createMockTab(undefined, 'https://example.com')],
      },
      expected: {
        remainedIds: [2],
        // idがundefinedのため、not.toHaveBeenCalledWithでは検証できない
        eliminatedIds: [],
      },
    },
    {
      description: 'url/id両方undefinedのタブは除外される',
      input: {
        tabsRemained: [createMockTab(2, 'https://example.com')],
        tabsEliminated: [createMockTab(undefined, undefined)],
      },
      expected: {
        remainedIds: [2],
        // idがundefinedのため、not.toHaveBeenCalledWithでは検証できない
        eliminatedIds: [],
      },
    },
    {
      description: '有効/無効タブが混在する場合、有効タブのみ保持される',
      input: {
        tabsRemained: [
          createMockTab(1, 'https://example.com'),
          createMockTab(4, 'https://valid.com'),
        ],
        tabsEliminated: [
          createMockTab(undefined, 'https://no-id.com'),
          createMockTab(3, undefined),
          createMockTab(undefined, undefined),
        ],
      },
      expected: {
        remainedIds: [1, 4],
        eliminatedIds: [3],
      },
    },
  ];

  /**
   * 検証方法について:
   * Tabs.tabsはprivate readonlyのため、テストから直接アクセスできない。
   * reloadAllを実行し、chrome.tabs.reloadの呼び出し引数でconstructorのフィルタリング結果を検証する:
   * - remainedIds: reloadが呼ばれるべきタブID（url/id両方存在するタブ）
   * - eliminatedIds: reloadが呼ばれないべきタブID（idが存在するがurlがundefinedのタブ）
   *
   * 注: idがundefinedのタブはnot.toHaveBeenCalledWithで検証できないため、
   * eliminatedIdsにはidが存在するタブのみを含める。
   */
  it.each(testCases)('$description', async ({ input, expected }) => {
    // Arrange
    const tabsArray = [...input.tabsRemained, ...input.tabsEliminated];
    const matchingUrls = input.tabsRemained.map((tab) => tab.url!);
    const rule = createMockRule(matchingUrls);

    // Act
    const tabs = new Tabs(tabsArray);

    // Assert - filterByRuleで有効URLにマッチするタブを取得し、reloadAllで検証
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
