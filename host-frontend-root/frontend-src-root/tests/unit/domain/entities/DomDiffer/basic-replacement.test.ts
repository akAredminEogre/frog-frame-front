import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DomDiffer } from 'src/domain/entities/DomDiffer';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

describe('DomDiffer - Basic Replacement', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });


  describe('Standard Replacement Cases', () => {
    const testCases = [
      {
        name: 'should replace elements with exact attribute matching',
        initialHtml: '<div><button class="btn">Old Button</button></div>',
        oldString: '<button class="btn">Old Button</button>',
        newString: '<button class="new-btn">New Button</button>',
        expectedHtml: '<div><button class="new-btn">New Button</button></div>',
      },
      {
        name: 'should handle multiple matching elements',
        initialHtml: '<div><p>test</p><span>keep</span><p>test</p></div>',
        oldString: '<p>test</p>',
        newString: '<h1>replaced</h1>',
        expectedHtml: '<div><h1>replaced</h1><span>keep</span><h1>replaced</h1></div>',
      },
      {
        name: 'should replace table rows correctly',
        initialHtml: '<table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Old Row</td></tr><tr><td>Keep Row</td></tr></tbody></table>',
        oldString: '<tr><td>Old Row</td></tr>',
        newString: '<tr><td>New Row</td></tr>',
        expectedHtml: '<table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>New Row</td></tr><tr><td>Keep Row</td></tr></tbody></table>',
      },
    ];

    testCases.forEach(({ name, initialHtml, oldString, newString, expectedHtml }) => {
      it(name, () => {
        container.innerHTML = initialHtml;
        
        const rule = new RewriteRule(1, oldString, newString, '');
        const domDiffer = new DomDiffer(container, rule);
        domDiffer.applyRule();
        
        expect(container.innerHTML).toBe(expectedHtml);
      });
    });
  });
});