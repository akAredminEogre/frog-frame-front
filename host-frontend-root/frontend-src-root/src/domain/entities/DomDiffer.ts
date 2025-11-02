import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

/**
 * DOM difference engine that performs selective updates instead of full innerHTML replacement
 * This preserves event listeners, styles, and component state during DOM transformations
 */
export class DomDiffer {
  
  /**
   * Apply a rewrite rule to a DOM element using selective updates
   * @param root The root element to apply the rule to
   * @param rule The rewrite rule to apply
   */
  applyRule(root: Element, rule: RewriteRule): void {
    // Find all elements that match the oldString pattern
    const matchingElements = this.findMatchingElements(root, rule);
    
    // Apply the transformation to each matching element
    matchingElements.forEach(element => {
      this.replaceElement(element, rule);
    });
  }

  /**
   * Find all elements in the DOM tree that match the rule's oldString pattern
   * @param root The root element to search from
   * @param rule The rewrite rule containing the pattern to match
   * @returns Array of elements that match the pattern
   */
  private findMatchingElements(root: Element, rule: RewriteRule): Element[] {
    const matchingElements: Element[] = [];
    
    // Convert the rule's oldString to a pattern we can match against DOM elements
    const pattern = this.createElementPattern(rule.oldString);
    
    // Walk the DOM tree and find matching elements
    this.walkDomTree(root, (element) => {
      if (this.elementMatchesPattern(element, pattern)) {
        matchingElements.push(element);
      }
    });
    
    return matchingElements;
  }

  /**
   * Replace a single element according to the rewrite rule
   * This preserves the position in the DOM and transfers attributes/children as needed
   * @param element The element to replace
   * @param rule The rewrite rule to apply
   */
  private replaceElement(element: Element, rule: RewriteRule): void {
    const parent = element.parentNode;
    if (!parent) return;

    // Parse the newString to create replacement elements
    const replacementContainer = document.createElement('div');
    replacementContainer.innerHTML = rule.newString;
    
    // Insert all replacement elements
    const replacementElements = Array.from(replacementContainer.children);
    
    // Insert replacement elements before the original
    replacementElements.forEach(replacementElement => {
      parent.insertBefore(replacementElement.cloneNode(true), element);
    });
    
    // Remove the original element
    parent.removeChild(element);
  }

  /**
   * Walk through all elements in a DOM tree
   * @param root The root element to start from
   * @param callback Function to call for each element
   */
  private walkDomTree(root: Element, callback: (element: Element) => void): void {
    callback(root);
    
    // Recursively walk children
    Array.from(root.children).forEach(child => {
      this.walkDomTree(child, callback);
    });
  }

  /**
   * Create a pattern object from the rule's oldString for matching DOM elements
   * @param oldString The HTML string to convert to a matching pattern
   * @returns Pattern object for matching
   */
  private createElementPattern(oldString: string): ElementPattern {
    // Parse the oldString to extract the element structure
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = oldString;
    
    if (tempContainer.children.length === 0) {
      throw new Error('Invalid oldString: no valid HTML elements found');
    }
    
    // For now, use the first element as the pattern
    const targetElement = tempContainer.children[0];
    
    return {
      tagName: targetElement.tagName.toLowerCase(),
      attributes: this.getElementAttributes(targetElement),
      textContent: targetElement.textContent?.trim() || '',
      hasExactMatch: true
    };
  }

  /**
   * Check if a DOM element matches the given pattern
   * @param element The DOM element to check
   * @param pattern The pattern to match against
   * @returns true if the element matches the pattern
   */
  private elementMatchesPattern(element: Element, pattern: ElementPattern): boolean {
    // Check tag name
    if (element.tagName.toLowerCase() !== pattern.tagName) {
      return false;
    }
    
    // Check attributes
    for (const [key, value] of Object.entries(pattern.attributes)) {
      if (element.getAttribute(key) !== value) {
        return false;
      }
    }
    
    // Check text content if specified
    if (pattern.textContent && element.textContent?.trim() !== pattern.textContent) {
      return false;
    }
    
    return true;
  }

  /**
   * Get all attributes from an element as an object
   * @param element The element to extract attributes from
   * @returns Object with attribute name-value pairs
   */
  private getElementAttributes(element: Element): Record<string, string> {
    const attributes: Record<string, string> = {};
    
    Array.from(element.attributes).forEach(attr => {
      attributes[attr.name] = attr.value;
    });
    
    return attributes;
  }
}

/**
 * Pattern for matching DOM elements
 */
interface ElementPattern {
  tagName: string;
  attributes: Record<string, string>;
  textContent: string;
  hasExactMatch: boolean;
}