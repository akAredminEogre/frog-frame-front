import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HtmlReplacer } from 'src/domain/entities/HtmlReplacer';
import { RewriteRule } from 'src/domain/entities/RewriteRule';

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
      rule: new RewriteRule('1', '<div>Hello World</div>', '<span>Hello Test</span>'),
      expectedHtml: '<span>Hello Test</span>',
    },
    {
      name: 'should replace multiple matching elements',
      initialHtml: '<div><p>test</p><p>test</p></div>',
      rule: new RewriteRule('1', '<p>test</p>', '<span>replaced</span>'),
      expectedHtml: '<div><span>replaced</span><span>replaced</span></div>',
    },
    {
      name: 'should not replace if no matching elements found',
      initialHtml: '<div>Hello World</div>',
      rule: new RewriteRule('1', '<span>Hello World</span>', '<p>Hello Test</p>'),
      expectedHtml: '<div>Hello World</div>',
    },
    {
      name: 'should replace table row elements',
      initialHtml: '<table><tr><td>data</td></tr></table>',
      rule: new RewriteRule('1', '<tr><td>data</td></tr>', '<tr><td>replaced</td></tr>'),
      expectedHtml: '<table><tbody><tr><td>replaced</td></tr></tbody></table>',
    },
    {
      name: 'should replace table cell elements',
      initialHtml: '<table><tr><td>cell1</td><td>cell2</td></tr></table>',
      rule: new RewriteRule('1', '<td>cell1</td>', '<td>new cell</td>'),
      expectedHtml: '<table><tbody><tr><td>new cell</td><td>cell2</td></tr></tbody></table>',
    },
    {
      name: 'should handle nested elements correctly',
      initialHtml: '<div><span><strong>Bold Text</strong></span></div>',
      rule: new RewriteRule('1', '<span><strong>Bold Text</strong></span>', '<em>Italic Text</em>'),
      expectedHtml: '<div><em>Italic Text</em></div>',
    },
    {
      name: 'should return 0 if oldString has invalid HTML format',
      initialHtml: '<div>Hello World</div>',
      rule: new RewriteRule('1', 'invalid html', '<span>test</span>'),
      expectedHtml: '<div>Hello World</div>',
    },
    {
      name: 'should handle elements with attributes',
      initialHtml: '<div class="test" id="example">Content</div>',
      rule: new RewriteRule('1', '<div class="test" id="example">Content</div>', '<section class="new">New Content</section>'),
      expectedHtml: '<section class="new">New Content</section>',
    },
    {
      name: 'should handle case where newString creates multiple elements',
      initialHtml: '<div><p>replace me</p></div>',
      rule: new RewriteRule('1', '<p>replace me</p>', '<span>first</span><span>second</span>'),
      expectedHtml: '<div><span>first</span><span>second</span></div>',
    },
    {
      name: 'should replace a p element with class attribute',
      initialHtml: '<p class="foo">old</p>',
      rule: new RewriteRule('1', '<p class="foo">old</p>', '<h1>new</h1>'),
      expectedHtml: '<h1>new</h1>',
    },
    {
      name: 'should handle nested div and p elements',
      initialHtml: '<div><p>old</p></div>',
      rule: new RewriteRule('1', '<div><p>old</p></div>', '<span>new</span>'),
      expectedHtml: '<span>new</span>',
    },
    {
      name: 'should replace table data cell',
      initialHtml: '<table><tbody><tr><td>old</td></tr></tbody></table>',
      rule: new RewriteRule('1', '<td>old</td>', '<th>new</th>'),
      expectedHtml: '<table><tbody><tr><th>new</th></tr></tbody></table>',
    },
  ];

  testCases.forEach(({ name, initialHtml, rule, expectedHtml }) => {
    it(name, () => {
      container.innerHTML = initialHtml;
      
      replacer.replace(container, rule);
      
      expect(container.innerHTML).toBe(expectedHtml);
    });
  });

  describe('with regex patterns', () => {
    it('should replace h1 tag with regex pattern', () => {
      container.innerHTML = '<h1>アジャイルソフトウェア開発宣言</h1>';
      
      const rule = new RewriteRule('1', '<h1>(.+?)</h1>', '<h2>$1</h2>', undefined, true);
      
      replacer.replace(container, rule);
      
      expect(container.innerHTML).toBe('<h2>アジャイルソフトウェア開発宣言</h2>');
    });

    it('should replace multiple h1 tags with regex pattern', () => {
      container.innerHTML = '<h1>Title 1</h1><h1>Title 2</h1>';
      
      const rule = new RewriteRule('1', '<h1>(.+?)</h1>', '<h2>$1</h2>', undefined, true);
      
      replacer.replace(container, rule);
      
      expect(container.innerHTML).toBe('<h2>Title 1</h2><h2>Title 2</h2>');
    });

    it('should not replace if regex pattern does not match', () => {
      container.innerHTML = '<div>No h1 tags here</div>';
      
      const rule = new RewriteRule('1', '<h1>(.+?)</h1>', '<h2>$1</h2>', undefined, true);
      
      replacer.replace(container, rule);
      
      expect(container.innerHTML).toBe('<div>No h1 tags here</div>');
    });
  });

});
