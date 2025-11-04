/**
 * ElementMatchesFlexiblePattern.hasRequiredAttributes - Edge Cases
 * Tests for edge case scenarios in attribute matching
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ElementMatchesFlexiblePattern } from 'src/domain/entities/ElementMatchesFlexiblePattern';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

describe('ElementMatchesFlexiblePattern.hasRequiredAttributes - Edge Cases', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  const edgeCases = [
    {
      description: 'should handle case-insensitive attribute names (browser normalization)',
      elementHTML: '<div CLASS="test">content</div>',
      expectedHTML: '<div class="test">content</div>',
      expected: true // Browser normalizes attribute names to lowercase in DOM
    },
    {
      description: 'should handle case-sensitive attribute values correctly',
      elementHTML: '<div class="Test">content</div>',
      expectedHTML: '<div class="test">content</div>',
      expected: false
    },
    {
      description: 'should handle multiple attributes with same value',
      elementHTML: '<div class="test" title="test">content</div>',
      expectedHTML: '<div class="test" title="test">content</div>',
      expected: true
    },
    {
      description: 'should handle boolean attributes correctly',
      elementHTML: '<input disabled required>',
      expectedHTML: '<input disabled>',
      expected: true
    },
    {
      description: 'should handle numeric attribute values',
      elementHTML: '<input maxlength="100" tabindex="5">',
      expectedHTML: '<input maxlength="100">',
      expected: true
    },
    {
      description: 'should handle whitespace in attribute values',
      elementHTML: '<div title=" test  value ">content</div>',
      expectedHTML: '<div title=" test  value ">content</div>',
      expected: true
    },
    {
      description: 'should return false when whitespace differs in attribute values',
      elementHTML: '<div title="test value">content</div>',
      expectedHTML: '<div title=" test  value ">content</div>',
      expected: false
    },
    {
      description: 'should handle elements with many attributes',
      elementHTML: '<div a="1" b="2" c="3" d="4" e="5" f="6" g="7" h="8">content</div>',
      expectedHTML: '<div a="1" b="2" c="3" d="4" e="5">content</div>',
      expected: true
    }
  ];

  edgeCases.forEach((testCase) => {
    it(testCase.description, () => {
      // Setup element
      container.innerHTML = testCase.elementHTML;
      const element = container.firstElementChild as Element;

      // Setup expected element
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = testCase.expectedHTML;
      const expectedElement = tempDiv.firstElementChild as Element;

      // Create ElementMatchesFlexiblePattern instance with dummy rule
      const rule = new RewriteRule(1, 'test', 'replacement', '');
      const matcher = new ElementMatchesFlexiblePattern(element, rule);

      // Execute and verify
      const result = matcher.hasRequiredAttributes(expectedElement);
      expect(result).toBe(testCase.expected);
    });
  });
});