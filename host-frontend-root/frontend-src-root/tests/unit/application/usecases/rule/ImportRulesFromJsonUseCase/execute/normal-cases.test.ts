import { createMockRewriteRuleRepository } from 'tests/unit/application/ports/IRewriteRuleRepository/createMockRewriteRuleRepository';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ImportRulesFromJsonUseCase } from 'src/application/usecases/rule/ImportRulesFromJsonUseCase';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

/**
 * ImportRulesFromJsonUseCase.execute - 正常系テスト
 * 1. 単一のルールを正常にインポートできる
 * 2. 複数のルールを正常にインポートできる
 * 3. 正規表現を含むルールを正常にインポートできる
 * 4. isActiveフラグがfalseのルールを正常にインポートできる
 */
describe('ImportRulesFromJsonUseCase.execute - 正常系', () => {
  let useCase: ImportRulesFromJsonUseCase;
  let mockRepository: IRewriteRuleRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository = createMockRewriteRuleRepository();
    vi.mocked(mockRepository.create).mockResolvedValue();
    useCase = new ImportRulesFromJsonUseCase(mockRepository);
  });

  it('単一のルールを正常にインポートできる', async () => {
    const jsonString = JSON.stringify({
      version: '1.0',
      exportDate: '2025-11-24T00:00:00.000Z',
      rules: [
        {
          oldString: 'old',
          newString: 'new',
          urlPattern: 'https://example.com',
          isRegex: false,
          isActive: true,
        },
      ],
    });

    await useCase.execute(jsonString);

    expect(mockRepository.create).toHaveBeenCalledTimes(1);
    const calledRule = vi.mocked(mockRepository.create).mock.calls[0][0];
    expect(calledRule).toBeInstanceOf(RewriteRule);
    expect(calledRule.oldString).toBe('old');
    expect(calledRule.newString).toBe('new');
    expect(calledRule.urlPattern).toBe('https://example.com');
    expect(calledRule.isRegex).toBe(false);
    expect(calledRule.isActive).toBe(true);
  });

  it('複数のルールを正常にインポートできる', async () => {
    const jsonString = JSON.stringify({
      version: '1.0',
      exportDate: '2025-11-24T00:00:00.000Z',
      rules: [
        {
          oldString: 'old1',
          newString: 'new1',
          urlPattern: 'https://example.com',
          isRegex: false,
          isActive: true,
        },
        {
          oldString: 'old2',
          newString: 'new2',
          urlPattern: 'https://test.com',
          isRegex: false,
          isActive: true,
        },
        {
          oldString: 'old3',
          newString: 'new3',
          urlPattern: 'https://demo.com',
          isRegex: false,
          isActive: true,
        },
      ],
    });

    await useCase.execute(jsonString);

    expect(mockRepository.create).toHaveBeenCalledTimes(3);

    const firstRule = vi.mocked(mockRepository.create).mock.calls[0][0];
    expect(firstRule.oldString).toBe('old1');
    expect(firstRule.newString).toBe('new1');

    const secondRule = vi.mocked(mockRepository.create).mock.calls[1][0];
    expect(secondRule.oldString).toBe('old2');
    expect(secondRule.newString).toBe('new2');

    const thirdRule = vi.mocked(mockRepository.create).mock.calls[2][0];
    expect(thirdRule.oldString).toBe('old3');
    expect(thirdRule.newString).toBe('new3');
  });

  it('正規表現を含むルールを正常にインポートできる', async () => {
    const jsonString = JSON.stringify({
      version: '1.0',
      exportDate: '2025-11-24T00:00:00.000Z',
      rules: [
        {
          oldString: '\\d{4}-\\d{13}',
          newString: '<a href="https://example.com/$1">$1</a>',
          urlPattern: 'https://example.com',
          isRegex: true,
          isActive: true,
        },
      ],
    });

    await useCase.execute(jsonString);

    expect(mockRepository.create).toHaveBeenCalledTimes(1);
    const calledRule = vi.mocked(mockRepository.create).mock.calls[0][0];
    expect(calledRule.oldString).toBe('\\d{4}-\\d{13}');
    expect(calledRule.newString).toBe(
      '<a href="https://example.com/$1">$1</a>'
    );
    expect(calledRule.isRegex).toBe(true);
  });

  it('isActiveフラグがfalseのルールを正常にインポートできる', async () => {
    const jsonString = JSON.stringify({
      version: '1.0',
      exportDate: '2025-11-24T00:00:00.000Z',
      rules: [
        {
          oldString: 'old',
          newString: 'new',
          urlPattern: 'https://example.com',
          isRegex: false,
          isActive: false,
        },
      ],
    });

    await useCase.execute(jsonString);

    expect(mockRepository.create).toHaveBeenCalledTimes(1);
    const calledRule = vi.mocked(mockRepository.create).mock.calls[0][0];
    expect(calledRule.isActive).toBe(false);
  });
});
