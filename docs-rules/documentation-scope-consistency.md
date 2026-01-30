# ドキュメントスコープ整合性ルール

## 目的

ドキュメント内でコマンドやツールの適用範囲（スコープ）を記載する際に満たすべき条件を定義します。

## 満たすべき条件

### 1. 実運用との一致

ドキュメントに記載するコマンドやスコープは、実際のCI/CD環境や開発環境で使用されているものと一致していること。

### 2. 包括的なスコープ記載

対象となるすべてのディレクトリやファイルパターンが記載されていること。

### 3. ツール間の整合性

同じ対象範囲を扱う複数のツール（例：markdownlintとリンクチェック）で、スコープが一致していること。

### 4. 設定ファイルとドキュメントの同期

設定ファイル（Makefile、package.json等）とドキュメント内の記載が同期されていること。

## 対象ツールと設定箇所

### markdownlint

| 設定箇所 | ファイル |
|---------|---------|
| Makeタスク | `make/test/main.mk` (`lintmd`, `lintmdfix`) |
| npmスクリプト | `package.json` (`lint:md`, `lint:md:fix`) |
| 除外設定 | `.markdownlint-cli2.jsonc` |

### リンクチェック

| 設定箇所 | ファイル |
|---------|---------|
| Makeタスク | `make/test/main.mk` (`checklinks`) |
| npmスクリプト | `package.json` (`check:links`) |

## 新規ディレクトリ追加時の更新対象

新しいドキュメントディレクトリを追加する場合、以下のすべてを更新すること：

- [ ] `make/test/main.mk` - lintmd/checklinksタスクのパターン
- [ ] `package.json` - lint:md/check:linksスクリプトのパターン
- [ ] `.markdownlint-cli2.jsonc` - 除外パターンの確認・追加
- [ ] 関連ガイドラインドキュメント

## 関連ドキュメント

- [linting-scope-consistency.md](./linting-scope-consistency.md) - リンティングツール固有の整合性管理
- [link-validation-guide.md](./link-validation-guide.md) - リンク検証ガイドライン
- [documentation-scope-update-procedures.md](./documentation-scope-update-procedures.md) - スコープ更新手順
