import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ChromeStorageRewriteRuleRepository } from 'src/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

// Chrome Storage APIのモック設定
const mockChromeStorageLocal = {
  get: vi.fn(),
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

describe('ChromeStorageRewriteRuleRepository.update - 正常系', () => {
  let repository: ChromeStorageRewriteRuleRepository;

  beforeEach(() => {
    repository = new ChromeStorageRewriteRuleRepository();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should update existing rule with new values', async () => {
    // Arrange
    const existingRulesObject = {
      'rule-1': {
        id: 'rule-1',
        oldString: 'old-pattern',
        newString: 'old-replacement',
        urlPattern: '',
        isRegex: false
      },
      'rule-2': {
        id: 'rule-2',
        oldString: 'pattern2',
        newString: 'replacement2',
        urlPattern: '',
        isRegex: false
      }
    };
    
    mockChromeStorageLocal.get.mockResolvedValue({ RewriteRules: existingRulesObject });
    mockChromeStorageLocal.set.mockResolvedValue(undefined);

    const updatedRule = new RewriteRule(
      'rule-1',
      'new-pattern',
      'new-replacement',
      'https://example.com',
      true
    );

    // Act
    await repository.update(updatedRule);

    // Assert - chrome.storage.local.setが正しく呼ばれることを確認
    expect(mockChromeStorageLocal.set).toHaveBeenCalledTimes(1);
    
    // Assert - 更新されたルールが正しく保存されることを確認
    const savedData = mockChromeStorageLocal.set.mock.calls[0][0];
    expect(savedData.RewriteRules['rule-1'].id).toBe('rule-1');
    expect(savedData.RewriteRules['rule-1'].oldString).toBe('new-pattern');
    expect(savedData.RewriteRules['rule-1'].newString).toBe('new-replacement');
    expect(savedData.RewriteRules['rule-1'].urlPattern).toBe('https://example.com');
    expect(savedData.RewriteRules['rule-1'].isRegex).toBe(true);
    
    // Assert - 他のルールが変更されていないことを確認
    expect(savedData.RewriteRules['rule-2'].oldString).toBe('pattern2');
    expect(savedData.RewriteRules['rule-2'].newString).toBe('replacement2');
  });

  it('should update only specified properties while preserving others', async () => {
    // Arrange
    const existingRulesObject = {
      'rule-1': {
        id: 'rule-1',
        oldString: 'pattern',
        newString: 'replacement',
        urlPattern: 'https://old.com',
        isRegex: false
      }
    };
    
    mockChromeStorageLocal.get.mockResolvedValue({ RewriteRules: existingRulesObject });
    mockChromeStorageLocal.set.mockResolvedValue(undefined);

    const updatedRule = new RewriteRule(
      'rule-1',
      'new-pattern',
      'replacement',
      'https://old.com',
      false
    );

    // Act
    await repository.update(updatedRule);

    // Assert
    const savedData = mockChromeStorageLocal.set.mock.calls[0][0];
    expect(savedData.RewriteRules['rule-1'].oldString).toBe('new-pattern');
    expect(savedData.RewriteRules['rule-1'].newString).toBe('replacement');
    expect(savedData.RewriteRules['rule-1'].urlPattern).toBe('https://old.com');
    expect(savedData.RewriteRules['rule-1'].isRegex).toBe(false);
  });

  it('should handle update when storage is initially empty', async () => {
    // Arrange
    mockChromeStorageLocal.get.mockResolvedValue({});
    mockChromeStorageLocal.set.mockResolvedValue(undefined);

    const newRule = new RewriteRule(
      'rule-1',
      'pattern',
      'replacement',
      '',
      false
    );

    // Act
    await repository.update(newRule);

    // Assert - chrome.storage.local.setが呼ばれることを確認
    expect(mockChromeStorageLocal.set).toHaveBeenCalledTimes(1);
    
    // Assert - 新しいルールが保存されることを確認
    const savedData = mockChromeStorageLocal.set.mock.calls[0][0];
    expect(savedData.RewriteRules['rule-1']).toBeDefined();
    expect(savedData.RewriteRules['rule-1'].id).toBe('rule-1');
    expect(savedData.RewriteRules['rule-1'].oldString).toBe('pattern');
  });

  it('should preserve all rules when updating one rule', async () => {
    // Arrange
    const existingRulesObject = {
      'rule-1': {
        id: 'rule-1',
        oldString: 'pattern1',
        newString: 'replacement1'
      },
      'rule-2': {
        id: 'rule-2',
        oldString: 'pattern2',
        newString: 'replacement2'
      },
      'rule-3': {
        id: 'rule-3',
        oldString: 'pattern3',
        newString: 'replacement3'
      }
    };
    
    mockChromeStorageLocal.get.mockResolvedValue({ RewriteRules: existingRulesObject });
    mockChromeStorageLocal.set.mockResolvedValue(undefined);

    const updatedRule = new RewriteRule(
      'rule-2',
      'updated-pattern2',
      'updated-replacement2',
      '',
      false
    );

    // Act
    await repository.update(updatedRule);

    // Assert - すべてのルールが保存されることを確認
    const savedData = mockChromeStorageLocal.set.mock.calls[0][0];
    expect(Object.keys(savedData.RewriteRules)).toHaveLength(3);
    expect(savedData.RewriteRules['rule-1']).toBeDefined();
    expect(savedData.RewriteRules['rule-2']).toBeDefined();
    expect(savedData.RewriteRules['rule-3']).toBeDefined();
    
    // Assert - rule-2のみが更新されることを確認
    expect(savedData.RewriteRules['rule-2'].oldString).toBe('updated-pattern2');
    expect(savedData.RewriteRules['rule-2'].newString).toBe('updated-replacement2');
    
    // Assert - 他のルールは変更されていないことを確認
    expect(savedData.RewriteRules['rule-1'].oldString).toBe('pattern1');
    expect(savedData.RewriteRules['rule-3'].oldString).toBe('pattern3');
  });
});
