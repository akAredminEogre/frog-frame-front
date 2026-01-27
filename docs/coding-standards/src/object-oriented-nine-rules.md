# オブジェクト指向ルール（ThoughtWorksアンソロジー）

以下の9つのルールを必ず遵守すること：

| # | ルール | ESLint |
|---|--------|--------|
| 1 | 1つのメソッドにつきインデントは1段階までにすること | ❌ 未実装（複雑） |
| 2 | else句を使用しないこと | ✅ 実装済 |
| 3 | すべてのプリミティブ型と文字列型をラップすること | ❌ 未実装（複雑） |
| 4 | 1行につきドットは1つまでにすること | ✅ 実装済 |
| 5 | 名前を省略しないこと | ❌ 未実装（複雑） |
| 6 | すべてのエンティティを小さくすること | ❌ 未実装（複雑） |
| 7 | 1つのクラスにつきインスタンス変数は2つまでにすること | ❌ 未実装（複雑） |
| 8 | ファーストクラスコレクションを使用すること | ❌ 未実装（複雑） |
| 9 | Getter、Setter、プロパティを使用しないこと | ✅ 実装済 |

### 適用シナリオ

1. **条件分岐を書こうとしたとき（ルール2: else句禁止）**: if-elseではなくearly returnやガード節で分岐を表現する。値が無効な場合に早期リターンし、正常系の処理をインデントなしで記述することで可読性を高める
2. **メソッドチェーンを書こうとしたとき（ルール4: 1行1ドット）**: `array.filter(...).map(...).join(...)` のようなチェーンは中間変数に分割する。ただしchrome APIの呼び出しコード（`chrome.tabs.query(...)` 等）は除外される

### 除外パターン

- **ルール3**: テストコードのモック関連コード、sendMessageのmessageパラメータ、catch節のerrorオブジェクト
- **ルール4**: chrome APIの呼び出しコード

## 対象ファイル
- src/frameworks-and-drivers/browser以下のコード

## eslint-rule

| ルール | ESLintファイル |
|--------|----------------|
| Rule 2: else句禁止 | `host-frontend-root/frontend-src-root/eslint-rules/object-oriented-nine-rules/no-else.js` |
| Rule 4: 1行1ドット | `host-frontend-root/frontend-src-root/eslint-rules/object-oriented-nine-rules/one-dot-per-line.js` |
| Rule 9: Getter/Setter禁止 | `host-frontend-root/frontend-src-root/eslint-rules/object-oriented-nine-rules/no-getter-setter.js` |

その他のルール（1, 3, 5, 6, 7, 8）は実装が複雑なため、PRレビューで確認。