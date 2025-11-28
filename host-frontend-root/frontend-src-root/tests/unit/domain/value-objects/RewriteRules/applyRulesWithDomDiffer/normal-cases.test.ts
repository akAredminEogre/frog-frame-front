/**
 * RewriteRules.applyRulesWithDomDiffer - 正常系テスト
 * 複数のルールがある場合、URLにマッチするルールのみが適用される
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

  it('複数のルールがある場合、URLにマッチするルールのみが適用される', () => {
    // Arrange
    // マッチするルール2つとマッチしないルール1つを用意
    const rulesObject: Record<string, RewriteRule> = {
      1: new RewriteRule(1, '<p>Hello</p>', '<p>Hi</p>', 'https://example.com'),
      2: new RewriteRule(2, '<span>World</span>', '<span>Universe</span>', 'https://example.com'),
      3: new RewriteRule(3, '<div>Keep</div>', '<div>Changed</div>', 'https://other.com'), // マッチしない
    };
    const rewriteRules = new RewriteRules(rulesObject);
    container.innerHTML = '<p>Hello</p><span>World</span><div>Keep</div>';

    // Act
    rewriteRules.applyRulesWithDomDiffer('https://example.com/page', container);

    // Assert - マッチするルールのみ適用される
    expect(container.innerHTML).toContain('Hi');
    expect(container.innerHTML).toContain('Universe');
    expect(container.innerHTML).not.toContain('Hello');
    expect(container.innerHTML).not.toContain('World');
    // マッチしないルールは適用されない
    expect(container.innerHTML).toContain('Keep');
    expect(container.innerHTML).not.toContain('Changed');
  });
});
