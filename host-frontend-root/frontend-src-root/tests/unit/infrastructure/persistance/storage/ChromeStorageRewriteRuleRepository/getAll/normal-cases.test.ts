import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ChromeStorageRewriteRuleRepository } from 'src/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

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
 * 1. 複数のルールが保存されている場合、すべてのルールをRewriteRulesインスタンスとして取得し、Promise型で返却
 * 2. ストレージが空の場合、空のRewriteRulesインスタンスを返却
 * 3. RewriteRulesの値がnullの場合、空のRewriteRulesインスタンスを返却
 */
describe('ChromeStorageRewriteRuleRepository.getAll - 正常系', () => {
  let repository: ChromeStorageRewriteRuleRepository;

  beforeEach(() => {
    repository = new ChromeStorageRewriteRuleRepository();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should correctly call chrome.storage API, return RewriteRules instance with stored data, and return Promise', async () => {
    // Arrange
    const storedRulesObject = {
      '1': {
        id: 1,
        oldString: 'pattern1',
        newString: 'replacement1'
      },
      '2': {
        id: 2,
        oldString: 'pattern2',
        newString: 'replacement2'
      }
    };
    
    mockChromeStorageLocal.get.mockResolvedValue({ RewriteRules: storedRulesObject });

    // Act
    const result = repository.getAll();

    // Assert - Promise型であることを確認
    expect(result).toBeInstanceOf(Promise);
    
    // Act & Assert - 実際の結果をテスト
    const actualResult = await result;
    
    // Assert - RewriteRulesインスタンスが返されることを確認
    expect(actualResult).toBeInstanceOf(RewriteRules);
    
    // Assert - 取得されたデータが正しくRewriteRuleインスタンスに変換されることを確認
    const resultAsObject = actualResult.toObject();
    expect(resultAsObject[1]).toBeInstanceOf(RewriteRule);
    expect(resultAsObject[2]).toBeInstanceOf(RewriteRule);
    expect(resultAsObject[1].id).toBe(1);
    expect(resultAsObject[1].oldString).toBe('pattern1');
    expect(resultAsObject[1].newString).toBe('replacement1');
    expect(resultAsObject[2].id).toBe(2);
    expect(resultAsObject[2].oldString).toBe('pattern2');
    expect(resultAsObject[2].newString).toBe('replacement2');
    
    // Assert - chrome.storage.local.getが正しく呼ばれることを確認
    expect(mockChromeStorageLocal.get).toHaveBeenCalledTimes(1);
    expect(mockChromeStorageLocal.get).toHaveBeenCalledWith(['RewriteRules']);
  });

  it('should correctly handle empty storage and return empty RewriteRules', async () => {
    // Arrange
    // 空のストレージをモック
    mockChromeStorageLocal.get.mockResolvedValue({});

    // Act
    const result = await repository.getAll();
    
    // Assert - 空のRewriteRulesインスタンスが返されることを確認
    expect(result).toBeInstanceOf(RewriteRules);
    
    // Assert - 空のオブジェクトが返されることを確認
    const resultAsObject = result.toObject();
    expect(resultAsObject).toEqual({});
    
    // Assert - chrome.storage.local.getが正しく呼ばれることを確認
    expect(mockChromeStorageLocal.get).toHaveBeenCalledTimes(1);
    expect(mockChromeStorageLocal.get).toHaveBeenCalledWith(['RewriteRules']);
  });

  it('should correctly handle storage with null RewriteRules value and return empty RewriteRules', async () => {
    // Arrange
    // RewriteRulesがnullの場合をモック
    mockChromeStorageLocal.get.mockResolvedValue({ RewriteRules: null });

    // Act
    const result = await repository.getAll();
    
    // Assert - 空のRewriteRulesインスタンスが返されることを確認
    expect(result).toBeInstanceOf(RewriteRules);
    
    // Assert - 空のオブジェクトが返されることを確認
    const resultAsObject = result.toObject();
    expect(resultAsObject).toEqual({});
  });
});
