import { describe, it, expect } from 'vitest';
import { Window } from 'happy-dom';
import { TextReplacer } from 'src/domain/entities/TextReplacer';
import { RewriteRule } from 'src/domain/entities/RewriteRule';

// ヘルパー関数
const createTextReplacer = () => {
  const window = new Window();
  const document = window.document as any;
  const replacer = new TextReplacer();
  (global as any).NodeFilter = { SHOW_TEXT: 4 };
  return { document, replacer };
};

describe('TextReplacer', () => {
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
      expectedCount: 2,
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
      name: 'should replace text in multiple elements',
      initialHtml: '<div>hello world</div><p>world</p><span>good world</span>',
      rule: { id: '1', oldString: 'world', newString: 'test' },
      expectedCount: 3,
      expectedHtml: '<div>hello test</div><p>test</p><span>good test</span>',
    },
  ];

  testCases.forEach(({ name, initialHtml, rule, expectedCount, expectedHtml }) => {
    it(name, () => {
      const { document, replacer } = createTextReplacer();
      document.body.innerHTML = initialHtml;
      const rewriteRule = new RewriteRule(
        rule.id,
        rule.oldString,
        rule.newString
      );
      const count = replacer.replace(document.body, rewriteRule);
      expect(count).toBe(expectedCount);
      expect(document.body.innerHTML).toBe(expectedHtml);
    });
  });
});
