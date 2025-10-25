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
 * 1. データなし時の例外スロー
 * 2. ストレージ結果null時の例外スロー  
 * 3. selectedPageTextプロパティundefined時の例外スロー
 */
describe('SelectedPageTextService.getSelectedPageText - データが存在しない場合', () => {
  let service: SelectedPageTextService;

  beforeEach(() => {
    service = new SelectedPageTextService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const testCases = [
    { description: 'when no text is stored', mockValue: {} },
    { description: 'when storage result is null', mockValue: null },
    { description: 'when selectedPageText property is undefined', mockValue: { selectedPageText: undefined } },
    { description: 'when selectedPageText property is null', mockValue: { selectedPageText: null } }
  ];

  it.each(testCases)('should throw error $description', async ({ mockValue }) => {
    // Arrange
    mockChromeStorageLocal.get.mockResolvedValue(mockValue);

    // Act & Assert
    await expect(service.getSelectedPageText()).rejects.toThrow('Selected page text not found');
  });
});
