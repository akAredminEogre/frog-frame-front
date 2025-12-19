/**
 * Tabs.constructor - フィルタリングテスト
 *
 * 1. urlがundefinedのタブを除外
 * 2. idがundefinedのタブを除外
 * 3. url/id両方undefinedのタブを除外
 * 4. 有効/無効タブが混在するケース
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Tabs } from 'src/frameworks-and-drivers/browser/Tabs';

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
      expectedReloadCount: 1,
    },
    {
      description: 'idがundefinedのタブは除外される',
      input: [
        createMockTab(undefined, 'https://example.com'),
        createMockTab(2, 'https://test.com'),
      ],
      expectedReloadCount: 1,
    },
    {
      description: 'url/id両方undefinedのタブは除外される',
      input: [
        createMockTab(undefined, undefined),
        createMockTab(2, 'https://example.com'),
      ],
      expectedReloadCount: 1,
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
      expectedReloadCount: 2,
    },
  ];

  it.each(testCases)('$description', async ({ input, expectedReloadCount }) => {
    // Arrange
    const tabs = new Tabs(input);

    // Act
    await tabs.reloadAll();

    // Assert
    expect(mockReload).toHaveBeenCalledTimes(expectedReloadCount);
  });
});
