import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UpdateRewriteRuleUseCase } from 'src/application/usecases/rule/UpdateRewriteRuleUseCase';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { Tabs } from 'src/domain/value-objects/Tabs';

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
    mockRepository = {
      getById: vi.fn(),
      getAll: vi.fn(),
      set: vi.fn(),
    };

    // モックChromeTabsServiceの初期化
    mockChromeTabsService = {
      queryTabs: vi.fn().mockResolvedValue(new Tabs([])),
      sendApplyAllRulesMessage: vi.fn(),
      sendMessage: vi.fn(),
      openEditPage: vi.fn(),
    };

    // テスト対象の初期化
    useCase = new UpdateRewriteRuleUseCase(mockRepository, mockChromeTabsService);
  });

  it.each([
    {
      description: '通常のルールが正常に更新できる',
      id: 'rule-001',
      params: {
        oldString: 'oldText',
        newString: 'newText',
        urlPattern: 'https://example.com',
        isRegex: false
      },
      expectedRule: new RewriteRule(
        'rule-001',
        'oldText',
        'newText',
        'https://example.com',
        false
      ),
    },
    {
      description: '正規表現を含むルールが正常に更新できる',
      id: 'rule-002',
      params: {
        oldString: '\\d{4}-\\d{13}',
        newString: '<a href="https://example.com/$1">$1</a>',
        urlPattern: 'https://example.com',
        isRegex: true
      },
      expectedRule: new RewriteRule(
        'rule-002',
        '\\d{4}-\\d{13}',
        '<a href="https://example.com/$1">$1</a>',
        'https://example.com',
        true
      ),
    },
    {
      description: 'URLパターンを持つルールが正常に更新できる',
      id: 'rule-003',
      params: {
        oldString: 'search',
        newString: 'replace',
        urlPattern: 'https://.*\\.example\\.com/.*',
        isRegex: false
      },
      expectedRule: new RewriteRule(
        'rule-003',
        'search',
        'replace',
        'https://.*\\.example\\.com/.*',
        false
      ),
    },
  ])('$description', async ({ id, params, expectedRule }) => {
    // Arrange
    vi.mocked(mockRepository.set).mockResolvedValue();

    // Act
    await useCase.execute(id, params);

    // Assert
    expect(mockRepository.set).toHaveBeenCalledTimes(1);
    expect(mockRepository.set).toHaveBeenCalledWith(expectedRule);
  });
});
