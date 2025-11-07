import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { DomDiffer } from 'src/domain/entities/DomDiffer';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

/**
 * 文字列パターン置換テスト
 * 削除されたHtmlContentテストケースを現在のDomDifferアーキテクチャで復元
 */
describe('DomDiffer - 通常文字列での置換の回帰テスト', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  /**
   * 通常文字列置換テストケース
   * 削除されたHtmlContentテストケースを復元し、現在のDomDifferで実装
   * DomDifferは完全要素置換を行うため、完全なHTML要素での置換テストに修正
   */
  const stringPatternTestCases = [
    {
      description: '通常文字列での基本置換が正しく動作する',
      input: {
        initialHtml: '<div class="test">元のテキスト</div>',
        oldString: '<div class="test">元のテキスト</div>',
        newString: '<div class="test">置換されたテキスト</div>',
      },
      expected: {
        html: '<div class="test">置換されたテキスト</div>',
      },
    },
    {
      description: 'span要素の完全置換',
      input: {
        initialHtml: '<p>これは<span>重要な</span>メッセージです</p>',
        oldString: '<span>重要な</span>',
        newString: '<span class="highlight">非常に重要な</span>',
      },
      expected: {
        html: '<p>これは<span class="highlight">非常に重要な</span>メッセージです</p>',
      },
    },
    {
      description: '複数のli要素の一括置換',
      input: {
        initialHtml: '<ul><li>項目1</li><li>項目2</li><li>項目3</li></ul>',
        oldString: '<li>項目1</li>',
        newString: '<li class="item">アイテム1</li>',
      },
      expected: {
        html: '<ul><li class="item">アイテム1</li><li>項目2</li><li>項目3</li></ul>',
      },
    },
    {
      description: 'a要素の完全置換',
      input: {
        initialHtml: '<div><a href="http://example.com" class="link">リンク</a></div>',
        oldString: '<a href="http://example.com" class="link">リンク</a>',
        newString: '<a href="https://secure-example.com" class="secure-link">セキュアリンク</a>',
      },
      expected: {
        html: '<div><a href="https://secure-example.com" class="secure-link">セキュアリンク</a></div>',
      },
    },
    {
      description: 'h1要素の置換',
      input: {
        initialHtml: '<div class="container"><header><h1>旧タイトル</h1></header><main><p>説明文</p></main></div>',
        oldString: '<h1>旧タイトル</h1>',
        newString: '<h1 class="title">新タイトル</h1>',
      },
      expected: {
        html: '<div class="container"><header><h1 class="title">新タイトル</h1></header><main><p>説明文</p></main></div>',
      },
    },
    {
      description: 'code要素の置換',
      input: {
        initialHtml: '<div><code>console.log("Hello, World!");</code></div>',
        oldString: '<code>console.log("Hello, World!");</code>',
        newString: '<code class="js">console.log("こんにちは、世界！");</code>',
      },
      expected: {
        html: '<div><code class="js">console.log("こんにちは、世界！");</code></div>',
      },
    },
  ];

  stringPatternTestCases.forEach(({ description, input, expected }) => {
    it(description, () => {
      // Arrange
      container.innerHTML = input.initialHtml;
      const rule = new RewriteRule(1, input.oldString, input.newString, '', false); // isRegex = false

      // Act
      const domDiffer = new DomDiffer(container, rule);
      domDiffer.applyRule();

      // Assert
      expect(container.innerHTML).toBe(expected.html);
    });
  });
});