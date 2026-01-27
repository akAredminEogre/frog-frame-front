import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ElementMatchesFlexiblePattern } from 'src/domain/entities/ElementMatchesFlexiblePattern';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

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
      
      const rule = RewriteRule.fromParams(1, { oldString: '', newString: '<span>Replaced!</span>', urlPattern: '', isRegex: false });
      const matcher = new ElementMatchesFlexiblePattern(element, rule);
      
      expect(matcher.exec()).toBe(false);
    });

    it('should handle malformed HTML in rule pattern', () => {
      container.innerHTML = '<div>Test</div>';
      const element = container.firstElementChild!;
      
      const rule = RewriteRule.fromParams(1, { oldString: '<div>Unclosed tag', newString: '<span>Replaced!</span>', urlPattern: '', isRegex: false });
      const matcher = new ElementMatchesFlexiblePattern(element, rule);
      
      expect(matcher.exec()).toBe(false);
    });

    it('should handle rule pattern with no elements', () => {
      container.innerHTML = '<div>Test</div>';
      const element = container.firstElementChild!;
      
      const rule = RewriteRule.fromParams(1, { oldString: 'Just text with no elements', newString: '<span>Replaced!</span>', urlPattern: '', isRegex: false });
      const matcher = new ElementMatchesFlexiblePattern(element, rule);
      
      expect(matcher.exec()).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty element content', () => {
      container.innerHTML = '<div></div>';
      const element = container.firstElementChild!;
      
      const rule = RewriteRule.fromParams(1, { oldString: '<div></div>', newString: '<span>Replaced!</span>', urlPattern: '', isRegex: false });
      const matcher = new ElementMatchesFlexiblePattern(element, rule);
      
      expect(matcher.exec()).toBe(true);
    });

    it('should handle element with only whitespace', () => {
      container.innerHTML = '<div>   </div>';
      const element = container.firstElementChild!;
      
      const rule = RewriteRule.fromParams(1, { oldString: '<div></div>', newString: '<span>Replaced!</span>', urlPattern: '', isRegex: false });
      const matcher = new ElementMatchesFlexiblePattern(element, rule);
      
      expect(matcher.exec()).toBe(true);
    });

    it('should handle self-closing elements', () => {
      container.innerHTML = '<img src="test.jpg" alt="test">';
      const element = container.firstElementChild!;
      
      const rule = RewriteRule.fromParams(1, { oldString: '<img src="test.jpg" alt="test">', newString: '<img src="new.jpg" alt="new">', urlPattern: '', isRegex: false });
      const matcher = new ElementMatchesFlexiblePattern(element, rule);
      
      expect(matcher.exec()).toBe(true);
    });
  });
});