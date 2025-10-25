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
 * 1. 空文字列の保存処理
 * 2. 特殊文字・Unicodeの保存処理
 * 3. 長文テキストの保存処理  
 * 4. 改行・制御文字の保存処理
 */
describe('SelectedPageTextService.setSelectedPageText - エッジケース', () => {
  let service: SelectedPageTextService;

  beforeEach(() => {
    service = new SelectedPageTextService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const testCases = [
    { 
      description: 'empty string', 
      text: '' 
    },
    { 
      description: 'special characters and unicode', 
      text: '特殊文字テスト 🚀 <script>alert("test")</script>' 
    },
    { 
      description: 'very long text', 
      text: 'a'.repeat(10000) 
    },
    { 
      description: 'text with line breaks', 
      text: 'Line 1\\nLine 2\\r\\nLine 3\\tTabbed' 
    }
  ];

  it.each(testCases)('should handle $description', async ({ text }) => {
    // Arrange
    mockChromeStorageLocal.set.mockResolvedValue(undefined);

    // Act
    await service.setSelectedPageText(text);

    // Assert
    expect(mockChromeStorageLocal.set).toHaveBeenCalledWith({ selectedPageText: text });
  });
});
