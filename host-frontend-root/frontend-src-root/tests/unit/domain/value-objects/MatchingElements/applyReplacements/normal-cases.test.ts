import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { MatchingElements } from 'src/domain/value-objects/MatchingElements';

describe('MatchingElements.applyReplacements - 正常系', () => {
  let mockElements: Element[];
  let mockRule: RewriteRule;
  let mockReplacer: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Create mock DOM elements
    const element1 = document.createElement('div');
    element1.textContent = 'element1';
    const element2 = document.createElement('span');
    element2.textContent = 'element2';
    
    mockElements = [element1, element2];
    mockRule = new RewriteRule(1, 'old', 'new', '');
    mockReplacer = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should call replacer function for each element in the collection', () => {
    const matchingElements = new MatchingElements(mockElements);

    matchingElements.applyReplacements(mockRule, mockReplacer);

    expect(mockReplacer).toHaveBeenCalledTimes(2);
    expect(mockReplacer).toHaveBeenNthCalledWith(1, mockElements[0], mockRule);
    expect(mockReplacer).toHaveBeenNthCalledWith(2, mockElements[1], mockRule);
  });

  it('should handle empty collection without calling replacer', () => {
    const matchingElements = new MatchingElements([]);

    matchingElements.applyReplacements(mockRule, mockReplacer);

    expect(mockReplacer).not.toHaveBeenCalled();
  });
});