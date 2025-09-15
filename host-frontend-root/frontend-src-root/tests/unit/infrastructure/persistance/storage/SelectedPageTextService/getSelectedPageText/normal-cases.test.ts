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
 * Chrome Storage APIの正しい呼び出し、保存されたテキストの取得、Promise型確認を統合的にテスト
 */
describe('SelectedPageTextService.getSelectedPageText - 正常系', () => {
  let service: SelectedPageTextService;

  beforeEach(() => {
    service = new SelectedPageTextService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should correctly call chrome.storage API and return stored text as Promise', async () => {
    // Arrange
    const storedText = 'Stored page text';
    mockChromeStorageLocal.get.mockResolvedValue({ selectedPageText: storedText });

    // Act
    const result = service.getSelectedPageText();

    // Assert - Promise型であることを確認
    expect(result).toBeInstanceOf(Promise);
    
    // Act & Assert - 実際の結果をテスト
    const actualResult = await result;
    expect(actualResult).toBe(storedText);
    
    // Assert - chrome.storage.local.getが正しく呼ばれることを確認
    expect(mockChromeStorageLocal.get).toHaveBeenCalledTimes(1);
    expect(mockChromeStorageLocal.get).toHaveBeenCalledWith(['selectedPageText']);
  });
});
