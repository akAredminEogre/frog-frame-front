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
 * 1. 連続同期呼び出しの処理
 * 2. 既存テキストの上書き処理
 */
describe('SelectedPageTextService.setSelectedPageText - 複数回呼び出し', () => {
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
    mockChromeStorageLocal.set.mockResolvedValue(undefined);

    // Act
    await service.setSelectedPageText('First text');
    await service.setSelectedPageText('Second text');
    await service.setSelectedPageText('Third text');

    // Assert
    expect(mockChromeStorageLocal.set).toHaveBeenCalledTimes(3);
    expect(mockChromeStorageLocal.set).toHaveBeenNthCalledWith(1, { selectedPageText: 'First text' });
    expect(mockChromeStorageLocal.set).toHaveBeenNthCalledWith(2, { selectedPageText: 'Second text' });
    expect(mockChromeStorageLocal.set).toHaveBeenNthCalledWith(3, { selectedPageText: 'Third text' });
  });

  it('should handle overwriting existing text', async () => {
    // Arrange
    const originalText = 'Original text';
    const newText = 'New text';
    mockChromeStorageLocal.set.mockResolvedValue(undefined);
    
    // getSelectedPageText用のモック設定
    const mockChromeStorageLocalGet = {
      get: vi.fn()
    };
    
    // chrome.storage.local.getも追加
    (globalThis.chrome.storage.local as any).get = mockChromeStorageLocalGet.get;

    // Act
    await service.setSelectedPageText(originalText);
    
    // 1回目保存後の確認のため、getのモックを設定
    mockChromeStorageLocalGet.get.mockResolvedValueOnce({ selectedPageText: originalText });
    const firstResult = await service.getSelectedPageText();
    
    await service.setSelectedPageText(newText);
    
    // 2回目保存後の確認のため、getのモックを更新
    mockChromeStorageLocalGet.get.mockResolvedValueOnce({ selectedPageText: newText });
    const finalResult = await service.getSelectedPageText();

    // Assert
    expect(mockChromeStorageLocal.set).toHaveBeenCalledTimes(2);
    expect(mockChromeStorageLocal.set).toHaveBeenNthCalledWith(1, { selectedPageText: originalText });
    expect(mockChromeStorageLocal.set).toHaveBeenNthCalledWith(2, { selectedPageText: newText });
    
    // 実際の上書き動作を検証
    expect(firstResult).toBe(originalText);
    expect(finalResult).toBe(newText); // 最新の値が取得できることを確認
  });
});
