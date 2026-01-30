# リンティングスコープ整合性ガイドライン

## 目的

新しいディレクトリやファイルパターンをリンティング対象に追加する際に、すべての関連箇所で一貫性を保つためのガイドラインです。

## 適用場面

- 新しいディレクトリをmarkdownlintの対象に追加する場合
- 新しいファイルパターンをESLintの対象に追加する場合  
- その他リンティングツールの対象範囲を変更する場合

## チェックポイント

### Markdownlintの場合

新しいディレクトリ（例：`docs-rules`）をmarkdownlintの対象に追加する際は、以下の箇所をすべて更新すること：

1. **Makefileタスク**（`make/test/main.mk`）
   - [ ] `lintmd` タスクのパターン
   - [ ] `lintmdfix` タスクのパターン

2. **npmスクリプト**（`host-frontend-root/frontend-src-root/package.json`）
   - [ ] `lint:md` スクリプト
   - [ ] `lint:md:fix` スクリプト

3. **CI設定**（該当する場合）
   - [ ] GitHub Actionsワークフロー
   - [ ] その他CI設定ファイル

### ESLintの場合

新しいディレクトリやファイルパターンをESLintの対象に追加する際は、以下の箇所を確認：

1. **eslint.config.js**
2. **package.jsonのlintスクリプト**
3. **CI設定**

## 更新手順

### 1. 影響範囲の特定

```bash
# markdownlintの場合
grep -r "docs/\*\*/\*.md" .
grep -r "markdownlint" .

# ESLintの場合  
grep -r "\.ts,\.tsx" .
grep -r "eslint" .
```

### 2. 一括更新の確認

新しいパターンを追加する前に、既存の設定箇所をすべて洗い出し、同じパターンで更新すること。

### 3. テスト実行

更新後は必ず以下を実行して整合性を確認：

```bash
# Makefileとnpmスクリプトの結果が同じかテスト
make lintmd
npm run lint:md
```

## 見落としを防ぐための習慣

### プルリクエスト作成時

- [ ] 影響範囲の洗い出しを行ったか
- [ ] すべての関連箇所を更新したか
- [ ] ローカルでテストを実行したか
- [ ] CIで使用されるコマンドも確認したか

### レビュー時

- [ ] パターンの追加が一貫しているか
- [ ] 見落としている設定ファイルがないか
- [ ] CI/CDパイプラインでエラーが発生しないか

## 過去の事例

### markdownlint scope拡張（docs-rules追加）

**問題**: `make lintmd`にのみ`docs-rules/**/*.md`を追加し、`npm run lint:md`（CI使用）への追加を忘れた

**教訓**: リンティング対象の変更は、開発環境とCI環境の両方で使われるすべてのコマンドを更新する必要がある

**対策**: 
- grepでパターンを検索し、すべての関連箇所を洗い出す
- makeコマンドとnpmスクリプトの両方をテストする
- CIログを確認して実際に新しいファイルがリンティングされているか確認する

## 関連ドキュメント

- `make/test/main.mk` - Makefileでのlint実行設定
- `host-frontend-root/frontend-src-root/package.json` - npm scriptsでのlint実行設定
- [プロジェクト概要](../../README.md) - 開発環境セットアップ