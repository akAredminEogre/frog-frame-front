import { afterEach,beforeEach, describe, expect, it, vi } from 'vitest';

import { SelectedPageTextService } from 'src/infrastructure/persistance/storage/SelectedPageTextService';

// Chrome Storage APIのモック設定
const mockChromeStorageLocal = {
  get: vi.fn()
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
 * 1. chrome.storage.local未定義時の例外
 * 2. chrome.storage未定義時の例外
 * 3. chrome未定義時の例外
 */
describe('SelectedPageTextService.getSelectedPageText - Chrome未定義ケース', () => {
  let service: SelectedPageTextService;

  beforeEach(() => {
    service = new SelectedPageTextService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const chromeUndefinedTestCases = [
    {
      description: 'chrome.storage.local being undefined',
      chromeObject: { storage: { local: undefined } }
    },
    {
      description: 'chrome.storage being undefined', 
      chromeObject: { storage: undefined }
    },
    {
      description: 'chrome being completely undefined',
      chromeObject: undefined
    }
  ];

  it.each(chromeUndefinedTestCases)('should handle $description', async ({ chromeObject }) => {
    // Arrange
    const originalChrome = globalThis.chrome;
    (globalThis as any).chrome = chromeObject;

    // Act & Assert
    await expect(service.getSelectedPageText()).rejects.toThrow();

    // Cleanup
    (globalThis as any).chrome = originalChrome;
  });
});
