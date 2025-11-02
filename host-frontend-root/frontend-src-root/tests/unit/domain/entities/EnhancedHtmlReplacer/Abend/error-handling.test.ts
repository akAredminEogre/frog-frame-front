import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { EnhancedHtmlReplacer } from 'src/domain/entities/EnhancedHtmlReplacer';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

describe('EnhancedHtmlReplacer - Error Handling', () => {
  let enhancedReplacer: EnhancedHtmlReplacer;
  let container: HTMLElement;

  beforeEach(() => {
    enhancedReplacer = new EnhancedHtmlReplacer();
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.clearAllMocks();
  });

  describe('DOM Diffing Failure', () => {
    it('should leave DOM unchanged when DOM diffing fails', () => {
      container.innerHTML = '<div><p>Replace me</p></div>';
      const originalHTML = container.innerHTML;
      
      // Create a rule that will cause DOM diffing to fail (empty oldString)
      const rule = new RewriteRule(1, '', '<span>Replaced</span>', '');
      
      // Mock console.warn to capture warning message
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      // Apply replacement - should leave DOM unchanged
      enhancedReplacer.replace(container, rule);
      
      // Verify warning message was logged
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[EnhancedHtmlReplacer] DOM diffing failed, leaving original DOM unchanged'),
        expect.any(Error)
      );
      
      // Verify DOM remains unchanged
      expect(container.innerHTML).toBe(originalHTML);
    });
  });
});