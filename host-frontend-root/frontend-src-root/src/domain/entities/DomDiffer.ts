import { RegexConstants } from 'src/domain/constants/RegexConstants';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { MatchingElements } from 'src/domain/value-objects/MatchingElements';
import { ElementMatchesFlexiblePattern } from 'src/domain/entities/ElementMatchesFlexiblePattern';

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
      this.replaceElementPreservingState(element, rule);
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
   * Replace a single element while preserving surrounding DOM state
   * @param element The element to replace
   * @param rule The rewrite rule to apply
   */
  private replaceElementPreservingState(element: Element, rule: RewriteRule): void {
    const parent = element.parentNode;
    if (!parent) return;

    // Get the actual replacement content by applying regex substitution if needed
    const replacementContent = this.getReplacementContent(element, rule);
    
    // Parse the replacement content to create replacement nodes
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = replacementContent;
    
    // Insert all replacement nodes
    const replacementNodes = Array.from(tempContainer.childNodes);
    
    // Insert replacement nodes before the original element
    replacementNodes.forEach(node => {
      parent.insertBefore(node.cloneNode(true), element);
    });
    
    // Remove the original element
    parent.removeChild(element);
  }

  /**
   * Get the actual replacement content by applying regex substitution if the rule uses regex
   * @param element The element being replaced
   * @param rule The rewrite rule to apply
   * @returns The final replacement content with substitutions applied
   */
  private getReplacementContent(element: Element, rule: RewriteRule): string {
    if (!rule.isRegex) {
      return rule.newString;
    }

    // For regex rules, we need to apply the original regex pattern with whitespace normalization
    try {
      const elementHtml = element.outerHTML;
      
      // Normalize whitespace in both the element HTML and apply the original pattern
      const normalizedElementHtml = elementHtml.replace(/\s+/g, ' ').trim();
      const normalizedOldString = rule.oldString.replace(/\s+/g, ' ').trim();
      const normalizedRegex = new RegExp(normalizedOldString, RegexConstants.REGEX_FLAGS_GLOBAL_MULTILINE);
      
      // Apply regex replacement to get the actual content
      const result = normalizedElementHtml.replace(normalizedRegex, rule.newString);
      
      // If no replacement occurred, try with the redundant pattern approach
      if (result === normalizedElementHtml) {
        // Fallback to the redundant pattern
        const redundantPattern = rule.createRedundantPattern();
        if (redundantPattern) {
          const redundantRegex = new RegExp(redundantPattern, RegexConstants.REGEX_FLAGS_GLOBAL_MULTILINE);
          return elementHtml.replace(redundantRegex, rule.newString);
        }
      }
      
      return result;
    } catch (error) {
      console.warn('[DomDiffer] Regex replacement failed:', error);
      return rule.newString;
    }
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