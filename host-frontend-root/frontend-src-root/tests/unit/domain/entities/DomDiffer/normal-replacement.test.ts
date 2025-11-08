import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DomDiffer } from 'src/domain/entities/DomDiffer';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

/**
 * 1. 単純要素の置換処理（div/p要素）
 * 2. 複数マッチング要素の置換処理
 * 3. マッチング要素なしでの未変更確認
 * 4. ネストした要素の正常処理
 * 5. 無効HTML形式での元HTML返却処理
 * 6. 属性付き要素の処理
 * 7. 複数要素生成での新文字列処理
 * 8. テーブル要素の置換処理（行・セル）
 * 9. 旧文字列内特殊文字の処理
 */
describe('DomDiffer - Normal Replacement Cases', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  /**
   * 標準的な要素置換テストケース配列
   * 様々なHTML要素の置換パターンを網羅的にテストする
   */
  const normalReplacementTestCases = [
    {
      description: '単純要素の置換処理（div/p要素）',
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
      description: '複数マッチング要素の置換処理',
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
      description: 'マッチング要素なしでの未変更確認',
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
      description: 'ネストした要素の正常処理',
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
      description: '無効HTML形式での元HTML返却処理',
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
      description: '属性付き要素の処理',
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
      description: '複数要素生成での新文字列処理',
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
      description: 'テーブル要素の置換処理（行・セル）',
      input: {
        initialHtml: '<table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Old Row</td></tr><tr><td>Keep Row</td></tr></tbody></table>',
        oldString: '<tr><td>Old Row</td></tr>',
        newString: '<tr><td>New Row</td></tr>',
      },
      expected: {
        html: '<table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>New Row</td></tr><tr><td>Keep Row</td></tr></tbody></table>',
      },
    },
    {
      description: '旧文字列内特殊文字の処理',
      input: {
        initialHtml: '<div>a.b*c+d</div>',
        oldString: '<div>a.b*c+d</div>',
        newString: '<div>replaced</div>',
      },
      expected: {
        html: '<div>replaced</div>',
      },
    },
  ];

  normalReplacementTestCases.forEach(({ description, input, expected }) => {
    it(description, () => {
      container.innerHTML = input.initialHtml;
      const rule = new RewriteRule(1, input.oldString, input.newString, '');
      const domDiffer = new DomDiffer(container, rule);
      domDiffer.applyRule();
      expect(container.innerHTML).toBe(expected.html);
    });
  });
});