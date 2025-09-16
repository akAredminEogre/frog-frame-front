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
 * 1. 空文字列の取得処理
 * 2. 特殊文字・Unicodeの取得処理
 * 3. 長文テキストの取得処理
 * 4. 改行・制御文字の取得処理
 */
describe('SelectedPageTextService.getSelectedPageText - エッジケース', () => {
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
      description: 'when empty string is stored', 
      mockValue: { selectedPageText: '' }, 
      expectedResult: '' 
    },
    { 
      description: 'when special characters and unicode are stored', 
      mockValue: { selectedPageText: '日本語テスト 🎌 <div>HTML content</div>' }, 
      expectedResult: '日本語テスト 🎌 <div>HTML content</div>' 
    },
    { 
      description: 'when very long text is stored', 
      mockValue: { selectedPageText: 'a'.repeat(10000) }, 
      expectedResult: 'a'.repeat(10000) 
    },
    { 
      description: 'when text with line breaks is stored', 
      mockValue: { selectedPageText: 'Line 1\nLine 2\r\nLine 3\tTabbed' }, 
      expectedResult: 'Line 1\nLine 2\r\nLine 3\tTabbed' 
    }
  ];

  it.each(testCases)('should return correct text $description', async ({ mockValue, expectedResult }) => {
    // Arrange
    mockChromeStorageLocal.get.mockResolvedValue(mockValue);

    // Act
    const result = await service.getSelectedPageText();

    // Assert
    expect(result).toBe(expectedResult);
  });

});
