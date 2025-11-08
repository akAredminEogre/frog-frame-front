import { createMockRewriteRuleRepository } from 'tests/unit/application/ports/IRewriteRuleRepository/createMockRewriteRuleRepository';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ApplySavedRulesOnPageLoadUseCase } from 'src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';

describe('ApplySavedRulesOnPageLoadUseCase - DomDiffer Integration', () => {
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

  describe('DOM State Preservation with DomDiffer', () => {
    it('should preserve event listeners on unmodified elements when applying rules', async () => {
      // Setup DOM with event listener
      container.innerHTML = '<div><button id="keep">Keep</button><p>Replace me</p></div>';
      
      const button = container.querySelector('#keep') as HTMLButtonElement;
      let clickCount = 0;
      const clickHandler = () => { clickCount++; };
      button.addEventListener('click', clickHandler);

      // Setup mock repository with replacement rule
      const rule = new RewriteRule(1, '<p>Replace me</p>', '<span>Replaced</span>', '');
      const rules = new RewriteRules([rule]);
      vi.mocked(mockRepository.getAll).mockResolvedValue(rules);

      // Apply rules through use case
      await useCase.applyAllRules(container, 'https://example.com');

      // Verify event listener is preserved
      const preservedButton = container.querySelector('#keep') as HTMLButtonElement;
      expect(preservedButton).toBe(button); // Same DOM node
      
      preservedButton.click();
      expect(clickCount).toBe(1);

      // Verify replacement occurred
      expect(container.innerHTML).toBe('<div><button id="keep">Keep</button><span>Replaced</span></div>');
    });

    it('should preserve form input values when applying rules', async () => {
      // Setup DOM with form input
      container.innerHTML = '<div><input id="preserve" type="text"><p>Replace me</p></div>';
      
      const input = container.querySelector('#preserve') as HTMLInputElement;
      input.value = 'important data';

      // Setup mock repository with replacement rule
      const rule = new RewriteRule(1, '<p>Replace me</p>', '<span>Replaced</span>', '');
      const rules = new RewriteRules([rule]);
      vi.mocked(mockRepository.getAll).mockResolvedValue(rules);

      // Apply rules through use case
      await useCase.applyAllRules(container, 'https://example.com');

      // Verify input value is preserved
      const preservedInput = container.querySelector('#preserve') as HTMLInputElement;
      expect(preservedInput).toBe(input); // Same DOM node
      expect(preservedInput.value).toBe('important data');

      // Verify replacement occurred
      expect(container.innerHTML).toBe('<div><input id="preserve" type="text"><span>Replaced</span></div>');
    });
  });
});