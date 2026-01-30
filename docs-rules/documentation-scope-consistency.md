# ドキュメント作成時スコープ整合性ガイドライン

## 目的

ドキュメントを作成・編集する際に、対象範囲（スコープ）の記載が一貫性を保つためのガイドラインです。

## 問題の背景

ドキュメント内でコマンドやツールの適用範囲を記載する際、以下のような整合性の問題が発生しがちです：

- markdownlintの対象が`docs/`のみ記載され、`docs-rules/`が漏れる
- リンクチェックコマンドの対象範囲が実際の運用範囲と異なる
- 新しいディレクトリ追加時に関連ドキュメントの更新が漏れる

## 基本原則

### 1. 実運用との一致

ドキュメントに記載するコマンドやスコープは、実際のCI/CD環境や開発環境で使用されているものと一致させる。

### 2. 包括的なスコープ記載

対象となるすべてのディレクトリやファイルパターンを記載する。

### 3. 将来拡張への配慮

新しいディレクトリ追加時に更新が必要な箇所を明確にする。

## チェックポイント

### ドキュメント作成時

#### 1. 既存の設定ファイルとの整合性確認

新しいガイドラインやコマンドを記載する前に、以下を確認：

```bash
# markdownlintの場合
grep -r "markdownlint" make/test/main.mk
grep -r "lint:md" host-frontend-root/frontend-src-root/package.json

# リンクチェックツールの場合（もし導入されている場合）
grep -r "markdown-link-check" .
```

#### 2. 対象範囲の洗い出し

```bash
# 実際にMarkdownファイルが存在するディレクトリを確認
find . -name "*.md" -type f | cut -d'/' -f1-2 | sort | uniq

# 現在の対象
# ./docs/
# ./docs-rules/
# ./ (README.md等)
```

#### 3. コマンド例の統一

ドキュメント内のコマンド例は、実際のMakefileやnpm scriptsと同じパターンを使用する。

### ドキュメント更新時

#### 1. 影響範囲の特定

新しいディレクトリやツール対応を追加する際の影響箇所：

```bash
# 関連ドキュメントを検索
grep -r "docs/\*\*/\*.md" docs-rules/
grep -r "markdownlint" docs-rules/
grep -r "link-check" docs-rules/
```

#### 2. 一括更新の実施

関連するすべてのドキュメントで一貫したスコープに更新する。

## スコープ記載の標準パターン

### markdownlintの場合

```bash
# 正しいパターン（全対象を含む）
npx markdownlint-cli2 'docs/**/*.md' 'docs-rules/**/*.md' '*.md'

# 間違いパターン（docs-rulesが抜けている）
npx markdownlint-cli2 'docs/**/*.md' '*.md'
```

### リンクチェックの場合

```bash
# 正しいパターン（全対象を含む） - 自動化で使用
make checklinks
npm run check:links

# 直接実行する場合（効率的な方法）
find docs docs-rules -name '*.md' \
  -not -path 'docs/user-stories/completed/*' \
  -not -path 'docs/issues/completed/*' \
  -print0 | xargs -0 -P 4 -n 10 npx markdown-link-check -q
```

## 新しいディレクトリ追加時のチェックリスト

新しいドキュメントディレクトリ（例：`docs-templates/`）を追加する場合：

### 1. 設定ファイルの更新確認

- [ ] `make/test/main.mk` - lintmdタスクのパターン更新
- [ ] `package.json` - lint:mdスクリプトのパターン更新
- [ ] `.markdownlint-cli2.jsonc` - 除外パターンの確認・追加

### 2. ドキュメントの更新

- [ ] `link-validation-guide.md` - リンクチェックコマンドのパターン更新
- [ ] `linting-scope-consistency.md` - 対象範囲の例を更新
- [ ] 本ドキュメント - 新しいディレクトリを含む例に更新

### 3. テストと検証

```bash
# 新しいディレクトリが実際にlintの対象になっているか確認
make lintmd
make checklinks
```

## よくある見落としパターンとその対策

### パターン1: 一部のツールでのみスコープ更新

**問題**: markdownlintには`docs-rules`を追加したが、リンクチェックツールには追加し忘れた

**対策**: 
- ツール横断でのスコープ更新チェックリストの使用
- 関連ドキュメントの一括grep検索による漏れ確認

### パターン2: サンプルコマンドの更新漏れ

**問題**: 実際の設定は更新したが、ドキュメント内のサンプルコマンドが古いまま

**対策**:
- ドキュメント作成時に実際の設定ファイルから直接コマンドをコピー
- 定期的なドキュメントと設定の整合性チェック

### パターン3: CI環境での設定漏れ

**問題**: ローカル環境の設定は更新したが、CI環境での設定が古いまま

**対策**:
- npmスクリプトとMakefileの両方を確認
- CI設定ファイルでの使用コマンドの確認

## 予防策

### 1. テンプレート化

よく使用されるスコープパターンをテンプレート化：

```bash
# リンクチェック標準コマンド
make checklinks

# markdownlint標準コマンド  
make lintmd
```

### 2. 作成時チェックリスト

ガイドライン文書作成時の必須確認項目：

- [ ] 記載するコマンドは実際のMakeタスクと一致しているか
- [ ] 自動チェックが正常に動作することを確認したか
- [ ] 新しいディレクトリ追加時の影響箇所を明記したか
- [ ] 関連ドキュメントでのリンクが正常に動作するか確認したか

### 3. 定期的な自動チェック

```bash
# 定期チェックコマンド
make lintmd      # markdownlint実行
make checklinks  # リンクチェック実行
```

## 関連ドキュメント

- [linting-scope-consistency.md](./linting-scope-consistency.md) - リンティングツール固有の整合性管理
- [link-validation-guide.md](./link-validation-guide.md) - リンク検証手順
- `make/test/main.mk` - 実際のMakefileでのlint設定
- `host-frontend-root/frontend-src-root/package.json` - npm scriptsでのlint設定