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

  /**
   * 検証方法について:
   * Tabs.tabsはprivate readonlyのため、テストから直接アクセスできない。
   * getterを追加するとオブジェクト指向9ルールのルール9（Getter禁止）に違反するため、
   * 以下の間接的な方法でタブ数を検証する:
   * 1. filterByRuleで入力タブのURLにマッチするルールを適用
   * 2. reloadAllを実行し、chrome.tabs.reloadの呼び出し回数でタブ数を確認
   */
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
