# 設計ドキュメントリンク検証ガイドライン

設計ドキュメント（`docs/design/`配下）での相対パスリンク管理ガイドライン。

## 基本原則

### 1. 自動検証依存

手動での相対パス確認は行わず、markdown-link-checkによる自動検証に依存する。

### 2. 既存ファイルへのリンクのみ

存在しないファイルへのリンクは作成しない。

## 自動リンクチェック

### コマンド実行

設計ドキュメント作成・編集後は必ず自動チェックを実行：

```bash
# プロジェクトルートから実行
make checklinks

# または npm script
npm run check:links
```

### 対象範囲

- `docs/design/src/**/*.md` - すべての設計ドキュメント
- `docs/design/pages/**/*.md` - ページレベル設計ドキュメント
- テスト戦略書での外部ドキュメント参照

## よく使用されるリンクパターン

### テスト戦略書からの標準的な参照

**テスト戦略書の典型的な位置**:
```text
docs/design/src/[layer]/[category]/[ClassName]/[methodName].md
```

**参照例**（7階層上からの参照）:

```markdown
# コーディング規約への参照
[mock-file-placement.md](../../../../../../../coding-standards/tests/common-rule/mock-file-placement.md)

# ADR参照
[ADR-001](../../../../../../../adr/001-clean-architecture-with-presenter-pattern.md)

# User Story参照
[User Story 014](../../../../../../../user-stories/user-story-014/README.md)
```

## リンク切れへの対応

自動チェックでリンク切れが検出された場合：

### 1. 削除
不要なリンクは削除する。

### 2. 代替リンクに変更
類似の既存ファイルがある場合は変更する。

### 3. テキスト化
ファイル名をコード形式で記載し、リンクにしない。

```markdown
# 修正例
# 修正前（リンク切れ）
[存在しないファイル](../../../../../../../non-existent-file.md)

# 修正後（テキスト化）
`non-existent-file.md` - 参照予定ファイル（未作成）
```

## 作成時チェックリスト

設計ドキュメント作成・編集時：

- [ ] リンク作成後に `make checklinks` を実行した
- [ ] リンク切れエラーがないことを確認した
- [ ] 必要に応じてリンク切れを修正した

## 関連ガイドライン

- [link-validation-guide.md](../link-validation-guide.md) - 全体的なリンク検証ガイドライン
- [documentation-scope-consistency.md](../documentation-scope-consistency.md) - ドキュメントスコープ整合性管理