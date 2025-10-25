import { afterEach,beforeEach, describe, expect, it } from 'vitest';

import { HtmlReplacer } from 'src/domain/entities/HtmlReplacer';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

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
      description: 'should replace a simple div element',
      input: {
        initialHtml: '<div>Hello World</div>',
        oldString: '<div>Hello World</div>',
        newString: '<span>Hello Test</span>',
      },
      expected: {
        html: '<span>Hello Test</span>',
      },
    },
    {
      description: 'should replace multiple matching elements',
      input: {
        initialHtml: '<div><p>test</p><p>test</p></div>',
        oldString: '<p>test</p>',
        newString: '<span>replaced</span>',
      },
      expected: {
        html: '<div><span>replaced</span><span>replaced</span></div>',
      },
    },
    {
      description: 'should not replace if no matching elements found',
      input: {
        initialHtml: '<div>Hello World</div>',
        oldString: '<span>Hello World</span>',
        newString: '<p>Hello Test</p>',
      },
      expected: {
        html: '<div>Hello World</div>',
      },
    },
    {
      description: 'should replace table row elements',
      input: {
        initialHtml: '<table><tr><td>data</td></tr></table>',
        oldString: '<tr><td>data</td></tr>',
        newString: '<tr><td>replaced</td></tr>',
      },
      expected: {
        html: '<table><tbody><tr><td>replaced</td></tr></tbody></table>',
      },
    },
    {
      description: 'should replace table cell elements',
      input: {
        initialHtml: '<table><tr><td>cell1</td><td>cell2</td></tr></table>',
        oldString: '<td>cell1</td>',
        newString: '<td>new cell</td>',
      },
      expected: {
        html: '<table><tbody><tr><td>new cell</td><td>cell2</td></tr></tbody></table>',
      },
    },
    {
      description: 'should handle nested elements correctly',
      input: {
        initialHtml: '<div><span><strong>Bold Text</strong></span></div>',
        oldString: '<span><strong>Bold Text</strong></span>',
        newString: '<em>Italic Text</em>',
      },
      expected: {
        html: '<div><em>Italic Text</em></div>',
      },
    },
    {
      description: 'should return 0 if oldString has invalid HTML format',
      input: {
        initialHtml: '<div>Hello World</div>',
        oldString: 'invalid html',
        newString: '<span>test</span>',
      },
      expected: {
        html: '<div>Hello World</div>',
      },
    },
    {
      description: 'should handle elements with attributes',
      input: {
        initialHtml: '<div class="test" id="example">Content</div>',
        oldString: '<div class="test" id="example">Content</div>',
        newString: '<section class="new">New Content</section>',
      },
      expected: {
        html: '<section class="new">New Content</section>',
      },
    },
    {
      description: 'should handle case where newString creates multiple elements',
      input: {
        initialHtml: '<div><p>replace me</p></div>',
        oldString: '<p>replace me</p>',
        newString: '<span>first</span><span>second</span>',
      },
      expected: {
        html: '<div><span>first</span><span>second</span></div>',
      },
    },
    {
      description: 'should replace a p element with class attribute',
      input: {
        initialHtml: '<p class="foo">old</p>',
        oldString: '<p class="foo">old</p>',
        newString: '<h1>new</h1>',
      },
      expected: {
        html: '<h1>new</h1>',
      },
    },
    {
      description: 'should handle nested div and p elements',
      input: {
        initialHtml: '<div><p>old</p></div>',
        oldString: '<div><p>old</p></div>',
        newString: '<span>new</span>',
      },
      expected: {
        html: '<span>new</span>',
      },
    },
    {
      description: 'should replace table data cell',
      input: {
        initialHtml: '<table><tbody><tr><td>old</td></tr></tbody></table>',
        oldString: '<td>old</td>',
        newString: '<th>new</th>',
      },
      expected: {
        html: '<table><tbody><tr><th>new</th></tr></tbody></table>',
      },
    },
  ];

  testCases.forEach(({ description, input, expected }) => {
    it(description, () => {
      container.innerHTML = input.initialHtml;
      const rule = new RewriteRule(1, input.oldString, input.newString, '');
      replacer.replace(container, rule);
      expect(container.innerHTML).toBe(expected.html);
    });
  });

});
