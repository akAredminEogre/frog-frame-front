import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ChromeStorageRewriteRuleRepository } from 'src/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository';
import { RewriteRuleNotFoundError } from 'src/domain/errors/RewriteRuleNotFoundError';

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
 * 1. 指定されたIDのルールが存在しない場合、RewriteRuleNotFoundErrorをスロー
 * 2. ストレージが空の場合、RewriteRuleNotFoundErrorをスロー
 */
describe('ChromeStorageRewriteRuleRepository.getById - 異常系', () => {
  let repository: ChromeStorageRewriteRuleRepository;

  beforeEach(() => {
    repository = new ChromeStorageRewriteRuleRepository();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should throw RewriteRuleNotFoundError when rule with specified ID does not exist', async () => {
    // Arrange
    const storedRulesObject = {
      'rule-1': {
        id: 'rule-1',
        oldString: 'pattern1',
        newString: 'replacement1'
      }
    };
    
    mockChromeStorageLocal.get.mockResolvedValue({ RewriteRules: storedRulesObject });

    // Act & Assert
    await expect(repository.getById('non-existent-id')).rejects.toThrow(RewriteRuleNotFoundError);
    await expect(repository.getById('non-existent-id')).rejects.toThrow('Rewrite rule with id "non-existent-id" not found');
  });

  it('should throw RewriteRuleNotFoundError when storage is empty', async () => {
    // Arrange
    mockChromeStorageLocal.get.mockResolvedValue({});

    // Act & Assert
    await expect(repository.getById('any-id')).rejects.toThrow(RewriteRuleNotFoundError);
    await expect(repository.getById('any-id')).rejects.toThrow('Rewrite rule with id "any-id" not found');
  });
});
