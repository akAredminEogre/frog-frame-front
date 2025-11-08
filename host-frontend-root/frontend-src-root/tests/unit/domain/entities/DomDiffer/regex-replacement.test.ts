import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DomDiffer } from 'src/domain/entities/DomDiffer';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

/**
 * 1. h1タグの正規表現パターン置換処理
 * 2. 複数h1タグの正規表現パターン置換処理
 * 3. パターン不一致での未変更確認
 * 4. 正規表現ベースでの置換処理
 */
describe('DomDiffer - Regex Replacement Cases', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  /**
   * 正規表現置換テストケース配列
   * 様々な正規表現パターンを使用した置換をテストする
   */
  const regexReplacementTestCases = [
    {
      description: 'h1タグの正規表現パターン置換処理',
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
      description: '複数h1タグの正規表現パターン置換処理',
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
      description: 'パターン不一致での未変更確認',
      input: {
        initialHtml: '<div>No h1 tags here</div>',
        oldString: '<h1>(.+?)</h1>',
        newString: '<h2>$1</h2>',
      },
      expected: {
        html: '<div>No h1 tags here</div>',
      },
    },
    {
      description: '正規表現ベースでの置換処理',
      input: {
        initialHtml: '<h1>hello</h1><h2>world</h2>',
        oldString: '<h1>(.*?)</h1>',
        newString: '<h3>$1</h3>',
      },
      expected: {
        html: '<h3>hello</h3><h2>world</h2>',
      },
    },
  ];

  regexReplacementTestCases.forEach(({ description, input, expected }) => {
    it(description, () => {
      container.innerHTML = input.initialHtml;
      const rule = new RewriteRule(1, input.oldString, input.newString, '', true); // isRegex = true
      const domDiffer = new DomDiffer(container, rule);
      domDiffer.applyRule();
      expect(container.innerHTML).toBe(expected.html);
    });
  });
});