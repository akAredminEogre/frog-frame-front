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
      input: [
        createMockTab(1, 'https://example.com'),
        createMockTab(2, 'https://test.com'),
        createMockTab(3, 'https://other.com'),
      ],
      matchingUrls: ['https://example.com', 'https://test.com'],
      expectedReloadCount: 2,
    },
    {
      description: '全マッチ: 全タブがフィルタリング結果に含まれる',
      input: [
        createMockTab(1, 'https://example.com'),
        createMockTab(2, 'https://test.com'),
      ],
      matchingUrls: ['https://example.com', 'https://test.com'],
      expectedReloadCount: 2,
    },
    {
      description: '全不一致: フィルタリング結果は空',
      input: [
        createMockTab(1, 'https://example.com'),
        createMockTab(2, 'https://test.com'),
      ],
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

    // Assert - 元のTabsは2タブのまま
    expect(mockReload).toHaveBeenCalledTimes(2);
  });
});
