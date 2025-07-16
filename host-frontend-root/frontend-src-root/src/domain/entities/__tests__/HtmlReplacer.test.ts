import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HtmlReplacer } from '../HtmlReplacer';
import type { RewriteRule } from '../RewriteRule';

describe('HtmlReplacer', () => {
  let replacer: HtmlReplacer;
  let container: HTMLElement;

  beforeEach(() => {
    replacer = new HtmlReplacer();
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  const testCases = [
    {
      name: 'should replace a simple div element',
      initialHtml: '<div>Hello World</div>',
      rule: { id: '1', oldString: '<div>Hello World</div>', newString: '<span>Hello Test</span>' },
      expectedCount: 1,
      expectedHtml: '<span>Hello Test</span>',
    },
    {
      name: 'should replace multiple matching elements',
      initialHtml: '<div><p>test</p><p>test</p></div>',
      rule: { id: '1', oldString: '<p>test</p>', newString: '<span>replaced</span>' },
      expectedCount: 2,
      expectedHtml: '<div><span>replaced</span><span>replaced</span></div>',
    },
    {
      name: 'should not replace if no matching elements found',
      initialHtml: '<div>Hello World</div>',
      rule: { id: '1', oldString: '<span>Hello World</span>', newString: '<p>Hello Test</p>' },
      expectedCount: 0,
      expectedHtml: '<div>Hello World</div>',
    },
    {
      name: 'should replace table row elements',
      initialHtml: '<table><tr><td>data</td></tr></table>',
      rule: { id: '1', oldString: '<tr><td>data</td></tr>', newString: '<tr><td>replaced</td></tr>' },
      expectedCount: 1,
      expectedHtml: '<table><tbody><tr><td>replaced</td></tr></tbody></table>',
    },
    {
      name: 'should replace table cell elements',
      initialHtml: '<table><tr><td>cell1</td><td>cell2</td></tr></table>',
      rule: { id: '1', oldString: '<td>cell1</td>', newString: '<td>new cell</td>' },
      expectedCount: 1,
      expectedHtml: '<table><tbody><tr><td>new cell</td><td>cell2</td></tr></tbody></table>',
    },
    {
      name: 'should handle nested elements correctly',
      initialHtml: '<div><span><strong>Bold Text</strong></span></div>',
      rule: { id: '1', oldString: '<span><strong>Bold Text</strong></span>', newString: '<em>Italic Text</em>' },
      expectedCount: 1,
      expectedHtml: '<div><em>Italic Text</em></div>',
    },
    {
      name: 'should return 0 if oldString has invalid HTML format',
      initialHtml: '<div>Hello World</div>',
      rule: { id: '1', oldString: 'invalid html', newString: '<span>test</span>' },
      expectedCount: 0,
      expectedHtml: '<div>Hello World</div>',
    },
    {
      name: 'should handle elements with attributes',
      initialHtml: '<div class="test" id="example">Content</div>',
      rule: { id: '1', oldString: '<div class="test" id="example">Content</div>', newString: '<section class="new">New Content</section>' },
      expectedCount: 1,
      expectedHtml: '<section class="new">New Content</section>',
    },
    {
      name: 'should handle case where newString creates multiple elements',
      initialHtml: '<div><p>replace me</p></div>',
      rule: { id: '1', oldString: '<p>replace me</p>', newString: '<span>first</span><span>second</span>' },
      expectedCount: 1,
      expectedHtml: '<div><span>first</span><span>second</span></div>',
    },
    {
      name: 'should replace a p element with class attribute',
      initialHtml: '<p class="foo">old</p>',
      rule: { id: '1', oldString: '<p class="foo">old</p>', newString: '<h1>new</h1>' },
      expectedCount: 1,
      expectedHtml: '<h1>new</h1>',
    },
    {
      name: 'should handle nested div and p elements',
      initialHtml: '<div><p>old</p></div>',
      rule: { id: '1', oldString: '<div><p>old</p></div>', newString: '<span>new</span>' },
      expectedCount: 1,
      expectedHtml: '<span>new</span>',
    },
    {
      name: 'should replace table data cell',
      initialHtml: '<table><tbody><tr><td>old</td></tr></tbody></table>',
      rule: { id: '1', oldString: '<td>old</td>', newString: '<th>new</th>' },
      expectedCount: 1,
      expectedHtml: '<table><tbody><tr><th>new</th></tr></tbody></table>',
    },
  ];

  testCases.forEach(({ name, initialHtml, rule, expectedCount, expectedHtml }) => {
    it(name, () => {
      container.innerHTML = initialHtml;
      
      const replaceCount = replacer.replace(container, rule as RewriteRule);
      
      expect(replaceCount).toBe(expectedCount);
      expect(container.innerHTML).toBe(expectedHtml);
    });
  });

});
