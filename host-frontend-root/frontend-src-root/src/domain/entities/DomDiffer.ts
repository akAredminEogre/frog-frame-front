import { ElementMatchesFlexiblePattern } from 'src/domain/entities/ElementMatchesFlexiblePattern';
import { ReplaceElementPreservingState } from 'src/domain/entities/ReplaceElementPreservingState';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { MatchingElements } from 'src/domain/value-objects/MatchingElements';

/**
 * DOM difference engine that performs selective updates instead of full innerHTML replacement
 * This preserves event listeners, styles, and component state during DOM transformations
 */
export class DomDiffer {
  private root: Element;
  private rule: RewriteRule;

  constructor(root: Element, rule: RewriteRule) {
    this.root = root;
    this.rule = rule;
  }

  /**
   * Apply a rewrite rule to a DOM element using selective updates
   * Uses createRedundantPattern to handle newline-ignoring patterns like the original HtmlContent
   * Preserves DOM nodes that are not being replaced to maintain event listeners and state
   */
  applyRule(): void {
    // Find all elements that match the oldString pattern using createRedundantPattern
    const matchingElements = this.findMatchingElementsWithPattern();

    // Apply the transformation to each matching element individually
    matchingElements.applyReplacements(this.rule, (element, rule) => {
      const replaceElementPreservingState = new ReplaceElementPreservingState(element, rule);
      replaceElementPreservingState.exec();
    });
  }

  /**
   * Find elements that match the rule's pattern using createRedundantPattern
   * @returns MatchingElements collection that match the pattern
   */
  private findMatchingElementsWithPattern(): MatchingElements {
    const matchingElementsArray: Element[] = [];
    
    this.walkDomTree((element) => {
      const matcher = new ElementMatchesFlexiblePattern(element, this.rule);
      if (matcher.exec()) {
        matchingElementsArray.push(element);
      }
    });
    
    return new MatchingElements(matchingElementsArray);
  }


  /**
   * Walk through all elements in a DOM tree
   * @param callback Function to call for each element
   */
  private walkDomTree(callback: (element: Element) => void): void {
    // Only walk children, not the root itself to avoid replacing the container
    Array.from(this.root.children).forEach(child => {
      callback(child);
      this.walkDomTreeRecursive(child, callback);
    });
  }

  /**
   * Recursively walk through DOM tree from a given element
   * @param element The element to start from
   * @param callback Function to call for each element
   */
  private walkDomTreeRecursive(element: Element, callback: (element: Element) => void): void {
    Array.from(element.children).forEach(child => {
      callback(child);
      this.walkDomTreeRecursive(child, callback);
    });
  }

}