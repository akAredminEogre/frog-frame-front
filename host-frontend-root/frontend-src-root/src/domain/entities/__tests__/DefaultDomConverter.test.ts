import { DefaultDomConverter } from '../DefaultDomConverter';
import { HtmlString } from '../../value-objects/HtmlString';
import { describe, it, expect, beforeEach } from 'vitest';

describe('DefaultDomConverter', () => {
  let converter: DefaultDomConverter;

  beforeEach(() => {
    converter = new DefaultDomConverter();
  });

  const testCases = [
    {
      name: 'should convert a simple HTML string to a DOM node',
      html: '<div>test</div>',
      expectedNodeName: 'DIV',
      expectedTextContent: 'test',
      expectedNodeType: Node.ELEMENT_NODE,
    },
    {
      name: 'should convert an HTML string with multiple elements to the first child',
      html: '<span>first</span><p>second</p>',
      expectedNodeName: 'SPAN',
      expectedTextContent: 'first',
      expectedNodeType: Node.ELEMENT_NODE,
    },
    {
      name: 'should return an empty text node for an empty HTML string',
      html: '',
      expectedNodeName: '#text',
      expectedTextContent: '',
      expectedNodeType: Node.TEXT_NODE,
    },
    {
      name: 'should handle text nodes correctly',
      html: 'Just plain text',
      expectedNodeName: '#text',
      expectedTextContent: 'Just plain text',
      expectedNodeType: Node.TEXT_NODE,
    },
  ];

  testCases.forEach(({ name, html, expectedNodeName, expectedTextContent, expectedNodeType }) => {
    it(name, () => {
      const htmlString = new HtmlString(html);
      const node = converter.convert(htmlString);
      expect(node.nodeName).toBe(expectedNodeName);
      expect(node.textContent).toBe(expectedTextContent);
      expect(node.nodeType).toBe(expectedNodeType);
    });
  });
});
