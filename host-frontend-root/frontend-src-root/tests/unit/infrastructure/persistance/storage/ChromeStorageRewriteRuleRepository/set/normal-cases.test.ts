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

/**
 * 1. 既存ルールに新規ルールを追加し、Promise型で返却
 * 2. 空のストレージに最初のルールを保存
 * 3. 同じIDの既存ルールを新しい値で上書き
 * 4. 既存ルールのプロパティを更新
 * 5. 指定されたプロパティのみ更新し、他のプロパティは保持
 * 6. 1つのルールを更新する際に全てのルールを保持
 */
describe('ChromeStorageRewriteRuleRepository.set - 正常系', () => {
  let repository: ChromeStorageRewriteRuleRepository;
  let testRule: RewriteRule;

  beforeEach(() => {
    repository = new ChromeStorageRewriteRuleRepository();
    testRule = new RewriteRule(
      'test-rule-1',
      'test-pattern',
      'test-replacement',
      ''
    );
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should correctly call chrome.storage API, add new rule to existing rules, and return Promise', async () => {
    // Arrange
    const existingRulesObject = {
      'existing-rule-1': {
        id: 'existing-rule-1',
        oldString: 'existing-pattern',
        newString: 'existing-replacement'
      }
    };

    // 既存データが存在する場合のモック設定
    mockChromeStorageLocal.get.mockResolvedValue({ RewriteRules: existingRulesObject });
    mockChromeStorageLocal.set.mockResolvedValue(undefined);

    // Act
    const result = repository.set(testRule);

    // Assert - Promise型であることを確認
    expect(result).toBeInstanceOf(Promise);
    
    // Act & Assert - 実際の処理をテスト
    await result;
    
    // Assert - chrome.storage.local.getが正しく呼ばれることを確認
    expect(mockChromeStorageLocal.get).toHaveBeenCalledTimes(1);
    expect(mockChromeStorageLocal.get).toHaveBeenCalledWith(['RewriteRules']);
    
    // Assert - chrome.storage.local.setが正しく呼ばれることを確認
    expect(mockChromeStorageLocal.set).toHaveBeenCalledTimes(1);
    
    // Assert - 保存された内容を検証（RewriteRuleインスタンスが保存されることを確認）
    const [savedData] = mockChromeStorageLocal.set.mock.calls[0];
    expect(savedData.RewriteRules['existing-rule-1']).toBeInstanceOf(RewriteRule);
    expect(savedData.RewriteRules['test-rule-1']).toBeInstanceOf(RewriteRule);
    expect(savedData.RewriteRules['existing-rule-1'].id).toBe('existing-rule-1');
    expect(savedData.RewriteRules['test-rule-1'].id).toBe('test-rule-1');
  });

  it('should correctly handle empty storage and save first rule', async () => {
    // Arrange
    // 空のストレージをモック
    mockChromeStorageLocal.get.mockResolvedValue({});
    mockChromeStorageLocal.set.mockResolvedValue(undefined);

    // Act
    await repository.set(testRule);
    
    // Assert - 空のストレージでも正しく保存されることを確認
    const [savedData] = mockChromeStorageLocal.set.mock.calls[0];
    expect(savedData.RewriteRules['test-rule-1']).toBeInstanceOf(RewriteRule);
    expect(savedData.RewriteRules['test-rule-1'].id).toBe('test-rule-1');
  });

  it('should correctly overwrite existing rule with same ID', async () => {
    // Arrange
    const existingRulesObject = {
      'test-rule-1': {
        id: 'test-rule-1',
        oldString: 'old-pattern',
        newString: 'old-replacement'
      },
      'other-rule': {
        id: 'other-rule',
        oldString: 'other-pattern',
        newString: 'other-replacement'
      }
    };

    // 既存の同じIDのルールが存在する場合のモック設定
    mockChromeStorageLocal.get.mockResolvedValue({ RewriteRules: existingRulesObject });
    mockChromeStorageLocal.set.mockResolvedValue(undefined);

    // 同じIDの新しいルール（異なるパターンと置換文字）
    const updatedRule = new RewriteRule(
      'test-rule-1',
      'updated-pattern',
      'updated-replacement',
      ''
    );

    // Act
    await repository.set(updatedRule);
    
    // Assert - chrome.storage.local.getとsetが正しく呼ばれることを確認
    expect(mockChromeStorageLocal.get).toHaveBeenCalledTimes(1);
    expect(mockChromeStorageLocal.set).toHaveBeenCalledTimes(1);
    
    // Assert - 保存された内容を検証（既存ルールが上書きされることを確認）
    const [savedData] = mockChromeStorageLocal.set.mock.calls[0];
    expect(savedData.RewriteRules['test-rule-1']).toBeInstanceOf(RewriteRule);
    expect(savedData.RewriteRules['other-rule']).toBeInstanceOf(RewriteRule);
    
    // Assert - 上書きされたルールの内容が新しい値になっていることを確認
    expect(savedData.RewriteRules['test-rule-1'].id).toBe('test-rule-1');
    expect(savedData.RewriteRules['test-rule-1'].oldString).toBe('updated-pattern');
    expect(savedData.RewriteRules['test-rule-1'].newString).toBe('updated-replacement');
    
    // Assert - 他のルールは影響を受けていないことを確認
    expect(savedData.RewriteRules['other-rule'].id).toBe('other-rule');
    expect(savedData.RewriteRules['other-rule'].oldString).toBe('other-pattern');
    expect(savedData.RewriteRules['other-rule'].newString).toBe('other-replacement');
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
    await repository.set(updatedRule);

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
    await repository.set(updatedRule);

    // Assert
    const savedData = mockChromeStorageLocal.set.mock.calls[0][0];
    expect(savedData.RewriteRules['rule-1'].oldString).toBe('new-pattern');
    expect(savedData.RewriteRules['rule-1'].newString).toBe('replacement');
    expect(savedData.RewriteRules['rule-1'].urlPattern).toBe('https://old.com');
    expect(savedData.RewriteRules['rule-1'].isRegex).toBe(false);
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
    await repository.set(updatedRule);

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
