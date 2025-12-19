# オブジェクト指向ルール（ThoughtWorksアンソロジー）

以下の9つのルールを必ず遵守すること：

1. **1つのメソッドにつきインデントは1段階までにすること**
2. **else句を使用しないこと**
3. **すべてのプリミティブ型と文字列型をラップすること**
  - 除外パターン
    - テストコードのモック関連コード
    - sendMessageのmessageパラメータ
    - catch節のerrorオブジェクト
4. **1行につきドットは1つまでにすること**
  - 除外パターン
    - chrome APIの呼び出しコード
5. **名前を省略しないこと**
6. **すべてのエンティティを小さくすること**
7. **1つのクラスにつきインスタンス変数は2つまでにすること**
8. **ファーストクラスコレクションを使用すること**
9. **Getter、Setter、プロパティを使用しないこと**

## メソッド設計

- **メソッドは必ずインスタンス変数を使うこと**
  - 除外パターン
    - infrastructure層（frameworks-and-drivers層）のコード
  - **ESLint除外**: このルールはESLintで自動チェックしない（カスタムルール実装の複雑さのため、コードレビューで確認）

## 対象ファイル
- src/frameworks-and-drivers/browser以下のコード

## eslint-rule
`host-frontend-root/frontend-src-root/eslint-rules/object-oriented-nine-rules/`