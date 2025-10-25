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
 * Chrome Storage APIの正しい呼び出し、正常解決、Promise型確認を統合的にテスト
 */
describe('SelectedPageTextService.setSelectedPageText - 正常系', () => {
  let service: SelectedPageTextService;

  beforeEach(() => {
    service = new SelectedPageTextService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should correctly call chrome.storage API, resolve successfully, and return Promise', async () => {
    // Arrange
    const testText = 'Test selected page text';
    mockChromeStorageLocal.set.mockResolvedValue(undefined);

    // Act
    const result = service.setSelectedPageText(testText);

    // Assert - Promise型であることを確認
    expect(result).toBeInstanceOf(Promise);
    
    // Act & Assert - 実際の結果をテスト
    const actualResult = await result;
    expect(actualResult).toBeUndefined();
    
    // Assert - chrome.storage.local.setが正しく呼ばれることを確認
    expect(mockChromeStorageLocal.set).toHaveBeenCalledTimes(1);
    expect(mockChromeStorageLocal.set).toHaveBeenCalledWith({ selectedPageText: testText });
  });
});
