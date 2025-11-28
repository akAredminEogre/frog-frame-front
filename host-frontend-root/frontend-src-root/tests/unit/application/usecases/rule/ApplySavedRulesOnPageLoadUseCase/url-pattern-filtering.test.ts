import { createMockCurrentUrlService } from 'tests/unit/application/ports/ICurrentUrlService/createMockCurrentUrlService';
import { createMockRewriteRuleRepository } from 'tests/unit/application/ports/IRewriteRuleRepository/createMockRewriteRuleRepository';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { ICurrentUrlService } from 'src/application/ports/ICurrentUrlService';
import type { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ApplySavedRulesOnPageLoadUseCase } from 'src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';

describe('ApplySavedRulesOnPageLoadUseCase - URL Pattern Filtering', () => {
  let useCase: ApplySavedRulesOnPageLoadUseCase;
  let mockRepository: IRewriteRuleRepository;
  let mockCurrentUrlService: ICurrentUrlService;
  let container: HTMLElement;

  beforeEach(() => {
    mockRepository = createMockRewriteRuleRepository();
    mockCurrentUrlService = createMockCurrentUrlService();
    useCase = new ApplySavedRulesOnPageLoadUseCase(mockRepository, mockCurrentUrlService);
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.clearAllMocks();
  });

  /**
   * URL pattern filtering test cases
   * Tests URL matching behavior for rule application
   */
  const urlFilteringTestCases = [
    {
      description: 'should apply rules when URL matches pattern',
      input: {
        initialHtml: '<div><p>Replace me</p></div>',
        ruleUrlPattern: 'https://example.com',
        currentUrl: 'https://example.com/path',
      },
      expected: {
        html: '<div><span>Replaced</span></div>',
      },
    },
    {
      description: 'should skip rules when URL does not match pattern',
      input: {
        initialHtml: '<div><p>Replace me</p></div>',
        ruleUrlPattern: 'https://other-site.com',
        currentUrl: 'https://example.com',
      },
      expected: {
        html: '<div><p>Replace me</p></div>', // Unchanged
      },
    },
  ];

  urlFilteringTestCases.forEach(({ description, input, expected }) => {
    it(description, async () => {
      container.innerHTML = input.initialHtml;

      const rule = new RewriteRule(1, '<p>Replace me</p>', '<span>Replaced</span>', input.ruleUrlPattern);
      const rules = new RewriteRules([rule]);
      vi.mocked(mockRepository.getAll).mockResolvedValue(rules);
      vi.mocked(mockCurrentUrlService.getCurrentUrl).mockReturnValue(input.currentUrl);

      await useCase.exec(container);

      expect(container.innerHTML).toBe(expected.html);
    });
  });
});