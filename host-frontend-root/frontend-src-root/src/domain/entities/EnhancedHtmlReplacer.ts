import { DomDiffer } from 'src/domain/entities/DomDiffer';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

/**
 * Enhanced HTML replacer that uses DOM diffing to preserve element state
 * When DOM diffing fails, leaves the original DOM unchanged
 */
export class EnhancedHtmlReplacer {
  private domDiffer: DomDiffer;

  constructor() {
    this.domDiffer = new DomDiffer();
  }

  /**
   * Replace content using DOM diffing
   * When DOM diffing fails, leaves the original DOM unchanged
   * @param root The root element to apply replacements to
   * @param rule The rewrite rule to apply
   */
  replace(root: Node, rule: RewriteRule): void {
    const rootElement = root as Element;
    if (!rootElement.innerHTML) {
      return;
    }

    try {
      // Attempt DOM diffing approach
      this.domDiffer.applyRule(rootElement, rule);
    } catch (error) {
      // When DOM diffing fails, abandon the replacement and leave DOM unchanged
      console.warn('[EnhancedHtmlReplacer] DOM diffing failed, leaving original DOM unchanged:', error);
      // No fallback - original DOM is preserved
    }
  }

}