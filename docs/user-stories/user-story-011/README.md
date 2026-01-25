# User Story 011: markdownlint導入

## ストーリー

> Markdownドキュメントの記述ルールをmarkdownlintで自動検証できる

## 概要

現在手動でPRレビュー時に確認しているMarkdown記述ルールを、markdownlintにより自動検証可能にする。これにより規約違反を早期に検出し、レビュー負荷を軽減する。

## 背景

[docs/docs-rules/common/](../../docs-rules/common/index.md) で定義されている以下の規約は、現在PRレビューで確認している:

| 規約 | markdownlintルール | 備考 |
|-----|-------------------|------|
| コードブロックの言語指定必須 | MD040 | 必須 |
| 許可する言語識別子の制限 | MD040 + `allowed_languages` | 設定で制限 |
| 見出しレベルの階層スキップ禁止 | MD001 | 必須 |
| コードフェンス言語識別子の小文字使用 | - | カスタムルールが必要 |

markdownlintを導入することで、これらを自動検証可能にする。

## 関連規約

- [language-and-style.md](../../docs-rules/common/language-and-style.md) - コードフェンス言語識別子
- [markdown.md](../../docs-rules/common/markdown.md) - Markdown記法ルール

## 現状分析

このユーザーストーリーはツール導入と開発環境設定の変更が中心であり、既存アプリケーションロジックの修正は発生しない。そのため分類A〜Eの差分分析は対象外とする。

### 現状

- markdownlint 関連パッケージ: 未インストール
- 設定ファイル（.markdownlint.jsonc）: 未作成
- 除外ファイル（.markdownlintignore）: 未作成
- 対象 Markdown ファイル: 約 1,246 ファイル（83,505 行）

## 開発戦略

### Phase 1: 基盤構築

- [ ] markdownlint-cli2 パッケージのインストール
- [ ] `.markdownlint.jsonc` 設定ファイルの作成（MD001, MD040 + allowed_languages）
- [ ] `.markdownlintignore` 除外ファイルの作成
- [ ] `package.json` へのスクリプト追加（`lint:md`, `lint:md:fix`）
- [ ] Makefile へのコマンド追加

### Phase 2: 既存ドキュメント修正

- [ ] 違反箇所の検出（`npm run lint:md` 実行）
- [ ] MD001（見出しレベル階層スキップ）違反の修正
- [ ] MD040（言語指定なし/許可外言語）違反の修正

### Phase 3: CI統合（任意）

- [ ] pre-commit フックへの追加検討
- [ ] GitHub Actions への追加検討

## 受け入れ条件

[acceptance-criteria.md](./acceptance-criteria.md) を参照
