import { createMockRewriteRuleRepository } from 'tests/unit/application/ports/IRewriteRuleRepository/createMockRewriteRuleRepository';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ApplySavedRulesOnPageLoadUseCase } from 'src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';

describe('ApplySavedRulesOnPageLoadUseCase - Error Handling', () => {
  let useCase: ApplySavedRulesOnPageLoadUseCase;
  let mockRepository: IRewriteRuleRepository;
  let container: HTMLElement;

  beforeEach(() => {
    // Create mock repository using standard factory
    mockRepository = createMockRewriteRuleRepository();

    // Create usecase instance
    useCase = new ApplySavedRulesOnPageLoadUseCase(mockRepository);

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

      container.innerHTML = '<div><p>Original</p></div>';
      const originalHTML = container.innerHTML;

      await useCase.applyAllRules(container, 'https://example.com');

      expect(consoleSpy).toHaveBeenCalledWith(
        '[ApplySavedRulesOnPageLoadUseCase] Error applying saved rules:',
        expect.any(Error)
      );
      expect(container.innerHTML).toBe(originalHTML);
    });

    it('should handle DOM diffing failures gracefully', async () => {
      container.innerHTML = '<div><p>Test</p></div>';

      // Create rule that will cause DOM diffing to fail with invalid regex pattern
      const rule = new RewriteRule(1, '[', '<span>Replaced</span>', '', true); // Invalid regex: unclosed bracket
      const rules = new RewriteRules([rule]);
      vi.mocked(mockRepository.getAll).mockResolvedValue(rules);

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await useCase.applyAllRules(container, 'https://example.com');

      // DOM should remain unchanged when diffing fails
      expect(container.innerHTML).toBe('<div><p>Test</p></div>');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ApplySavedRulesOnPageLoadUseCase] Error applying saved rules'),
        expect.any(Error)
      );
    });
  });
});