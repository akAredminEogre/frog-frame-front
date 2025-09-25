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
 * Chrome Storage APIの正しい呼び出し、RewriteRulesオブジェクトの取得、Promise型確認を統合的にテスト
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
      'rule-1': {
        id: 'rule-1',
        oldString: 'pattern1',
        newString: 'replacement1'
      },
      'rule-2': {
        id: 'rule-2',
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
    expect(resultAsObject['rule-1']).toBeInstanceOf(RewriteRule);
    expect(resultAsObject['rule-2']).toBeInstanceOf(RewriteRule);
    expect(resultAsObject['rule-1'].id).toBe('rule-1');
    expect(resultAsObject['rule-1'].oldString).toBe('pattern1');
    expect(resultAsObject['rule-1'].newString).toBe('replacement1');
    expect(resultAsObject['rule-2'].id).toBe('rule-2');
    expect(resultAsObject['rule-2'].oldString).toBe('pattern2');
    expect(resultAsObject['rule-2'].newString).toBe('replacement2');
    
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
