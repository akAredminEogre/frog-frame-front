import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { EnhancedHtmlReplacer } from 'src/domain/entities/EnhancedHtmlReplacer';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

describe('EnhancedHtmlReplacer - State Preservation', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.clearAllMocks();
  });

  describe('Event Listener Preservation', () => {
    it('should preserve event listeners on unmodified elements', () => {
      container.innerHTML = '<div><button id="keep">Keep</button><p>Replace me</p></div>';
      
      // Add event listener to button
      const button = container.querySelector('#keep') as HTMLButtonElement;
      let clickCount = 0;
      const clickHandler = () => { clickCount++; };
      button.addEventListener('click', clickHandler);
      
      // Apply replacement rule
      const rule = new RewriteRule(1, '<p>Replace me</p>', '<span>Replaced</span>', '');
      const enhancedReplacer = new EnhancedHtmlReplacer(container, rule);
      enhancedReplacer.replace();
      
      // Verify the button still has the event listener
      const updatedButton = container.querySelector('#keep') as HTMLButtonElement;
      expect(updatedButton).toBe(button); // Same DOM node
      
      // Trigger click and verify event listener works
      updatedButton.click();
      expect(clickCount).toBe(1);
      
      // Verify replacement occurred
      expect(container.innerHTML).toBe('<div><button id="keep">Keep</button><span>Replaced</span></div>');
    });
  });

  describe('Form State Preservation', () => {
    it('should preserve form input values on unmodified elements', () => {
      container.innerHTML = '<div><input id="keep" type="text"><p>Replace me</p></div>';
      
      // Set input value
      const input = container.querySelector('#keep') as HTMLInputElement;
      input.value = 'preserved value';
      
      // Apply replacement rule
      const rule = new RewriteRule(1, '<p>Replace me</p>', '<span>Replaced</span>', '');
      const enhancedReplacer = new EnhancedHtmlReplacer(container, rule);
      enhancedReplacer.replace();
      
      // Verify input value is preserved
      const inputUntouched = container.querySelector('#keep') as HTMLInputElement;
      expect(inputUntouched).toBe(input); // Same DOM node
      expect(inputUntouched.value).toBe('preserved value');
      
      // Verify replacement occurred
      expect(container.innerHTML).toBe('<div><input id="keep" type="text"><span>Replaced</span></div>');
    });
  });

});