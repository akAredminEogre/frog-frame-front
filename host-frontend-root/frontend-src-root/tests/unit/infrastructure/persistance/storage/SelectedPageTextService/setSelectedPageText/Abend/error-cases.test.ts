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
 * 1. ChromeStorageエラーの伝播
 */
describe('SelectedPageTextService.setSelectedPageText - 異常系', () => {
  let service: SelectedPageTextService;

  beforeEach(() => {
    service = new SelectedPageTextService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should propagate chrome storage errors', async () => {
    // Arrange
    const testText = 'Error test';
    const storageError = new Error('Chrome storage quota exceeded');
    mockChromeStorageLocal.set.mockRejectedValue(storageError);

    // Act & Assert
    await expect(service.setSelectedPageText(testText)).rejects.toThrow('Chrome storage quota exceeded');
  });

});
