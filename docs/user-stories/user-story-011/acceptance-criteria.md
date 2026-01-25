# 受け入れ条件

## ユーザーストーリー要件

- [ ] AC-1: `npm run lint:md` コマンドで `docs/` 配下のMarkdownファイルが検証される
- [ ] AC-2: 言語指定なしのコードブロックが違反として検出される（MD040）
- [ ] AC-3: 許可されていない言語識別子を使用したコードブロックが違反として検出される（MD040）
- [ ] AC-4: 見出しレベルの階層スキップが違反として検出される（MD001）
- [ ] AC-5: 既存ドキュメントの違反箇所がすべて修正されている

## 技術要件

- [ ] AC-6: markdownlint-cli2 が devDependencies に追加されている
- [ ] AC-7: `.markdownlint.jsonc` に MD001、MD040 ルールが設定されている
- [ ] AC-8: `allowed_languages` に `docs/docs-rules/common/markdown.md` で定義された言語識別子のみ指定されている
- [ ] AC-9: Makefile に markdownlint 実行コマンドが追加されている
