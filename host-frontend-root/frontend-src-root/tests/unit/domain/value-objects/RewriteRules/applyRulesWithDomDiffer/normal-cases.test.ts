/**
 * RewriteRules.applyRulesWithDomDiffer - 正常系テスト
 * 全てのルールがDOMに適用される
 */
import { createMockElementFactory } from 'tests/unit/domain/ports/IElementFactory/mocks/createMockElementFactory';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

const mockElementFactory = createMockElementFactory();

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
      1: RewriteRule.fromParams(1, { oldString: '<p>Hello</p>', newString: '<p>Hi</p>', urlPattern: 'https://example.com', isRegex: false }),
      2: RewriteRule.fromParams(2, { oldString: '<span>World</span>', newString: '<span>Universe</span>', urlPattern: 'https://example.com', isRegex: false }),
      3: RewriteRule.fromParams(3, { oldString: '<div>Keep</div>', newString: '<div>Changed</div>', urlPattern: 'https://other.com', isRegex: false }),
    };
    const rewriteRules = new RewriteRules(rulesObject);
    container.innerHTML = '<p>Hello</p><span>World</span><div>Keep</div>';

    // Act
    rewriteRules.applyRulesWithDomDiffer(container, mockElementFactory);

    // Assert - 全てのルールが適用される
    expect(container.innerHTML).toContain('Hi');
    expect(container.innerHTML).toContain('Universe');
    expect(container.innerHTML).toContain('Changed');
    expect(container.innerHTML).not.toContain('Hello');
    expect(container.innerHTML).not.toContain('World');
    expect(container.innerHTML).not.toContain('Keep');
  });
});
