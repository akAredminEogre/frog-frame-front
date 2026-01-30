# ドキュメントリンク自動検証ガイドライン

## 目的

markdown-link-checkによる自動リンク検証を活用して、ドキュメント内のリンク切れを防ぐためのガイドラインです。

## 適用範囲

- `docs/`配下のすべてのMarkdownファイル
- `docs-rules/`配下のすべてのMarkdownファイル  
- プロジェクトルートの`README.md`等

## 自動リンクチェック

### コマンド

```bash
# Makeタスクでの実行
make checklinks

# npm scriptでの実行
npm run check:links

# 直接実行（効率的な方法）
find docs docs-rules -name '*.md' -print0 | xargs -0 -n1 npx markdown-link-check
```

### 実行タイミング

- **プルリクエスト作成前**: 必須
- **ドキュメント作成・編集後**: 推奨
- **定期メンテナンス**: 月次推奨

## 基本原則

### 1. 既存ファイルへのリンクのみ

存在しないファイルへのリンクは作成しない。将来作成予定のファイルへのリンクも禁止。

### 2. 自動チェック依存

手動でのリンク確認は行わず、markdown-link-checkの結果に従う。

### 3. CI統合の準備

将来的にCI/CDパイプラインでの自動チェックを想定した運用とする。

## デッドリンクへの対応

自動チェックでリンク切れが発見された場合の対応方針：

### 1. 削除
そのリンクが不要な場合は削除する。

### 2. 代替リンクに変更
類似の既存ファイルがある場合は、そのファイルへのリンクに変更する。

### 3. テキスト化
ファイル名やパスをコード形式で記載し、リンクにしない。

```markdown
# 修正例
# 修正前（デッドリンク）
- [存在しないファイル](../non-existent-file.md)

# 修正後（テキスト化）
- `non-existent-file.md` - 参照先ファイル（現在未作成）
```

## よく使用されるリンクパターン

標準的なリンクパターン（自動チェックで確認済み）：

```markdown
- [プロジェクト概要](../README.md)
- [CLAUDE.md](../CLAUDE.md)  
- [linting-scope-consistency.md](./linting-scope-consistency.md)
```

## 関連ドキュメント

- [linting-scope-consistency.md](./linting-scope-consistency.md) - リンティング設定の整合性管理
- [documentation-scope-consistency.md](./documentation-scope-consistency.md) - ドキュメントスコープ整合性ガイド
- [プロジェクト概要](../README.md) - プロジェクト全体の構成とルール