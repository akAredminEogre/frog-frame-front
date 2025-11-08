import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ElementMatchesFlexiblePattern } from 'src/domain/entities/ElementMatchesFlexiblePattern';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

describe('ElementMatchesFlexiblePattern.exec() - Exact Pattern Matching (isRegex: false)', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  /**
   * 厳密パターンマッチング機能のテストケース
   * 
   * @description ElementMatchesFlexiblePatternがisRegex=falseの場合に、
   * 厳密な文字列パターンで要素を正しくマッチングすることを検証する
   * 
   * テストシナリオ:
   * - 厳密なパターンマッチング成功ケース
   * - 属性付き要素のマッチング成功ケース
   * - 異なる内容でのマッチング失敗ケース
   * - 追加属性でのマッチング失敗ケース
   * - 空白文字の違いでのマッチング失敗ケース
   * - 必須属性欠如でのマッチング失敗ケース
   * - 異なるタグでのマッチング失敗ケース
   * - 異なる属性値でのマッチング失敗ケース
   * - タグ前後の改行・空白文字を無視した成功ケース
   * - タグ前後の改行・空白文字を無視した失敗ケース
   * 
   * @testInputFormat 各テストケースの構造:
   * - description: テストケースの日本語説明
   * - input.elementHTML: テスト対象のHTML文字列
   * - input.rule: isRegexをfalseに設定したRewriteRule設定
   * - expected: マッチするかどうかの真偽値
   */
  const testCases = [
    {
      description: '厳密なパターンマッチング成功ケース',
      input: {
        elementHTML: '<div>Replace me</div>',
        rule: {
          oldString: '<div>Replace me</div>',
          newString: '<span>Replaced!</span>',
          urlPattern: '',
          isRegex: false
        }
      },
      expected: true
    },
    {
      description: '属性付き要素のマッチング成功ケース',
      input: {
        elementHTML: '<button class="btn">Old Button</button>',
        rule: {
          oldString: '<button class="btn">Old Button</button>',
          newString: '<button class="new-btn">New Button</button>',
          urlPattern: '',
          isRegex: false
        }
      },
      expected: true
    },
    {
      description: '異なる内容でのマッチング失敗ケース',
      input: {
        elementHTML: '<div>Different content</div>',
        rule: {
          oldString: '<div>Replace me</div>',
          newString: '<span>Replaced!</span>',
          urlPattern: '',
          isRegex: false
        }
      },
      expected: false
    },
    {
      description: '追加属性でのマッチング失敗ケース',
      input: {
        elementHTML: '<button class="btn" onclick="alert()" id="test">Old Button</button>',
        rule: {
          oldString: '<button class="btn">Old Button</button>',
          newString: '<button class="new-btn">New Button</button>',
          urlPattern: '',
          isRegex: false
        }
      },
      expected: false
    },
    {
      description: '空白文字の違いでのマッチング失敗ケース',
      input: {
        elementHTML: '<div>Replace   me</div>',
        rule: {
          oldString: '<div>Replace me</div>',
          newString: '<span>Replaced!</span>',
          urlPattern: '',
          isRegex: false
        }
      },
      expected: false
    },
    {
      description: '必須属性欠如でのマッチング失敗ケース',
      input: {
        elementHTML: '<button>Old Button</button>',
        rule: {
          oldString: '<button class="btn">Old Button</button>',
          newString: '<button class="new-btn">New Button</button>',
          urlPattern: '',
          isRegex: false
        }
      },
      expected: false
    },
    {
      description: '異なるタグでのマッチング失敗ケース',
      input: {
        elementHTML: '<span class="btn">Old Button</span>',
        rule: {
          oldString: '<button class="btn">Old Button</button>',
          newString: '<button class="new-btn">New Button</button>',
          urlPattern: '',
          isRegex: false
        }
      },
      expected: false
    },
    {
      description: '異なる属性値でのマッチング失敗ケース',
      input: {
        elementHTML: '<button class="different">Old Button</button>',
        rule: {
          oldString: '<button class="btn">Old Button</button>',
          newString: '<button class="new-btn">New Button</button>',
          urlPattern: '',
          isRegex: false
        }
      },
      expected: false
    },
    {
      description: 'タグ前後の改行・空白文字を無視した成功ケース',
      input: {
        elementHTML: '\n  <div>Test content</div>  \n',
        rule: {
          oldString: '<div>Test content</div>',
          newString: '<div>Updated content</div>',
          urlPattern: '',
          isRegex: false
        }
      },
      expected: true
    },
    {
      description: '要素内の改行・空白文字を無視した成功ケース',
      input: {
        elementHTML: '<div>\n  Test content  \n</div>',
        rule: {
          oldString: '<div>Test content</div>',
          newString: '<div>Updated content</div>',
          urlPattern: '',
          isRegex: false
        }
      },
      expected: true
    }
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