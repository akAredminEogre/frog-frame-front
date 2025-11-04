import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ElementMatchesFlexiblePattern } from 'src/domain/entities/ElementMatchesFlexiblePattern';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

describe('ElementMatchesFlexiblePattern.exec() - Error Handling', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('Invalid Rule Patterns', () => {
    it('should handle empty rule pattern gracefully', () => {
      container.innerHTML = '<div>Test</div>';
      const element = container.firstElementChild!;
      
      const rule = new RewriteRule(1, '', '<span>Replaced!</span>', '');
      const matcher = new ElementMatchesFlexiblePattern(element, rule);
      
      expect(matcher.exec()).toBe(false);
    });

    it('should handle malformed HTML in rule pattern', () => {
      container.innerHTML = '<div>Test</div>';
      const element = container.firstElementChild!;
      
      const rule = new RewriteRule(1, '<div>Unclosed tag', '<span>Replaced!</span>', '');
      const matcher = new ElementMatchesFlexiblePattern(element, rule);
      
      expect(matcher.exec()).toBe(false);
    });

    it('should handle rule pattern with no elements', () => {
      container.innerHTML = '<div>Test</div>';
      const element = container.firstElementChild!;
      
      const rule = new RewriteRule(1, 'Just text with no elements', '<span>Replaced!</span>', '');
      const matcher = new ElementMatchesFlexiblePattern(element, rule);
      
      expect(matcher.exec()).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty element content', () => {
      container.innerHTML = '<div></div>';
      const element = container.firstElementChild!;
      
      const rule = new RewriteRule(1, '<div></div>', '<span>Replaced!</span>', '');
      const matcher = new ElementMatchesFlexiblePattern(element, rule);
      
      expect(matcher.exec()).toBe(true);
    });

    it('should handle element with only whitespace', () => {
      container.innerHTML = '<div>   </div>';
      const element = container.firstElementChild!;
      
      const rule = new RewriteRule(1, '<div></div>', '<span>Replaced!</span>', '');
      const matcher = new ElementMatchesFlexiblePattern(element, rule);
      
      expect(matcher.exec()).toBe(true);
    });

    it('should handle self-closing elements', () => {
      container.innerHTML = '<img src="test.jpg" alt="test">';
      const element = container.firstElementChild!;
      
      const rule = new RewriteRule(1, '<img src="test.jpg" alt="test">', '<img src="new.jpg" alt="new">', '');
      const matcher = new ElementMatchesFlexiblePattern(element, rule);
      
      expect(matcher.exec()).toBe(true);
    });
  });
});