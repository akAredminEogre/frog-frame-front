import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DomDiffer } from 'src/domain/entities/DomDiffer';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { IElementFactory } from 'src/domain/ports/IElementFactory';

/**
 * テスト用のIElementFactory実装
 */
const mockElementFactory: IElementFactory = {
  createElement: (tagName: string) => document.createElement(tagName)
};

/**
 * 1. DOM構造保持での単純div要素置換処理
 */
describe('DomDiffer - DOM Structure Preservation', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('DOM Node Reference Preservation', () => {
    it('DOM構造保持での単純div要素置換処理', () => {
      container.innerHTML = '<div><p id="keep-me">Keep this</p><div>Replace me</div></div>';

      // Store reference to preserved element
      const preservedElement = container.querySelector('#keep-me');

      const rule = new RewriteRule(1, '<div>Replace me</div>', '<span>Replaced!</span>', '');
      const domDiffer = new DomDiffer(container, rule);
      domDiffer.applyRule(mockElementFactory);

      expect(container.innerHTML).toBe('<div><p id="keep-me">Keep this</p><span>Replaced!</span></div>');

      // Verify that preserved elements are still the same DOM nodes (not recreated)
      const currentPreservedElement = container.querySelector('#keep-me');
      expect(currentPreservedElement).toBe(preservedElement);
    });
  });
});