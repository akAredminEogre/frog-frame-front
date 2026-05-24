import { createMockElementFactory } from 'tests/unit/domain/ports/IElementFactory/mocks/createMockElementFactory';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DomDiffer } from 'src/domain/entities/DomDiffer';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

const mockElementFactory = createMockElementFactory();

/**
 * 1. DOM構造保持での単純div要素置換処理
 */
describe('DomDiffer - DOM Structure Preservation', () => {
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

  describe('DOM Node Reference Preservation', () => {
    it('DOM構造保持での単純div要素置換処理', () => {
      container.innerHTML = '<div><p id="keep-me">Keep this</p><div>Replace me</div></div>';

      // Store reference to preserved element
      const preservedElement = container.querySelector('#keep-me');

      const rule = RewriteRule.fromParams(1, { oldString: '<div>Replace me</div>', newString: '<span>Replaced!</span>', urlPattern: '', isRegex: false });
      const domDiffer = new DomDiffer(container, rule);
      domDiffer.applyRule(mockElementFactory);

      expect(container.innerHTML).toBe('<div><p id="keep-me">Keep this</p><span>Replaced!</span></div>');

      // Verify that preserved elements are still the same DOM nodes (not recreated)
      const currentPreservedElement = container.querySelector('#keep-me');
      expect(currentPreservedElement).toBe(preservedElement);
    });
  });
});