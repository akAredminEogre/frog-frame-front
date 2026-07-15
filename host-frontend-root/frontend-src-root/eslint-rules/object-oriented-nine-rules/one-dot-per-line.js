// Rule 4: 1行につきドットは1つまでにすること
// 除外パターン: chrome APIの呼び出しコード、this経由の依存注入メソッド呼び出し（this.xxx.yyy()）
// See: docs/coding-standards/src/object-oriented-nine-rules.md

// no-restricted-syntax selectors for this rule (aggregated per glob in main.js — see main.js).
export const oneDotPerLineRestrictedSyntax = [
  {
    // メソッドチェーン（a.b.c()）を検出
    // 除外1: chrome.xxx.yyy() — Chrome API呼び出し
    // 除外2: this.xxx.yyy() — 依存注入オブジェクトへのメソッド呼び出し（ビルダーパターン）
    selector: 'CallExpression > MemberExpression > MemberExpression:not([object.name="chrome"]):not([object.type="ThisExpression"])',
    message: 'Method chaining with more than one dot is not allowed (Rule 4: 1行につきドットは1つまで). Exceptions: chrome API calls, this.xxx.yyy() dependency injection calls.',
  },
];

// files globs this rule applies to (browser + interactors layers).
export const oneDotPerLineFiles = [
  '**/frameworks-and-drivers/browser/**/*.ts',
  '**/application-business-rules/interactors/**/*.ts',
];
