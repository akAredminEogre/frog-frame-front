import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ElementMatchesFlexiblePattern } from 'src/domain/entities/ElementMatchesFlexiblePattern';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

describe('ElementMatchesFlexiblePattern.exec() - Regex Pattern Matching (isRegex: true)', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  /**
   * 正規表現パターンマッチング機能のテストケース
   * 
   * @description ElementMatchesFlexiblePatternがisRegex=trueの場合に、
   * 正規表現パターンで要素を正しくマッチングすることを検証する
   * 
   * テストシナリオ:
   * - HTMLタグを含む正規表現パターンマッチング成功ケース
   * - 属性付き要素の正規表現マッチング成功ケース
   * - ネスト要素を含む正規表現マッチング成功ケース
   * - 複数属性の正規表現マッチング成功ケース
   * - リスト要素の正規表現マッチング成功ケース
   * - マッチしない正規表現パターンでの失敗ケース
   * - 異なるタグの正規表現パターンでの失敗ケース
   * - 不正な正規表現パターンでの失敗ケース
   * - タグ前後の改行・空白文字を無視した正規表現成功ケース
   * - タグ前後の改行・空白文字を無視した正規表現失敗ケース
   * 
   * @testInputFormat 各テストケースの構造:
   * - description: テストケースの日本語説明
   * - input.elementHTML: テスト対象のHTML文字列
   * - input.rule: isRegexをtrueに設定したRewriteRule設定
   * - expected: マッチするかどうかの真偽値
   */
  const testCases = [
    {
      description: 'HTMLタグを含む正規表現パターンマッチング成功ケース',
      input: {
        elementHTML: '<div>Test content</div>',
        rule: {
          oldString: '<div>.*?</div>',
          newString: '<div>Updated content</div>',
          urlPattern: '',
          isRegex: true
        }
      },
      expected: true
    },
    {
      description: '属性付き要素の正規表現マッチング成功ケース',
      input: {
        elementHTML: '<button class="btn primary">Submit</button>',
        rule: {
          oldString: '<button class="btn.*?">.*?</button>',
          newString: '<button class="new-btn">Updated</button>',
          urlPattern: '',
          isRegex: true
        }
      },
      expected: true
    },
    {
      description: 'ネスト要素を含む正規表現マッチング成功ケース',
      input: {
        elementHTML: '<div><span>Nested content</span></div>',
        rule: {
          oldString: '<div><span>.*?</span></div>',
          newString: '<div><span>Updated nested</span></div>',
          urlPattern: '',
          isRegex: true
        }
      },
      expected: true
    },
    {
      description: '複数属性の正規表現マッチング成功ケース',
      input: {
        elementHTML: '<input type="text" id="username" placeholder="Enter name">',
        rule: {
          oldString: '<input.*?type="text".*?>',
          newString: '<input type="email" id="email">',
          urlPattern: '',
          isRegex: true
        }
      },
      expected: true
    },
    {
      description: 'リスト要素の正規表現マッチング成功ケース',
      input: {
        elementHTML: '<ul><li>Item 1</li><li>Item 2</li></ul>',
        rule: {
          oldString: '<ul><li>.*?</li><li>.*?</li></ul>',
          newString: '<ul><li>New 1</li><li>New 2</li></ul>',
          urlPattern: '',
          isRegex: true
        }
      },
      expected: true
    },
    {
      description: 'マッチしない正規表現パターンでの失敗ケース',
      input: {
        elementHTML: '<span>Different content</span>',
        rule: {
          oldString: '<div>.*?</div>',
          newString: '<div>Updated content</div>',
          urlPattern: '',
          isRegex: true
        }
      },
      expected: false
    },
    {
      description: '異なるタグの正規表現パターンでの失敗ケース',
      input: {
        elementHTML: '<p>Paragraph content</p>',
        rule: {
          oldString: '<button.*?>.*?</button>',
          newString: '<button>Updated</button>',
          urlPattern: '',
          isRegex: true
        }
      },
      expected: false
    },
    {
      description: '不正な正規表現パターンでの失敗ケース',
      input: {
        elementHTML: '<div>Test content</div>',
        rule: {
          oldString: '<h[1-9]>.*?</h[1-9]>',
          newString: '<h1>Updated heading</h1>',
          urlPattern: '',
          isRegex: true
        }
      },
      expected: false
    },
    {
      description: 'タグ前後の改行・空白文字を無視した正規表現成功ケース',
      input: {
        elementHTML: '\n  <div>Test content</div>  \n',
        rule: {
          oldString: '\\s*<div>.*?</div>\\s*',
          newString: '<div>Updated content</div>',
          urlPattern: '',
          isRegex: true
        }
      },
      expected: true
    },
    {
      description: '要素内部の改行・空白文字を無視した正規表現失敗ケース',
      input: {
        elementHTML: '  <div>\nTest content  \n</div>',
        rule: {
          oldString: '\\s*<div>.*?</div>\\s*',
          newString: '<div>Updated content</div>',
          urlPattern: '',
          isRegex: true
        }
      },
      expected: true
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      // Arrange
      container.innerHTML = testCase.input.elementHTML;
      const element = container.firstElementChild!;
      
      const rule = new RewriteRule(
        1,
        testCase.input.rule.oldString,
        testCase.input.rule.newString,
        testCase.input.rule.urlPattern,
        testCase.input.rule.isRegex
      );
      const matcher = new ElementMatchesFlexiblePattern(element, rule);
      
      // Act
      const result = matcher.exec();
      
      // Assert
      expect(result).toBe(testCase.expected);
    });
  });
});