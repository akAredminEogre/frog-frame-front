import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ChromeStorageRewriteRuleRepository } from 'src/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository';
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
 * 1. 指定されたIDのルールが存在する場合、そのRewriteRuleインスタンスを返却
 * 2. 全てのプロパティを持つルールを正しく取得
 */
describe('ChromeStorageRewriteRuleRepository.getById - 正常系', () => {
  let repository: ChromeStorageRewriteRuleRepository;

  beforeEach(() => {
    repository = new ChromeStorageRewriteRuleRepository();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return RewriteRule instance when rule with specified ID exists', async () => {
    // Arrange
    const storedRulesObject = {
      1: {
        id: 1,
        oldString: 'pattern1',
        newString: 'replacement1',
        urlPattern: '',
        isRegex: false
      },
      2: {
        id: 2,
        oldString: 'pattern2',
        newString: 'replacement2',
        urlPattern: 'https://example.com',
        isRegex: true
      }
    };
    
    mockChromeStorageLocal.get.mockResolvedValue({ RewriteRules: storedRulesObject });

    // Act
    const result = await repository.getById(1);

    // Assert
    expect(result).toBeInstanceOf(RewriteRule);
    expect(result.id).toBe(1);
    expect(result.oldString).toBe('pattern1');
    expect(result.newString).toBe('replacement1');
    expect(result.urlPattern).toBe('');
    expect(result.isRegex).toBe(false);
  });

  it('should correctly retrieve rule with all properties', async () => {
    // Arrange
    const storedRulesObject = {
      3: {
        id: 3,
        oldString: 'old',
        newString: 'new',
        urlPattern: 'https://test.com/*',
        isRegex: true
      }
    };
    
    mockChromeStorageLocal.get.mockResolvedValue({ RewriteRules: storedRulesObject });

    // Act
    const result = await repository.getById(3);

    // Assert
    expect(result).toBeInstanceOf(RewriteRule);
    expect(result.id).toBe(3);
    expect(result.oldString).toBe('old');
    expect(result.newString).toBe('new');
    expect(result.urlPattern).toBe('https://test.com/*');
    expect(result.isRegex).toBe(true);
  });
});
