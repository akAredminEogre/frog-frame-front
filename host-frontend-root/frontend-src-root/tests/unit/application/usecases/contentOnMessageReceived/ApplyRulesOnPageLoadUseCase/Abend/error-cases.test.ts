import { createMockCurrentUrlService } from 'tests/unit/application/ports/ICurrentUrlService/createMockCurrentUrlService';
import { createMockRewriteRuleRepository } from 'tests/unit/application/ports/IRewriteRuleRepository/createMockRewriteRuleRepository';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { ICurrentUrlService } from 'src/application/ports/ICurrentUrlService';
import type { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ApplyRulesOnPageLoadUseCase } from 'src/application/usecases/contentOnMessageReceived/ApplyRulesOnPageLoadUseCase';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';

describe('ApplyRulesOnPageLoadUseCase - Error Handling', () => {
  let useCase: ApplyRulesOnPageLoadUseCase;
  let mockRepository: IRewriteRuleRepository;
  let mockCurrentUrlService: ICurrentUrlService;
  let container: HTMLElement;

  beforeEach(() => {
    // Create mock repository using standard factory
    mockRepository = createMockRewriteRuleRepository();
    mockCurrentUrlService = createMockCurrentUrlService();

    // Create usecase instance
    useCase = new ApplyRulesOnPageLoadUseCase(mockRepository, mockCurrentUrlService);

    // Setup DOM container
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.clearAllMocks();
  });

  describe('Error Handling', () => {
    it('should continue processing when repository throws error', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(mockRepository.getAll).mockRejectedValue(new Error('Repository error'));
      vi.mocked(mockCurrentUrlService.getCurrentUrl).mockReturnValue('https://example.com');

      container.innerHTML = '<div><p>Original</p></div>';
      const originalHTML = container.innerHTML;

      await useCase.exec(container);

      expect(consoleSpy).toHaveBeenCalledWith(
        '[ApplyRulesOnPageLoadUseCase] Error applying saved rules:',
        expect.any(Error)
      );
      expect(container.innerHTML).toBe(originalHTML);
    });

    it('should handle DOM diffing failures gracefully', async () => {
      container.innerHTML = '<div><p>Test</p></div>';

      // Create rule that will cause DOM diffing to fail with invalid regex pattern
      // urlPattern matches the mock current URL
      const rule = new RewriteRule(1, '[', '<span>Replaced</span>', 'https://example.com', true); // Invalid regex: unclosed bracket
      const rules = new RewriteRules([rule]);
      vi.mocked(mockRepository.getAll).mockResolvedValue(rules);
      vi.mocked(mockCurrentUrlService.getCurrentUrl).mockReturnValue('https://example.com');

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await useCase.exec(container);

      // DOM should remain unchanged when diffing fails
      expect(container.innerHTML).toBe('<div><p>Test</p></div>');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ApplyRulesOnPageLoadUseCase] Error applying saved rules'),
        expect.any(Error)
      );
    });
  });
});
