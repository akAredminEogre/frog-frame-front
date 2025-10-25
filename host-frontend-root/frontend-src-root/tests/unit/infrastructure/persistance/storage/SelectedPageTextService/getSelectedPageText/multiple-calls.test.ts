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
 * 1. 連続同期呼び出しの処理
 * 2. 連続非同期呼び出しの処理
 */
describe('SelectedPageTextService.getSelectedPageText - 複数回呼び出し', () => {
  let service: SelectedPageTextService;

  beforeEach(() => {
    service = new SelectedPageTextService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should handle multiple sequential calls', async () => {
    // Arrange
    const testText = 'Consistent text';
    mockChromeStorageLocal.get.mockResolvedValue({ selectedPageText: testText });

    // Act
    const results = await Promise.all([
      service.getSelectedPageText(),
      service.getSelectedPageText(),
      service.getSelectedPageText()
    ]);

    // Assert
    expect(mockChromeStorageLocal.get).toHaveBeenCalledTimes(3);
    results.forEach(result => {
      expect(result).toBe(testText);
    });
  });

  it('should handle concurrent calls correctly', async () => {
    // Arrange
    const testText = 'Concurrent test';
    mockChromeStorageLocal.get.mockResolvedValue({ selectedPageText: testText });

    // Act
    const promise1 = service.getSelectedPageText();
    const promise2 = service.getSelectedPageText();
    const promise3 = service.getSelectedPageText();

    const results = await Promise.all([promise1, promise2, promise3]);

    // Assert
    expect(mockChromeStorageLocal.get).toHaveBeenCalledTimes(3);
    results.forEach(result => {
      expect(result).toBe(testText);
    });
  });
});
