# User Story 011: markdownlint導入

## ストーリー

> Markdownドキュメントの記述ルールをmarkdownlintで自動検証できる

## 概要

現在手動でPRレビュー時に確認しているMarkdown記述ルールを、markdownlintにより自動検証可能にする。これにより規約違反を早期に検出し、レビュー負荷を軽減する。

## 背景

[docs-rules/common/](../../../docs-rules/common/index.md) で定義されている以下の規約は、現在PRレビューで確認している:

| 規約 | markdownlintルール | 備考 |
|-----|-------------------|------|
| コードブロックの言語指定必須 | MD040 | 必須 |
| 許可する言語識別子の制限 | MD040 + `allowed_languages` | 設定で制限 |
| 見出しレベルの階層スキップ禁止 | MD001 | 必須 |
| コードフェンス言語識別子の小文字使用 | - | カスタムルールが必要 |

markdownlintを導入することで、これらを自動検証可能にする。

## 関連規約

- [language-and-style.md](../../../docs-rules/common/language-and-style.md) - コードフェンス言語識別子
- [markdown.md](../../../docs-rules/common/markdown.md) - Markdown記法ルール

## タスク

（別途策定）

## 受け入れ条件

（別途策定）
