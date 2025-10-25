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
 * 1. undefinedバリデーション例外のスロー
 * 2. nullバリデーション例外のスロー
 */
describe('SelectedPageTextService.setSelectedPageText - null/undefined バリデーション', () => {
  let service: SelectedPageTextService;

  beforeEach(() => {
    service = new SelectedPageTextService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const invalidValueTestCases = [
    { 
      description: 'should throw error when text is undefined', 
      value: undefined 
    },
    { 
      description: 'should throw error when text is null', 
      value: null 
    }
  ];

  it.each(invalidValueTestCases)('$description', async ({ value }) => {
    // Arrange
    mockChromeStorageLocal.set.mockResolvedValue(undefined);

    // Act & Assert
    await expect(service.setSelectedPageText(value as any)).rejects.toThrow('Text cannot be undefined or null');
    
    // Verify storage was not called
    expect(mockChromeStorageLocal.set).not.toHaveBeenCalled();
  });
});
