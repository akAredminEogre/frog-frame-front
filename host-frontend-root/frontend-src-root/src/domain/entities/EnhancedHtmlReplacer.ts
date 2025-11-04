import { DomDiffer } from 'src/domain/entities/DomDiffer';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

/**
 * Enhanced HTML replacer that uses DOM diffing to preserve element state
 * When DOM diffing fails, leaves the original DOM unchanged
 */
export class EnhancedHtmlReplacer {
  private targetElement: Node;
  private rule: RewriteRule;

  constructor(targetElement: Node, rule: RewriteRule) {
    this.targetElement = targetElement;
    this.rule = rule;
  }

  /**
   * Replace content using DOM diffing
   * When DOM diffing fails, leaves the original DOM unchanged
   */
  replace(): void {
    const rootElement = this.targetElement as Element;
    if (!rootElement.innerHTML) {
      return;
    }

    try {
      // Create DomDiffer instance at the time of rule application
      const domDiffer = new DomDiffer(rootElement, this.rule);
      // Attempt DOM diffing approach
      domDiffer.applyRule();
    } catch (error) {
      // When DOM diffing fails, abandon the replacement and leave DOM unchanged
      console.warn('[EnhancedHtmlReplacer] DOM diffing failed, leaving original DOM unchanged:', error);
      // No fallback - original DOM is preserved
    }
  }

}