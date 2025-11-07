import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DomDiffer } from 'src/domain/entities/DomDiffer';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

/**
 * 正規表現キャプチャグループを使用したDOM置換テスト
 * 削除されたHtmlContentテストケースを現在のDomDifferアーキテクチャで復元
 */
describe('DomDiffer - 正規表現キャプチャグループ置換', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  // テスト用定数
  const ISBN_CATEGORY_HTML = '<span class="category">ISBN</span>：&nbsp;&nbsp;';
  const CATEGORY_VALUE_SPAN = '<span class="categoryValue">';

  /**
   * 正規表現キャプチャグループ置換テストケース
   * 削除されたHtmlContentテストケースを復元し、現在のDomDifferで実装
   */
  const regexCaptureTestCases = [
    {
      description: '正規表現でISBN番号を取得してリンクに置換する',
      input: {
        initialHtml: `<li class="productInfo">${ISBN_CATEGORY_HTML}${CATEGORY_VALUE_SPAN}9784065396209</span></li>`,
        oldString: `<li class="productInfo">${ISBN_CATEGORY_HTML}${CATEGORY_VALUE_SPAN}(.+?)</span></li>`,
        newString: `<li class="productInfo">${ISBN_CATEGORY_HTML}${CATEGORY_VALUE_SPAN}<a href="https://www01.hanmoto.com/bd/isbn/$1">$1</a></span></li>`,
      },
      expected: {
        html: `<li class="productInfo">${ISBN_CATEGORY_HTML}${CATEGORY_VALUE_SPAN}<a href="https://www01.hanmoto.com/bd/isbn/9784065396209">9784065396209</a></span></li>`,
      },
    },
    {
      description: '複数のキャプチャグループを使用した正規表現置換',
      input: {
        initialHtml: '<div><span class="title">書籍名</span><span class="isbn">9784065396209</span></div>',
        oldString: '<div><span class="title">(.+?)</span><span class="isbn">(.+?)</span></div>',
        newString: '<div><span class="title">$1</span><span class="isbn"><a href="https://www01.hanmoto.com/bd/isbn/$2">$2</a></span></div>',
      },
      expected: {
        html: '<div><span class="title">書籍名</span><span class="isbn"><a href="https://www01.hanmoto.com/bd/isbn/9784065396209">9784065396209</a></span></div>',
      },
    },
    {
      description: 'タグ属性値のキャプチャグループ置換',
      input: {
        initialHtml: '<img src="original.jpg" alt="画像">',
        oldString: '<img src="(.+?)" alt="(.+?)">',
        newString: '<img src="optimized_$1" alt="[$2]最適化済み">',
      },
      expected: {
        html: '<img src="optimized_original.jpg" alt="[画像]最適化済み">',
      },
    },
    {
      description: 'ネストしたタグのキャプチャグループ置換',
      input: {
        initialHtml: '<div class="card"><h3>タイトル</h3><p>説明文</p></div>',
        oldString: '<div class="card"><h3>(.+?)</h3><p>(.+?)</p></div>',
        newString: '<article class="enhanced-card"><header>$1</header><section>$2</section></article>',
      },
      expected: {
        html: '<article class="enhanced-card"><header>タイトル</header><section>説明文</section></article>',
      },
    },
  ];

  regexCaptureTestCases.forEach(({ description, input, expected }) => {
    it(description, () => {
      // Arrange
      container.innerHTML = input.initialHtml;
      const rule = new RewriteRule(1, input.oldString, input.newString, '', true);

      // Act
      const domDiffer = new DomDiffer(container, rule);
      domDiffer.applyRule();

      // Assert
      expect(container.innerHTML).toBe(expected.html);
    });
  });
});