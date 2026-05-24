# User Story 016: ImportRulesJsonUI ModalDialogBase 移行（アクセシビリティ完全対応）

## ストーリー

> ルールJSONインポート機能のプレビューダイアログを ModalDialogBase に移行することで、アクセシビリティ要件（ADR-007）を完全に満たしたい

## 概要

`ImportRulesJsonUI` のプレビューダイアログは現在 `<div role="dialog">` で実装されており、基本的な WAI-ARIA 属性（`aria-modal`, `aria-labelledby`）は付与済みだが、以下の共通挙動が不足している。

- フォーカストラップ（ダイアログ内でフォーカスが閉じる）
- フォーカス復元（ダイアログを閉じたとき元の要素に戻る）
- Escape キーで閉じる
- オーバーレイクリックで閉じる

本ユーザーストーリーでは、リポジトリの ADR-007 準拠コンポーネント `ModalDialogBase` を利用して実装を置き換え、アクセシビリティと挙動の一貫性を担保する。

## 背景

PR#394 レビュー（GitHub Copilot コメント id:2856697504 / id:2843563958）で指摘済み。
本 PR（feat/rule-json-import）では `div role="dialog"` 実装を維持し、本ユーザーストーリーで将来フェーズの対応を明示した。

**該当ファイル**:
- `host-frontend-root/frontend-src-root/src/frameworks-and-drivers/ui/components/organisms/ImportRulesJsonUI/ImportRulesJsonUI.tsx`

**参照**:
- `src/frameworks-and-drivers/ui/components/molecules/ModalDialogBase/` （ADR-007 準拠コンポーネント）
- ADR-007: WAI-ARIA Dialog Modal Pattern 準拠方針

## 現状

### 現在の実装

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="import-preview-title"
>
  {/* プレビューコンテンツ */}
</div>
```

### 不足している挙動

| 要件 | 現状 | ModalDialogBase 後 |
|------|------|--------------------|
| フォーカストラップ | なし | あり（ADR-007 実装済み） |
| フォーカス復元 | なし | あり（ADR-007 実装済み） |
| Escape で閉じる | なし | あり（ADR-007 実装済み） |
| オーバーレイクリックで閉じる | なし | あり（ADR-007 実装済み） |

## 開発戦略

### Phase 1: ModalDialogBase への置き換え

- [ ] `ImportRulesJsonUI.tsx` のプレビューダイアログを `ModalDialogBase` ベースに変更
- [ ] フォーカストラップ・Escape・オーバーレイクリックの動作確認
- [ ] `ConfirmDialog` との共存（OK/キャンセル確認ダイアログは引き続き `ConfirmDialog` を使用）

### Phase 2: テスト整備

- [ ] E2E テスト: Escape キーでダイアログが閉じること
- [ ] E2E テスト: フォーカスがダイアログ内に閉じること
- [ ] ユニットテスト: `ModalDialogBase` を使用した場合の `ImportRulesJsonUI` のレンダリングテスト

## 受け入れ条件

[acceptance-criteria.md](./acceptance-criteria.md) を参照
