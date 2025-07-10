import { describe, it, expect } from 'vitest';
import { Window } from 'happy-dom';
import { NodeTextReplacer } from '../NodeTextReplacer';

// ヘルパー関数
const createNodeTextReplacer = () => {
  const window = new Window();
  const document = window.document as any;
  const replacer = new NodeTextReplacer();
  (global as any).NodeFilter = { SHOW_TEXT: 4 };
  (global as any).DOMParser = window.DOMParser;
  return { document, replacer };
};

describe('NodeTextReplacer', () => {
  const testCases = [
    {
      name: 'should replace simple text',
      initialHtml: '<div>hello world</div>',
      rule: { id: '1', oldString: 'world', newString: 'test' },
      expectedCount: 1,
      expectedHtml: '<div>hello test</div>',
    },
    {
      name: 'should replace multiple occurrences of text',
      initialHtml: '<div>hello world, good world</div>',
      rule: { id: '1', oldString: 'world', newString: 'test' },
      expectedCount: 1,
      expectedHtml: '<div>hello test, good test</div>',
    },
    {
      name: 'should not replace anything if text is not found',
      initialHtml: '<div>hello world</div>',
      rule: { id: '1', oldString: 'foo', newString: 'bar' },
      expectedCount: 0,
      expectedHtml: '<div>hello world</div>',
    },
    {
      name: 'should replace an HTML element',
      initialHtml: '<p>hello</p><span>world</span>',
      rule: { id: '1', oldString: '<p>hello</p>', newString: '<b>replaced</b>' },
      expectedCount: 1,
      expectedHtml: '<b>replaced</b><span>world</span>',
    },
    {
      name: 'should replace a table row (tr)',
      initialHtml: '<table><tbody><tr><td>cell 1</td></tr><tr><td>cell 2</td></tr></tbody></table>',
      rule: { id: '1', oldString: '<tr><td>cell 1</td></tr>', newString: '<tr><td>replaced</td></tr>' },
      expectedCount: 1,
      expectedHtml: '<table><tbody><tr><td>replaced</td></tr><tr><td>cell 2</td></tr></tbody></table>',
    },
    {
      name: 'should replace a table cell (td)',
      initialHtml: '<table><tbody><tr><td>cell 1</td><td>cell 2</td></tr></tbody></table>',
      rule: { id: '1', oldString: '<td>cell 2</td>', newString: '<td>replaced</td>' },
      expectedCount: 1,
      expectedHtml: '<table><tbody><tr><td>cell 1</td><td>replaced</td></tr></tbody></table>',
    },
    {
      name: 'should handle complex HTML replacement with nested elements',
      initialHtml: '<div><p><span>nested</span></p></div>',
      rule: { id: '1', oldString: '<p><span>nested</span></p>', newString: '<b>simple</b>' },
      expectedCount: 1,
      expectedHtml: '<div><b>simple</b></div>',
    },
    {
      name: 'should not replace element if content does not match exactly',
      initialHtml: '<div><p> hello </p></div>',
      rule: { id: '1', oldString: '<p>hello</p>', newString: '<b>replaced</b>' },
      expectedCount: 0,
      expectedHtml: '<div><p> hello </p></div>',
    },
  ];

  testCases.forEach(({ name, initialHtml, rule, expectedCount, expectedHtml }) => {
    it(name, () => {
      const { document, replacer } = createNodeTextReplacer();
      document.body.innerHTML = initialHtml;
      const count = replacer.replace(document.body, rule);
      expect(count).toBe(expectedCount);
      expect(document.body.innerHTML).toBe(expectedHtml);
    });
  });
});
