import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

/**
 * First-class collection for DOM elements that match a rewrite rule pattern
 * Encapsulates the collection behavior and replacement operations
 */
export class MatchingElements {
  private elements: Element[];

  constructor(elements: Element[]) {
    this.elements = elements;
  }

  /**
   * Apply replacement to all matching elements using the given rule
   * @param rule The rewrite rule to apply for replacement
   * @param replacer Function that handles the actual replacement operation
   */
  applyReplacements(rule: RewriteRule, replacer: (element: Element, rule: RewriteRule) => void): void {
    this.elements.forEach(element => {
      replacer(element, rule);
    });
  }
}