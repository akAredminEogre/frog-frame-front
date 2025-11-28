/**
 * RewriteRules.applyRulesWithDomDiffer - 正常系テスト
 * 1. URLにマッチするルールのみが適用される
 * 2. URLにマッチしないルールは適用されない
 * 3. 空のRewriteRulesでもエラーが発生しない
 * 4. 複数のマッチするルールがすべて適用される
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';

describe('RewriteRules.applyRulesWithDomDiffer - 正常系', () => {
  let container: HTMLElement;

  beforeEach(() => {
    vi.clearAllMocks();
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.resetAllMocks();
  });

  const testCases = [
    {
      description: 'URLにマッチするルールのみが適用される',
      input: {
        rules: [
          { id: 1, oldString: '<p>Hello</p>', newString: '<p>Goodbye</p>', urlPattern: 'https://example.com' },
        ],
        currentUrl: 'https://example.com/page',
        initialHtml: '<p>Hello</p>',
      },
      expected: {
        htmlContains: 'Goodbye',
        htmlNotContains: 'Hello',
      },
    },
    {
      description: 'URLにマッチしないルールは適用されない',
      input: {
        rules: [
          { id: 1, oldString: '<p>Hello</p>', newString: '<p>Goodbye</p>', urlPattern: 'https://other.com' },
        ],
        currentUrl: 'https://example.com/page',
        initialHtml: '<p>Hello</p>',
      },
      expected: {
        htmlContains: 'Hello',
        htmlNotContains: 'Goodbye',
      },
    },
    {
      description: '複数のマッチするルールがすべて適用される',
      input: {
        rules: [
          { id: 1, oldString: '<p>Hello</p>', newString: '<p>Hi</p>', urlPattern: 'https://example.com' },
          { id: 2, oldString: '<span>World</span>', newString: '<span>Universe</span>', urlPattern: 'https://example.com' },
        ],
        currentUrl: 'https://example.com/page',
        initialHtml: '<p>Hello</p><span>World</span>',
      },
      expected: {
        htmlContains: 'Hi',
        htmlContains2: 'Universe',
        htmlNotContains: 'Hello',
        htmlNotContains2: 'World',
      },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      // Arrange
      const rulesObject: Record<string, RewriteRule> = {};
      testCase.input.rules.forEach((ruleData) => {
        rulesObject[ruleData.id] = new RewriteRule(
          ruleData.id,
          ruleData.oldString,
          ruleData.newString,
          ruleData.urlPattern
        );
      });
      const rewriteRules = new RewriteRules(rulesObject);
      container.innerHTML = testCase.input.initialHtml;

      // Act
      rewriteRules.applyRulesWithDomDiffer(testCase.input.currentUrl, container);

      // Assert
      expect(container.innerHTML).toContain(testCase.expected.htmlContains);
      if (testCase.expected.htmlContains2) {
        expect(container.innerHTML).toContain(testCase.expected.htmlContains2);
      }
      expect(container.innerHTML).not.toContain(testCase.expected.htmlNotContains);
      if (testCase.expected.htmlNotContains2) {
        expect(container.innerHTML).not.toContain(testCase.expected.htmlNotContains2);
      }
    });
  });

  it('空のRewriteRulesでもエラーが発生しない', () => {
    const emptyRules = new RewriteRules();
    container.innerHTML = '<p>Hello World</p>';

    // Act - should not throw
    expect(() => {
      emptyRules.applyRulesWithDomDiffer('https://example.com', container);
    }).not.toThrow();

    // Assert - content remains unchanged
    expect(container.innerHTML).toBe('<p>Hello World</p>');
  });

  it('空のurlPatternを持つルールは適用されない', () => {
    // Arrange
    const rulesObject: Record<string, RewriteRule> = {
      1: new RewriteRule(1, 'Hello', 'Goodbye', ''),
    };
    const rewriteRules = new RewriteRules(rulesObject);
    container.innerHTML = '<p>Hello World</p>';

    // Act
    rewriteRules.applyRulesWithDomDiffer('https://example.com/page', container);

    // Assert - content remains unchanged because empty urlPattern returns false
    expect(container.innerHTML).toContain('Hello');
    expect(container.innerHTML).not.toContain('Goodbye');
  });
});
