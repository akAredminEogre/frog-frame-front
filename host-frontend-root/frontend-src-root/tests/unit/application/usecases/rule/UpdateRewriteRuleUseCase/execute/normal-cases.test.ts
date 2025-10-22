import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UpdateRewriteRuleUseCase } from 'src/application/usecases/rule/UpdateRewriteRuleUseCase';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { Tabs } from 'src/domain/value-objects/Tabs';
import { createMockTabsService } from 'tests/unit/application/ports/IChromeTabsService/createMockTabsService';
import { createMockRewriteRuleRepository } from 'tests/unit/application/ports/IRewriteRuleRepository/createMockRewriteRuleRepository';

/**
 * UpdateRewriteRuleUseCase.execute - 正常系テスト
 * 1. 通常のルールが正常に更新できる
 * 2. 正規表現を含むルールが正常に更新できる
 * 3. URLパターンを持つルールが正常に更新できる
 */
describe('UpdateRewriteRuleUseCase.execute - 正常系', () => {
  let useCase: UpdateRewriteRuleUseCase;
  let mockRepository: IRewriteRuleRepository;
  let mockChromeTabsService: IChromeTabsService;

  beforeEach(() => {
    // モックリポジトリの初期化
    mockRepository = createMockRewriteRuleRepository();

    // モックChromeTabsServiceの初期化
    mockChromeTabsService = createMockTabsService();
    vi.mocked(mockChromeTabsService.queryTabs).mockResolvedValue(new Tabs([]));

    // テスト対象の初期化
    useCase = new UpdateRewriteRuleUseCase(mockRepository, mockChromeTabsService);
  });

  it.each([
    {
      description: '通常のルールが正常に更新できる',
      id: 1,
      params: {
        oldString: 'oldText',
        newString: 'newText',
        urlPattern: 'https://example.com',
        isRegex: false
      },
      expectedRule: new RewriteRule(
        1,
        'oldText',
        'newText',
        'https://example.com',
        false
      ),
    },
    {
      description: '正規表現を含むルールが正常に更新できる',
      id: 2,
      params: {
        oldString: '\\d{4}-\\d{13}',
        newString: '<a href="https://example.com/$1">$1</a>',
        urlPattern: 'https://example.com',
        isRegex: true
      },
      expectedRule: new RewriteRule(
        2,
        '\\d{4}-\\d{13}',
        '<a href="https://example.com/$1">$1</a>',
        'https://example.com',
        true
      ),
    },
    {
      description: 'URLパターンを持つルールが正常に更新できる',
      id: 3,
      params: {
        oldString: 'search',
        newString: 'replace',
        urlPattern: 'https://.*\\.example\\.com/.*',
        isRegex: false
      },
      expectedRule: new RewriteRule(
        3,
        'search',
        'replace',
        'https://.*\\.example\\.com/.*',
        false
      ),
    },
  ])('$description', async ({ id, params, expectedRule }) => {
    // Arrange
    vi.mocked(mockRepository.update).mockResolvedValue();

    // Act
    await useCase.execute(id, params);

    // Assert
    expect(mockRepository.update).toHaveBeenCalledTimes(1);
    expect(mockRepository.update).toHaveBeenCalledWith(expectedRule);
  });
});
