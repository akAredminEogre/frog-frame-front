import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoadRewriteRuleForEditUseCase } from 'src/application/usecases/rule/LoadRewriteRuleForEditUseCase';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

/**
 * LoadRewriteRuleForEditUseCase.execute - 正常系テスト
 * 1. 存在するルールIDでルールが正常に取得できる
 * 2. 正規表現を含むルールが正常に取得できる
 */
describe('LoadRewriteRuleForEditUseCase.execute - 正常系', () => {
  let useCase: LoadRewriteRuleForEditUseCase;
  let mockRepository: IRewriteRuleRepository;

  beforeEach(() => {
    // モックリポジトリの初期化
    mockRepository = {
      getById: vi.fn(),
      getAll: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
    };

    // テスト対象の初期化
    useCase = new LoadRewriteRuleForEditUseCase(mockRepository);
  });

  it.each([
    {
      description: '存在するルールIDでルールが正常に取得できる',
      ruleId: 'rule-001',
      mockRule: new RewriteRule(
        'rule-001',
        'oldText',
        'newText',
        'https://example.com',
        false
      ),
    },
    {
      description: '正規表現を含むルールが正常に取得できる',
      ruleId: 'rule-002',
      mockRule: new RewriteRule(
        'rule-002',
        '\\d{4}-\\d{13}',
        '<a href="https://example.com/$1">$1</a>',
        'https://example.com',
        true
      ),
    },
  ])('$description', async ({ ruleId, mockRule }) => {
    // Arrange
    vi.mocked(mockRepository.getById).mockResolvedValue(mockRule);

    // Act
    const result = await useCase.execute(ruleId);

    // Assert
    expect(mockRepository.getById).toHaveBeenCalledTimes(1);
    expect(mockRepository.getById).toHaveBeenCalledWith(ruleId);
    expect(result).toBe(mockRule);
  });
});
