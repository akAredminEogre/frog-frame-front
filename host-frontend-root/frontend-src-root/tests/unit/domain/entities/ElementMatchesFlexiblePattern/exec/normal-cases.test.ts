import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ElementMatchesFlexiblePattern } from 'src/domain/entities/ElementMatchesFlexiblePattern';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

describe('ElementMatchesFlexiblePattern.exec() - Normal Cases', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  const testCases = [
    // Exact Pattern Matching Cases
    {
      description: 'should match element with exact pattern',
      input: {
        elementHTML: '<div>Replace me</div>',
        rule: {
          oldString: '<div>Replace me</div>',
          newString: '<span>Replaced!</span>',
          urlPattern: '',
          isRegex: false
        }
      },
      expected: true
    },
    {
      description: 'should match element with attributes',
      input: {
        elementHTML: '<button class="btn">Old Button</button>',
        rule: {
          oldString: '<button class="btn">Old Button</button>',
          newString: '<button class="new-btn">New Button</button>',
          urlPattern: '',
          isRegex: false
        }
      },
      expected: true
    },
    {
      description: 'should not match different elements',
      input: {
        elementHTML: '<div>Different content</div>',
        rule: {
          oldString: '<div>Replace me</div>',
          newString: '<span>Replaced!</span>',
          urlPattern: '',
          isRegex: false
        }
      },
      expected: false
    },
    // Structural Matching Cases
    {
      description: 'should match element with additional attributes',
      input: {
        elementHTML: '<button class="btn" onclick="alert()" id="test">Old Button</button>',
        rule: {
          oldString: '<button class="btn">Old Button</button>',
          newString: '<button class="new-btn">New Button</button>',
          urlPattern: '',
          isRegex: false
        }
      },
      expected: true
    },
    {
      description: 'should match with normalized whitespace',
      input: {
        elementHTML: '<div>Replace   me</div>',
        rule: {
          oldString: '<div>Replace me</div>',
          newString: '<span>Replaced!</span>',
          urlPattern: '',
          isRegex: false
        }
      },
      expected: true
    },
    {
      description: 'should not match element with missing required attributes',
      input: {
        elementHTML: '<button>Old Button</button>',
        rule: {
          oldString: '<button class="btn">Old Button</button>',
          newString: '<button class="new-btn">New Button</button>',
          urlPattern: '',
          isRegex: false
        }
      },
      expected: false
    },
    {
      description: 'should not match element with different tag',
      input: {
        elementHTML: '<span class="btn">Old Button</span>',
        rule: {
          oldString: '<button class="btn">Old Button</button>',
          newString: '<button class="new-btn">New Button</button>',
          urlPattern: '',
          isRegex: false
        }
      },
      expected: false
    },
    {
      description: 'should not match element with different attribute value',
      input: {
        elementHTML: '<button class="different">Old Button</button>',
        rule: {
          oldString: '<button class="btn">Old Button</button>',
          newString: '<button class="new-btn">New Button</button>',
          urlPattern: '',
          isRegex: false
        }
      },
      expected: false
    },
    // Regex Pattern Matching Cases
    {
      description: 'should match with regex pattern including HTML tags',
      input: {
        elementHTML: '<div>Test content</div>',
        rule: {
          oldString: '<div>.*?</div>',
          newString: '<div>Updated content</div>',
          urlPattern: '',
          isRegex: true
        }
      },
      expected: true
    },
    {
      description: 'should not match non-matching regex pattern',
      input: {
        elementHTML: '<span>Different content</span>',
        rule: {
          oldString: '<div>.*?</div>',
          newString: '<div>Updated content</div>',
          urlPattern: '',
          isRegex: true
        }
      },
      expected: false
    }
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      // Arrange
      container.innerHTML = testCase.input.elementHTML;
      const element = container.firstElementChild!;
      
      const rule = new RewriteRule(
        1,
        testCase.input.rule.oldString,
        testCase.input.rule.newString,
        testCase.input.rule.urlPattern,
        testCase.input.rule.isRegex
      );
      const matcher = new ElementMatchesFlexiblePattern(element, rule);
      
      // Act
      const result = matcher.exec();
      
      // Assert
      expect(result).toBe(testCase.expected);
    });
  });
});