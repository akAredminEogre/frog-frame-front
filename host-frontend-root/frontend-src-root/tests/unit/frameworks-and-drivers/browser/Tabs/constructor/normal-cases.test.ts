/**
 * Tabs.constructor - 正常系テスト
 *
 * 1. 有効なタブのみで初期化
 * 2. 空配列で初期化
 * 3. 単一タブで初期化
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Tabs } from 'src/frameworks-and-drivers/browser/Tabs';

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
      expectedReloadCount: 2,
    },
    {
      description: '空配列で初期化した場合、タブは0件',
      input: [],
      expectedReloadCount: 0,
    },
    {
      description: '単一タブで初期化した場合、1件のタブが保持される',
      input: [createMockTab(1, 'https://example.com')],
      expectedReloadCount: 1,
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
