import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
 * 1. ChromeStorageエラーの伝播
 */
describe('SelectedPageTextService.getSelectedPageText - 異常系', () => {
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
    const storageError = new Error('Chrome storage access denied');
    mockChromeStorageLocal.get.mockRejectedValue(storageError);

    // Act & Assert
    await expect(service.getSelectedPageText()).rejects.toThrow('Chrome storage access denied');
  });

});
