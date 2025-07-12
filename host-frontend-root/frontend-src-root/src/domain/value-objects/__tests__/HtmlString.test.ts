import { HtmlString } from '../HtmlString';
import { describe, it, expect } from 'vitest';

describe('HtmlString', () => {
  describe('constructor', () => {
    it('should create an instance for a valid HTML string', () => {
      expect(() => new HtmlString('<div>hello</div>')).not.toThrow();
    });

    it('should throw an error for an invalid HTML string', () => {
      expect(() => new HtmlString('just text')).toThrow('Invalid HTML string');
    });

    it('should throw an error for an empty string', () => {
      expect(() => new HtmlString('')).toThrow('Invalid HTML string');
    });
  });

  describe('toString', () => {
    it('should return the original string value', () => {
      const html = '<div><p>test</p></div>';
      const htmlString = new HtmlString(html);
      expect(htmlString.toString()).toBe(html);
    });
  });

  describe('equals', () => {
    it('should return true for equal HtmlString objects', () => {
      const html1 = new HtmlString('<span>test</span>');
      const html2 = new HtmlString('<span>test</span>');
      expect(html1.equals(html2)).toBe(true);
    });

    it('should return false for different HtmlString objects', () => {
      const html1 = new HtmlString('<a>test</a>');
      const html2 = new HtmlString('<b>test</b>');
      expect(html1.equals(html2)).toBe(false);
    });
  });

  describe('toDomNode', () => {
    it('should convert a simple div string to a div node', () => {
      const html = '<div>content</div>';
      const htmlString = new HtmlString(html);
      const node = htmlString.toDomNode('div');
      expect(node.nodeName).toBe('DIV');
      expect(node.textContent).toBe('content');
    });

    it('should convert a tr string to a tr node', () => {
      const html = '<tr><td>cell</td></tr>';
      const htmlString = new HtmlString(html);
      const node = htmlString.toDomNode('tr');
      expect(node.nodeName).toBe('TR');
      expect((node as HTMLElement).outerHTML).toBe('<tr><td>cell</td></tr>');
    });

    it('should convert a td string to a td node', () => {
        const html = '<td>cell</td>';
        const htmlString = new HtmlString(html);
        const node = htmlString.toDomNode('td');
        expect(node.nodeName).toBe('TD');
        expect(node.textContent).toBe('cell');
    });
  });
});
