import { TableDomConverter } from '../TableDomConverter';
import { HtmlString } from '../../value-objects/HtmlString';
import { TagName } from '../../value-objects/TagName';
import { describe, it, expect } from 'vitest';

describe('TableDomConverter', () => {
  const testCases = [
    {
      name: 'should convert a td tag correctly',
      tagName: 'td',
      html: '<td>Cell Content</td>',
      expectedNodeName: 'TD',
      expectedTextContent: 'Cell Content',
      expectedParentNodeNames: ['TR', 'TBODY', 'TABLE'],
    },
    {
      name: 'should convert a th tag correctly',
      tagName: 'th',
      html: '<th>Header Content</th>',
      expectedNodeName: 'TH',
      expectedTextContent: 'Header Content',
      expectedParentNodeNames: ['TR', 'TBODY', 'TABLE'],
    },
    {
      name: 'should convert a tr tag correctly',
      tagName: 'tr',
      html: '<tr><td>Cell</td></tr>',
      expectedNodeName: 'TR',
      expectedTextContent: 'Cell',
      expectedParentNodeNames: ['TBODY', 'TABLE'],
    },
    {
      name: 'should convert a tbody tag correctly',
      tagName: 'tbody',
      html: '<tbody><tr><td>Cell</td></tr></tbody>',
      expectedNodeName: 'TBODY',
      expectedTextContent: 'Cell',
      expectedParentNodeNames: ['TABLE'],
    },
    {
      name: 'should convert a thead tag correctly',
      tagName: 'thead',
      html: '<thead><tr><th>Header</th></tr></thead>',
      expectedNodeName: 'THEAD',
      expectedTextContent: 'Header',
      expectedParentNodeNames: ['TABLE'],
    },
    {
      name: 'should convert a tfoot tag correctly',
      tagName: 'tfoot',
      html: '<tfoot><tr><td>Footer</td></tr></tfoot>',
      expectedNodeName: 'TFOOT',
      expectedTextContent: 'Footer',
      expectedParentNodeNames: ['TABLE'],
    },
    {
      name: 'should convert a table tag correctly',
      tagName: 'table',
      html: '<table><tr><td>Content</td></tr></table>',
      expectedNodeName: 'TABLE',
      expectedTextContent: 'Content',
      expectedParentNodeNames: [], // tableタグ自体がルートなので親はなし
    },
  ];

  testCases.forEach(({ name, tagName, html, expectedNodeName, expectedTextContent, expectedParentNodeNames }) => {
    it(name, () => {
      const tag = new TagName(tagName);
      const converter = new TableDomConverter(tag);
      const htmlString = new HtmlString(html);
      const node = converter.convert(htmlString);

      expect(node.nodeName).toBe(expectedNodeName);
      expect(node.textContent).toBe(expectedTextContent);

      let currentNode: Node | null = node;
      expectedParentNodeNames?.forEach(parentNodeName => {
        currentNode = currentNode?.parentNode || null;
        expect(currentNode?.nodeName).toBe(parentNodeName);
      });
    });
  });
});
