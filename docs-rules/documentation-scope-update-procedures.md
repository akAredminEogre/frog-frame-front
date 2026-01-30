# ドキュメントスコープ更新手順

## 目的

ドキュメントのスコープを更新する際の具体的な手順を定義します。

## 事前確認手順

### 1. 既存の設定ファイルとの整合性確認

新しいガイドラインやコマンドを記載する前に、以下を確認：

```bash
# markdownlintの場合
grep -r "markdownlint" make/test/main.mk
grep -r "lint:md" host-frontend-root/frontend-src-root/package.json

# リンクチェックツールの場合
grep -r "markdown-link-check" .
```

### 2. 対象範囲の洗い出し

```bash
# 実際にMarkdownファイルが存在するディレクトリを確認
find . -name "*.md" -type f | cut -d'/' -f1-2 | sort | uniq
```

### 3. コマンド例の統一

ドキュメント内のコマンド例は、実際のMakefileやnpm scriptsと同じパターンを使用する。

## 更新手順

### 1. 影響範囲の特定

新しいディレクトリやツール対応を追加する際の影響箇所を検索：

```bash
# 関連ドキュメントを検索
grep -r "docs/\*\*/\*.md" docs-rules/
grep -r "markdownlint" docs-rules/
grep -r "link-check" docs-rules/
```

### 2. 一括更新の実施

関連するすべてのドキュメントで一貫したスコープに更新する。

## 検証手順

### テスト実行

更新後は必ず以下を実行して整合性を確認：

```bash
# 新しいディレクトリが実際にlintの対象になっているか確認
make lintmd
make checklinks
```

## 作成時チェックリスト

ガイドライン文書作成時の必須確認項目：

- [ ] 記載するコマンドは実際のMakeタスクと一致しているか
- [ ] 自動チェックが正常に動作することを確認したか
- [ ] 新しいディレクトリ追加時の影響箇所を明記したか
- [ ] 関連ドキュメントでのリンクが正常に動作するか確認したか

## 関連ドキュメント

- [documentation-scope-consistency.md](./documentation-scope-consistency.md) - スコープ整合性ルール（満たすべき条件）
- [linting-scope-consistency.md](./linting-scope-consistency.md) - リンティングツール固有の整合性管理
- [link-validation-guide.md](./link-validation-guide.md) - リンク検証ガイドライン
