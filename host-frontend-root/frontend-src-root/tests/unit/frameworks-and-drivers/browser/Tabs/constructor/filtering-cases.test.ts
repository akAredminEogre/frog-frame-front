/**
 * Tabs.constructor - フィルタリングテスト
 *
 * 1. urlがundefinedのタブを除外
 * 2. idがundefinedのタブを除外
 * 3. url/id両方undefinedのタブを除外
 * 4. 有効/無効タブが混在するケース
 *
 * ## 検証方法について
 *
 * Tabs.tabsはprivate readonlyのため、テストから直接アクセスできない。
 * getterを追加するとオブジェクト指向9ルールのルール9（Getter禁止）に違反するため、
 * 以下の間接的な方法でタブ数を検証する:
 *
 * 1. filterByRuleで有効タブのURLにマッチするルールを適用
 * 2. reloadAllを実行し、chrome.tabs.reloadの呼び出し回数でタブ数を確認
 *
 * validUrlsは有効なタブ（url/id両方存在）のURLのみを含め、
 * constructorでフィルタリングされた結果を検証する。
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Tabs } from 'src/frameworks-and-drivers/browser/Tabs';

import { createMockRule } from '../mocks/createMockRule';
import { createMockTab } from '../mocks/createMockTab';

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
      input: [
        createMockTab(1, undefined),
        createMockTab(2, 'https://example.com'),
      ],
      validUrls: ['https://example.com'],
      expectedTabCount: 1,
    },
    {
      description: 'idがundefinedのタブは除外される',
      input: [
        createMockTab(undefined, 'https://example.com'),
        createMockTab(2, 'https://test.com'),
      ],
      validUrls: ['https://test.com'],
      expectedTabCount: 1,
    },
    {
      description: 'url/id両方undefinedのタブは除外される',
      input: [
        createMockTab(undefined, undefined),
        createMockTab(2, 'https://example.com'),
      ],
      validUrls: ['https://example.com'],
      expectedTabCount: 1,
    },
    {
      description: '有効/無効タブが混在する場合、有効タブのみ保持される',
      input: [
        createMockTab(1, 'https://example.com'),
        createMockTab(undefined, 'https://no-id.com'),
        createMockTab(3, undefined),
        createMockTab(4, 'https://valid.com'),
        createMockTab(undefined, undefined),
      ],
      validUrls: ['https://example.com', 'https://valid.com'],
      expectedTabCount: 2,
    },
  ];

  it.each(testCases)('$description', async ({ input, validUrls, expectedTabCount }) => {
    // Arrange
    const rule = createMockRule(validUrls);

    // Act
    const tabs = new Tabs(input);

    // Assert - filterByRuleで有効URLにマッチするタブを取得し、数を検証
    const filtered = tabs.filterByRule(rule);
    await filtered.reloadAll();
    expect(mockReload).toHaveBeenCalledTimes(expectedTabCount);
  });
});
