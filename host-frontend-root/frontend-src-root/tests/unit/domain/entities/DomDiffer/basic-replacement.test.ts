import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DomDiffer } from 'src/domain/entities/DomDiffer';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

/**
 * 1. 属性厳密マッチでの要素置換処理
 * 2. 複雑構造での複数マッチング要素処理
 * 3. 複雑テーブル構造でのテーブル行正常置換処理
 */
describe('DomDiffer - Basic Replacement', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  /**
   * 基本置換テストケース配列
   * 代表的な置換パターンのテストケース
   */
  const basicReplacementTestCases = [
    {
      description: '属性厳密マッチでの要素置換処理',
      input: {
        initialHtml: '<div><button class="btn">Old Button</button></div>',
        oldString: '<button class="btn">Old Button</button>',
        newString: '<button class="new-btn">New Button</button>',
      },
      expected: {
        html: '<div><button class="new-btn">New Button</button></div>',
      },
    },
    {
      description: '複雑構造での複数マッチング要素処理',
      input: {
        initialHtml: '<div><p>test</p><span>keep</span><p>test</p></div>',
        oldString: '<p>test</p>',
        newString: '<h1>replaced</h1>',
      },
      expected: {
        html: '<div><h1>replaced</h1><span>keep</span><h1>replaced</h1></div>',
      },
    },
    {
      description: '複雑テーブル構造でのテーブル行正常置換処理',
      input: {
        initialHtml: '<table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Old Row</td></tr><tr><td>Keep Row</td></tr></tbody></table>',
        oldString: '<tr><td>Old Row</td></tr>',
        newString: '<tr><td>New Row</td></tr>',
      },
      expected: {
        html: '<table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>New Row</td></tr><tr><td>Keep Row</td></tr></tbody></table>',
      },
    },
  ];

  basicReplacementTestCases.forEach(({ description, input, expected }) => {
    it(description, () => {
      container.innerHTML = input.initialHtml;
      
      const rule = new RewriteRule(1, input.oldString, input.newString, '');
      const domDiffer = new DomDiffer(container, rule);
      domDiffer.applyRule();
      
      expect(container.innerHTML).toBe(expected.html);
    });
  });
});