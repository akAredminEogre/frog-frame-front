/**
 * Tabs.filterByRule - 正常系テスト
 *
 * 1. 一部マッチ: 複数タブ中、一部のみマッチ
 * 2. 全マッチ: 全タブがルールにマッチ
 * 3. 全不一致: 全タブがルールに不一致
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Tabs } from 'src/frameworks-and-drivers/browser/Tabs';

import { createMockRule } from '../mocks/createMockRule';
import { createMockTab } from '../mocks/createMockTab';

describe('Tabs.filterByRule - 正常系', () => {
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
      description: '一部マッチ: マッチするタブのみがフィルタリングされる',
      input: {
        tabsRemained: [
          createMockTab(1, 'https://example.com'),
          createMockTab(2, 'https://test.com'),
        ],
        tabsEliminated: [createMockTab(3, 'https://other.com')],
        matchingUrls: ['https://example.com', 'https://test.com'],
      },
      expected: {
        remainedIds: [1, 2],
        eliminatedIds: [3],
      },
    },
    {
      description: '全マッチ: 全タブがフィルタリング結果に含まれる',
      input: {
        tabsRemained: [
          createMockTab(1, 'https://example.com'),
          createMockTab(2, 'https://test.com'),
        ],
        tabsEliminated: [],
        matchingUrls: ['https://example.com', 'https://test.com'],
      },
      expected: {
        remainedIds: [1, 2],
        eliminatedIds: [],
      },
    },
    {
      description: '全不一致: フィルタリング結果は空',
      input: {
        tabsRemained: [],
        tabsEliminated: [
          createMockTab(1, 'https://example.com'),
          createMockTab(2, 'https://test.com'),
        ],
        matchingUrls: ['https://nomatch.com'],
      },
      expected: {
        remainedIds: [],
        eliminatedIds: [1, 2],
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
    const allTabs = [...input.tabsRemained, ...input.tabsEliminated];
    const tabs = new Tabs(allTabs);
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

  it('元のTabsインスタンスは変更されない', async () => {
    // Arrange
    const tabs = new Tabs([
      createMockTab(1, 'https://example.com'),
      createMockTab(2, 'https://test.com'),
    ]);
    const rule = createMockRule(['https://example.com']);

    // Act
    tabs.filterByRule(rule);
    await tabs.reloadAll();

    // Assert - 元のTabsは2タブのまま（両方のIDでreloadが呼ばれる）
    expect(mockReload).toHaveBeenCalledWith(1);
    expect(mockReload).toHaveBeenCalledWith(2);
    expect(mockReload).toHaveBeenCalledTimes(2);
  });
});
