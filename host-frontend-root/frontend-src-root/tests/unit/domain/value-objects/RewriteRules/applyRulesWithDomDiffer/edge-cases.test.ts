/**
 * RewriteRules.applyRulesWithDomDiffer - エッジケーステスト
 * 空のRewriteRulesでもエラーが発生しない
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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
      emptyRules.applyRulesWithDomDiffer(container);
    }).not.toThrow();

    // Assert - content remains unchanged
    expect(container.innerHTML).toBe('<p>Hello World</p>');
  });
});
