import { afterEach,beforeEach, describe, expect, it, vi } from 'vitest';

import { SelectedPageTextService } from 'src/infrastructure/persistance/storage/SelectedPageTextService';

// Chrome Storage APIのモック設定
const mockChromeStorageLocal = {
  set: vi.fn()
};

// グローバルなchromeオブジェクトをモック
Object.defineProperty(globalThis, 'chrome', {
  value: {
    storage: {
      local: mockChromeStorageLocal
    }
  },
  writable: true
});

/**
 * Chrome未定義ケースのテスト
 */
describe('SelectedPageTextService.setSelectedPageText - Chrome未定義ケース', () => {
  let service: SelectedPageTextService;

  beforeEach(() => {
    service = new SelectedPageTextService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // Chrome未定義ケースの配列定義
  const chromeUndefinedCases = [
    {
      description: 'should handle chrome.storage.local being undefined',
      setup: () => ({ storage: { local: undefined } })
    },
    {
      description: 'should handle chrome.storage being undefined',
      setup: () => ({ storage: undefined })
    },
    {
      description: 'should handle chrome being completely undefined',
      setup: () => undefined
    }
  ];

  // 配列をループしてテストケースを実行
  chromeUndefinedCases.forEach((testCase) => {
    it(testCase.description, async () => {
      // Arrange
      const originalChrome = globalThis.chrome;
      (globalThis as any).chrome = testCase.setup();

      // Act & Assert
      await expect(service.setSelectedPageText('test')).rejects.toThrow();

      // Cleanup
      (globalThis as any).chrome = originalChrome;
    });
  });
});
