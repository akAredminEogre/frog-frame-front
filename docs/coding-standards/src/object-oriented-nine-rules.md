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
| 7 | 1つのクラスにつきインスタンス変数は2つまでにすること | ⚠️ 部分実装（コードレビューで補完） |
| 8 | ファーストクラスコレクションを使用すること | ❌ 未実装（複雑） |
| 9 | Getter、Setter、プロパティを使用しないこと | ✅ 実装済 |

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
| Rule 7: インスタンス変数2つまで | `host-frontend-root/frontend-src-root/eslint-rules/object-oriented-nine-rules/max-instance-variables.js` |
| Rule 9: Getter/Setter禁止 | `host-frontend-root/frontend-src-root/eslint-rules/object-oriented-nine-rules/no-getter-setter.js` |

その他のルール（1, 3, 5, 6, 8）は実装が複雑なため、PRレビューで確認。