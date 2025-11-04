import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DomDiffer } from 'src/domain/entities/DomDiffer';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

describe('DomDiffer - Basic Replacement', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('Simple Element Replacement', () => {
    it('should replace a simple div element while preserving DOM structure', () => {
      container.innerHTML = '<div><p id="keep-me">Keep this</p><div>Replace me</div></div>';
      
      // Store reference to preserved element
      const preservedElement = container.querySelector('#keep-me');
      
      const rule = new RewriteRule(1, '<div>Replace me</div>', '<span>Replaced!</span>', '');
      const domDiffer = new DomDiffer(container, rule);
      domDiffer.applyRule();
      
      expect(container.innerHTML).toBe('<div><p id="keep-me">Keep this</p><span>Replaced!</span></div>');
      
      // Verify that preserved elements are still the same DOM nodes (not recreated)
      const currentPreservedElement = container.querySelector('#keep-me');
      expect(currentPreservedElement).toBe(preservedElement);
    });
  });

  describe('Attribute Handling', () => {
    it('should replace elements with attributes', () => {
      container.innerHTML = '<div><button class="btn" onclick="alert()">Old Button</button></div>';
      
      const rule = new RewriteRule(1, '<button class="btn">Old Button</button>', '<button class="new-btn">New Button</button>', '');
      const domDiffer = new DomDiffer(container, rule);
      domDiffer.applyRule();
      
      expect(container.innerHTML).toBe('<div><button class="new-btn">New Button</button></div>');
    });
  });

  describe('Multiple Elements', () => {
    it('should handle multiple matching elements', () => {
      container.innerHTML = '<div><p>test</p><span>keep</span><p>test</p></div>';
      
      const rule = new RewriteRule(1, '<p>test</p>', '<h1>replaced</h1>', '');
      const domDiffer = new DomDiffer(container, rule);
      domDiffer.applyRule();
      
      expect(container.innerHTML).toBe('<div><h1>replaced</h1><span>keep</span><h1>replaced</h1></div>');
    });
  });
});