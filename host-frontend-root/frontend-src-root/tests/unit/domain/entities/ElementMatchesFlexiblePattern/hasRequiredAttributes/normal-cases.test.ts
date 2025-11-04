/**
 * ElementMatchesFlexiblePattern.hasRequiredAttributes - Normal Cases
 * Tests for attribute matching validation between elements
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ElementMatchesFlexiblePattern } from 'src/domain/entities/ElementMatchesFlexiblePattern';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

describe('ElementMatchesFlexiblePattern.hasRequiredAttributes - Normal Cases', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  const testCases = [
    {
      description: 'should return true when element has exact same attributes',
      elementHTML: '<div class="test" id="element">content</div>',
      expectedHTML: '<div class="test" id="element">content</div>',
      expected: true
    },
    {
      description: 'should return true when element has additional attributes',
      elementHTML: '<div class="test" id="element" data-extra="value">content</div>',
      expectedHTML: '<div class="test" id="element">content</div>',
      expected: true
    },
    {
      description: 'should return false when element is missing required attribute',
      elementHTML: '<div class="test">content</div>',
      expectedHTML: '<div class="test" id="element">content</div>',
      expected: false
    },
    {
      description: 'should return false when attribute values do not match',
      elementHTML: '<div class="different" id="element">content</div>',
      expectedHTML: '<div class="test" id="element">content</div>',
      expected: false
    },
    {
      description: 'should return true when both elements have no attributes',
      elementHTML: '<div>content</div>',
      expectedHTML: '<div>content</div>',
      expected: true
    },
    {
      description: 'should return true when expected element has no attributes',
      elementHTML: '<div class="extra" id="additional">content</div>',
      expectedHTML: '<div>content</div>',
      expected: true
    },
    {
      description: 'should handle special attribute characters correctly',
      elementHTML: '<input type="text" data-test="value with spaces" aria-label="test">',
      expectedHTML: '<input type="text" data-test="value with spaces">',
      expected: true
    },
    {
      description: 'should handle empty attribute values',
      elementHTML: '<div class="" title="">content</div>',
      expectedHTML: '<div class="" title="">content</div>',
      expected: true
    }
  ];

  testCases.forEach((testCase) => {
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