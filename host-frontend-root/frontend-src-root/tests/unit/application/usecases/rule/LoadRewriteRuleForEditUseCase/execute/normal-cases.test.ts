import { createMockRewriteRuleRepository } from 'tests/unit/application/ports/IRewriteRuleRepository/mocks/createMockRewriteRuleRepository';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LoadRewriteRuleForEditUseCase } from 'src/application/usecases/rule/LoadRewriteRuleForEditUseCase';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

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
    mockRepository = createMockRewriteRuleRepository();

    // テスト対象の初期化
    useCase = new LoadRewriteRuleForEditUseCase(mockRepository);
  });

  it.each([
    {
      description: '存在するルールIDでルールが正常に取得できる',
      ruleId: 1,
      mockRule: RewriteRule.fromParams(1, {
        oldString: 'oldText',
        newString: 'newText',
        urlPattern: 'https://example.com',
        isRegex: false,
      }),
    },
    {
      description: '正規表現を含むルールが正常に取得できる',
      ruleId: 2,
      mockRule: RewriteRule.fromParams(2, {
        oldString: '\\d{4}-\\d{13}',
        newString: '<a href="https://example.com/$1">$1</a>',
        urlPattern: 'https://example.com',
        isRegex: true,
      }),
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
