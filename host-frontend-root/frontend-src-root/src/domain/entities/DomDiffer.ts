import { RegexConstants } from 'src/domain/constants/RegexConstants';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

/**
 * DOM difference engine that performs selective updates instead of full innerHTML replacement
 * This preserves event listeners, styles, and component state during DOM transformations
 */
export class DomDiffer {

  /**
   * Apply a rewrite rule to a DOM element using selective updates
   * Uses createRedundantPattern to handle newline-ignoring patterns like the original HtmlContent
   * Preserves DOM nodes that are not being replaced to maintain event listeners and state
   * @param root The root element to apply the rule to
   * @param rule The rewrite rule to apply
   */
  applyRule(root: Element, rule: RewriteRule): void {
    // Find all elements that match the oldString pattern using createRedundantPattern
    const matchingElements = this.findMatchingElementsWithPattern(root, rule);

    // Apply the transformation to each matching element individually
    matchingElements.forEach(element => {
      this.replaceElementPreservingState(element, rule);
    });
  }

  /**
   * Apply HTML changes while preserving element state
   * This method performs selective updates to maintain event listeners and form states
   * @param root The root element to update
   * @param newHtml The new HTML content to apply
   */
  private applyHtmlChanges(root: Element, newHtml: string): void {
    // Create a temporary container with the new HTML
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = newHtml;
    
    // For now, implement a simple approach: preserve key elements by their IDs/classes
    this.preserveElementStates(root);
    
    // Replace the content
    root.innerHTML = newHtml;
    
    // Restore preserved states
    this.restoreElementStates(root);
  }

  /**
   * Store important element states before DOM replacement
   * @param root The root element to scan
   */
  private preserveElementStates(root: Element): void {
    // Store form values
    this.preservedFormStates = new Map();
    const inputs = root.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      const id = input.id || input.getAttribute('name');
      if (id && (input as HTMLInputElement).value) {
        this.preservedFormStates.set(id, (input as HTMLInputElement).value);
      }
    });
    
    // Store event listeners would require more complex implementation
    // For now, we rely on the framework/application to re-attach listeners
  }

  /**
   * Restore preserved element states after DOM replacement
   * @param root The root element to restore states in
   */
  private restoreElementStates(root: Element): void {
    // Restore form values
    if (this.preservedFormStates) {
      this.preservedFormStates.forEach((value, id) => {
        const element = root.querySelector(`#${id}`) || root.querySelector(`[name="${id}"]`);
        if (element && (element as HTMLInputElement).value !== undefined) {
          (element as HTMLInputElement).value = value;
        }
      });
    }
  }

  private preservedFormStates: Map<string, string> = new Map();

  /**
   * Find elements that match the rule's pattern using createRedundantPattern
   * @param root The root element to search from
   * @param rule The rewrite rule containing the pattern to match
   * @returns Array of elements that match the pattern
   */
  private findMatchingElementsWithPattern(root: Element, rule: RewriteRule): Element[] {
    const matchingElements: Element[] = [];
    
    // For DOM diffing, we need more flexible attribute matching
    // Use a combination of exact pattern matching and attribute-flexible matching
    const regexPattern = rule.createRedundantPattern();
    
    // Validate pattern before creating regex
    if (!regexPattern || regexPattern.trim() === '') {
      throw new Error('Invalid or empty pattern generated from rule');
    }
    
    
    const regex = new RegExp(regexPattern, RegexConstants.REGEX_FLAGS_GLOBAL_MULTILINE);
    
    
    // Walk through only children elements, not the root container
    this.walkDomTree(root, (element) => {
      if (this.elementMatchesFlexiblePattern(element, rule, regex)) {
        matchingElements.push(element);
      }
    });
    
    return matchingElements;
  }

  /**
   * Check if an element matches the pattern with flexible attribute handling
   * @param element The element to check
   * @param rule The rewrite rule
   * @param regex The regex pattern to match against
   * @returns true if the element matches
   */
  private elementMatchesFlexiblePattern(element: Element, rule: RewriteRule, regex: RegExp): boolean {
    const outerHTML = element.outerHTML;
    
    // Reset regex lastIndex to ensure consistent matching
    regex.lastIndex = 0;
    
    // First try exact pattern matching
    const exactMatch = regex.exec(outerHTML);
    
    if (exactMatch && exactMatch.index === 0 && exactMatch[0].length === outerHTML.length) {
      return true;
    }
    
    // If exact match fails, try structural matching for attribute flexibility
    return this.structuralElementMatch(element, rule);
  }

  /**
   * Check if element matches structurally (tag, required attributes, content) allowing additional attributes
   * @param element The element to check
   * @param rule The rewrite rule
   * @returns true if element matches the structural requirements
   */
  private structuralElementMatch(element: Element, rule: RewriteRule): boolean {
    const ruleHtml = rule.oldString;
    
    // Parse the rule's expected element
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = ruleHtml;
    const expectedElement = tempDiv.firstElementChild;
    
    if (!expectedElement) return false;
    
    // Check tag name match
    if (element.tagName.toLowerCase() !== expectedElement.tagName.toLowerCase()) {
      return false;
    }
    
    // Enhanced text content match that ignores whitespace differences
    const elementText = this.normalizeWhitespace(element.textContent || '');
    const expectedText = this.normalizeWhitespace(expectedElement.textContent || '');
    if (expectedText && elementText !== expectedText) {
      return false;
    }
    
    // Check required attributes (element must have all attributes from rule, but can have additional ones)
    const expectedAttributes = expectedElement.attributes;
    for (let i = 0; i < expectedAttributes.length; i++) {
      const attr = expectedAttributes[i];
      const elementAttrValue = element.getAttribute(attr.name);
      if (elementAttrValue !== attr.value) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Normalize whitespace in text content to handle newlines and multiple spaces
   * @param text The text to normalize
   * @returns Normalized text with single spaces
   */
  private normalizeWhitespace(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
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
   * @param root The root element to start from
   * @param callback Function to call for each element
   */
  private walkDomTree(root: Element, callback: (element: Element) => void): void {
    // Only walk children, not the root itself to avoid replacing the container
    Array.from(root.children).forEach(child => {
      callback(child);
      this.walkDomTree(child, callback);
    });
  }

}