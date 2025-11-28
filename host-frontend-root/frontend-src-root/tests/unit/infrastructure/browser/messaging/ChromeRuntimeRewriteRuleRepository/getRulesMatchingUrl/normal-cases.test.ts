import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { ChromeRuntimeRewriteRuleRepository } from 'src/infrastructure/browser/messaging/ChromeRuntimeRewriteRuleRepository';

/**
 * ChromeRuntimeRewriteRuleRepository.getRulesMatchingUrl - 正常系テスト
 * 1. URLにマッチするルールのみを取得する
 * 2. マッチするルールがない場合は空のRewriteRulesを返す
 * 3. 空のurlPatternを持つルールは取得されない
 */
describe('ChromeRuntimeRewriteRuleRepository.getRulesMatchingUrl - 正常系', () => {
  let repository: ChromeRuntimeRewriteRuleRepository;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock chrome.runtime.sendMessage
    global.chrome = {
      runtime: {
        sendMessage: vi.fn(),
      },
    } as any;

    repository = new ChromeRuntimeRewriteRuleRepository();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('URLにマッチするルールのみを取得する', async () => {
    // Arrange
    const mockRules = [
      { id: 1, oldString: 'old1', newString: 'new1', urlPattern: 'https://example.com', isRegex: false },
      { id: 2, oldString: 'old2', newString: 'new2', urlPattern: 'https://other.com', isRegex: false },
    ];
    vi.mocked(chrome.runtime.sendMessage).mockResolvedValue({
      success: true,
      rules: mockRules,
    });

    // Act
    const result = await repository.getRulesMatchingUrl('https://example.com/page');

    // Assert
    expect(result).toBeInstanceOf(RewriteRules);
    const rulesArray = result.toArray();
    expect(rulesArray).toHaveLength(1);
    expect(rulesArray[0].oldString).toBe('old1');
  });

  it('マッチするルールがない場合は空のRewriteRulesを返す', async () => {
    // Arrange
    const mockRules = [
      { id: 1, oldString: 'old1', newString: 'new1', urlPattern: 'https://other.com', isRegex: false },
    ];
    vi.mocked(chrome.runtime.sendMessage).mockResolvedValue({
      success: true,
      rules: mockRules,
    });

    // Act
    const result = await repository.getRulesMatchingUrl('https://example.com/page');

    // Assert
    expect(result).toBeInstanceOf(RewriteRules);
    expect(result.toArray()).toHaveLength(0);
  });

  it('空のurlPatternを持つルールは取得されない', async () => {
    // Arrange
    const mockRules = [
      { id: 1, oldString: 'old1', newString: 'new1', urlPattern: '', isRegex: false },
      { id: 2, oldString: 'old2', newString: 'new2', urlPattern: 'https://example.com', isRegex: false },
    ];
    vi.mocked(chrome.runtime.sendMessage).mockResolvedValue({
      success: true,
      rules: mockRules,
    });

    // Act
    const result = await repository.getRulesMatchingUrl('https://example.com/page');

    // Assert
    const rulesArray = result.toArray();
    expect(rulesArray).toHaveLength(1);
    expect(rulesArray[0].oldString).toBe('old2');
  });
});
