/**
 * RewriteRules.applyRulesWithDomDiffer - 正常系テスト
 * 全てのルールがDOMに適用される
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

  it('全てのルールがDOMに適用される', () => {
    // Arrange
    const rulesObject: Record<string, RewriteRule> = {
      1: new RewriteRule(1, '<p>Hello</p>', '<p>Hi</p>', 'https://example.com'),
      2: new RewriteRule(2, '<span>World</span>', '<span>Universe</span>', 'https://example.com'),
      3: new RewriteRule(3, '<div>Keep</div>', '<div>Changed</div>', 'https://other.com'),
    };
    const rewriteRules = new RewriteRules(rulesObject);
    container.innerHTML = '<p>Hello</p><span>World</span><div>Keep</div>';

    // Act
    rewriteRules.applyRulesWithDomDiffer(container);

    // Assert - 全てのルールが適用される
    expect(container.innerHTML).toContain('Hi');
    expect(container.innerHTML).toContain('Universe');
    expect(container.innerHTML).toContain('Changed');
    expect(container.innerHTML).not.toContain('Hello');
    expect(container.innerHTML).not.toContain('World');
    expect(container.innerHTML).not.toContain('Keep');
  });
});
