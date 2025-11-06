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

  describe('with regex patterns', () => {
    const regexTestCases = [
      {
        description: 'should replace h1 tag with regex pattern',
        input: {
          initialHtml: '<h1>アジャイルソフトウェア開発宣言</h1>',
          oldString: '<h1>(.+?)</h1>',
          newString: '<h2>$1</h2>',
        },
        expected: {
          html: '<h2>アジャイルソフトウェア開発宣言</h2>',
        },
      },
      {
        description: 'should replace multiple h1 tags with regex pattern',
        input: {
          initialHtml: '<h1>Title 1</h1><h1>Title 2</h1>',
          oldString: '<h1>(.+?)</h1>',
          newString: '<h2>$1</h2>',
        },
        expected: {
          html: '<h2>Title 1</h2><h2>Title 2</h2>',
        },
      },
      {
        description: 'should not replace if regex pattern does not match',
        input: {
          initialHtml: '<div>No h1 tags here</div>',
          oldString: '<h1>(.+?)</h1>',
          newString: '<h2>$1</h2>',
        },
        expected: {
          html: '<div>No h1 tags here</div>',
        },
      },
    ];

    regexTestCases.forEach(({ description, input, expected }) => {
      it(description, () => {
        container.innerHTML = input.initialHtml;
        const rule = new RewriteRule(1, input.oldString, input.newString, "", true);
        replacer.replace(container, rule);
        expect(container.innerHTML).toBe(expected.html);
      });
    });
  });

});
