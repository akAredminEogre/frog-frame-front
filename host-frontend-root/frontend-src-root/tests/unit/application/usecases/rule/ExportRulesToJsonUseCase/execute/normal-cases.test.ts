import { createMockRewriteRuleRepository } from 'tests/unit/application/ports/IRewriteRuleRepository/createMockRewriteRuleRepository';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ExportedRewriteRules } from 'src/application/types/ExportedRewriteRules';
import { ExportRulesToJsonUseCase } from 'src/application/usecases/rule/ExportRulesToJsonUseCase';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';

/**
 * ExportRulesToJsonUseCase.execute - 正常系テスト
 * 1. 空のルールリストを正常にエクスポートできる
 * 2. 単一のルールを正常にエクスポートできる
 * 3. 複数のルールを正常にエクスポートできる
 * 4. 正規表現を含むルールを正常にエクスポートできる
 * 5. isActiveフラグがfalseのルールを正常にエクスポートできる
 */
describe('ExportRulesToJsonUseCase.execute - 正常系', () => {
  let useCase: ExportRulesToJsonUseCase;
  let mockRepository: IRewriteRuleRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository = createMockRewriteRuleRepository();
    useCase = new ExportRulesToJsonUseCase(mockRepository);
  });

  it.each([
    {
      description: '空のルールリストを正常にエクスポートできる',
      rules: [],
      expectedRulesCount: 0,
    },
    {
      description: '単一のルールを正常にエクスポートできる',
      rules: [
        new RewriteRule(1, 'old', 'new', 'https://example.com', false, true),
      ],
      expectedRulesCount: 1,
    },
    {
      description: '複数のルールを正常にエクスポートできる',
      rules: [
        new RewriteRule(1, 'old1', 'new1', 'https://example.com', false, true),
        new RewriteRule(2, 'old2', 'new2', 'https://test.com', false, true),
        new RewriteRule(3, 'old3', 'new3', 'https://demo.com', false, true),
      ],
      expectedRulesCount: 3,
    },
    {
      description: '正規表現を含むルールを正常にエクスポートできる',
      rules: [
        new RewriteRule(
          1,
          '\\d{4}-\\d{13}',
          '<a href="https://example.com/$1">$1</a>',
          'https://example.com',
          true,
          true
        ),
      ],
      expectedRulesCount: 1,
    },
    {
      description: 'isActiveフラグがfalseのルールを正常にエクスポートできる',
      rules: [
        new RewriteRule(1, 'old', 'new', 'https://example.com', false, false),
      ],
      expectedRulesCount: 1,
    },
  ])('$description', async ({ rules, expectedRulesCount }) => {
    const rewriteRules = new RewriteRules(rules);
    vi.mocked(mockRepository.getAll).mockResolvedValue(rewriteRules);

    const result = await useCase.execute();

    const parsedResult: ExportedRewriteRules = JSON.parse(result);

    expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
    expect(parsedResult.version).toBe('1.0');
    expect(parsedResult.exportDate).toBeDefined();
    expect(parsedResult.rules).toHaveLength(expectedRulesCount);

    parsedResult.rules.forEach((exportedRule, index) => {
      expect(exportedRule).not.toHaveProperty('id');
      expect(exportedRule.oldString).toBe(rules[index].oldString);
      expect(exportedRule.newString).toBe(rules[index].newString);
      expect(exportedRule.urlPattern).toBe(rules[index].urlPattern);
      expect(exportedRule.isRegex).toBe(rules[index].isRegex);
      expect(exportedRule.isActive).toBe(rules[index].isActive);
    });
  });
});
