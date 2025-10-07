import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UpdateRewriteRuleUseCase } from 'src/application/usecases/rule/UpdateRewriteRuleUseCase';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

/**
 * UpdateRewriteRuleUseCase.execute - 正常系テスト
 * 1. 通常のルールが正常に更新できる
 * 2. 正規表現を含むルールが正常に更新できる
 * 3. URLパターンを持つルールが正常に更新できる
 */
describe('UpdateRewriteRuleUseCase.execute - 正常系', () => {
  let useCase: UpdateRewriteRuleUseCase;
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
    useCase = new UpdateRewriteRuleUseCase(mockRepository);
  });

  it.each([
    {
      description: '通常のルールが正常に更新できる',
      rule: new RewriteRule(
        'rule-001',
        'oldText',
        'newText',
        'https://example.com',
        false
      ),
    },
    {
      description: '正規表現を含むルールが正常に更新できる',
      rule: new RewriteRule(
        'rule-002',
        '\\d{4}-\\d{13}',
        '<a href="https://example.com/$1">$1</a>',
        'https://example.com',
        true
      ),
    },
    {
      description: 'URLパターンを持つルールが正常に更新できる',
      rule: new RewriteRule(
        'rule-003',
        'search',
        'replace',
        'https://.*\\.example\\.com/.*',
        false
      ),
    },
  ])('$description', async ({ rule }) => {
    // Arrange
    vi.mocked(mockRepository.update).mockResolvedValue();

    // Act
    await useCase.execute(rule);

    // Assert
    expect(mockRepository.update).toHaveBeenCalledTimes(1);
    expect(mockRepository.update).toHaveBeenCalledWith(rule);
  });
});
