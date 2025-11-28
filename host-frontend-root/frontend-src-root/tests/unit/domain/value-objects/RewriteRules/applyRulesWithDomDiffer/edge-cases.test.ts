/**
 * RewriteRules.applyRulesWithDomDiffer - エッジケーステスト
 * 1. 空のRewriteRulesでもエラーが発生しない
 * 2. 空のurlPatternを持つルールは適用されない
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';

describe('RewriteRules.applyRulesWithDomDiffer - エッジケース', () => {
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
      1: new RewriteRule(1, '<p>Hello</p>', '<p>Goodbye</p>', ''),
    };
    const rewriteRules = new RewriteRules(rulesObject);
    container.innerHTML = '<p>Hello</p>';

    // Act
    rewriteRules.applyRulesWithDomDiffer('https://example.com/page', container);

    // Assert - content remains unchanged because empty urlPattern returns false
    expect(container.innerHTML).toContain('Hello');
    expect(container.innerHTML).not.toContain('Goodbye');
  });
});
