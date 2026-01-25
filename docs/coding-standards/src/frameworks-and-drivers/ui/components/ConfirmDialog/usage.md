# ConfirmDialog 使用ガイド

## 概要

確認ダイアログコンポーネント。WAI-ARIA Dialog Modal Pattern に準拠したアクセシブルな実装。

## 基本的な使い方

```tsx
import { ConfirmDialog } from 'src/frameworks-and-drivers/ui/components/organisms/ConfirmDialog';

<ConfirmDialog
  isOpen={isDialogOpen}
  title="ルールの削除"
  message="このルールを削除しますか？"
  onConfirm={handleConfirm}
  onCancel={handleCancel}
  confirmLabel="削除"
  cancelLabel="キャンセル"
/>
```

## Props

| Prop | 型 | 必須 | デフォルト | 説明 |
|------|---|------|-----------|------|
| `isOpen` | `boolean` | ○ | - | ダイアログの表示状態 |
| `title` | `string` | ○ | - | ダイアログのタイトル |
| `message` | `string` | ○ | - | 確認メッセージ |
| `onConfirm` | `() => void` | ○ | - | 確認ボタンクリック時のコールバック |
| `onCancel` | `() => void` | ○ | - | キャンセル時のコールバック |
| `confirmLabel` | `string` | - | `'削除'` | 確認ボタンのラベル |
| `cancelLabel` | `string` | - | `'キャンセル'` | キャンセルボタンのラベル |

## 制約事項

### onConfirm/onCancel は同期関数のみサポート

内部で `useProcessingGuard` フックを使用しており、**非同期関数（async関数）を直接渡すと正しく動作しない**。

#### 問題

非同期関数を渡した場合:
1. Promise の完了を待たずに処理完了と見なされる
2. reject 時に try/catch で捕捉されず、未処理の Promise rejection になる

#### ✅ 正しいパターン（非同期処理が必要な場合）

同期関数を渡し、内部で非同期処理を fire-and-forget で呼び出す:

```tsx
const confirmDelete = async () => {
  await deleteController.deleteRule(ruleId);
};

<ConfirmDialog
  isOpen={deleteTargetId !== null}
  onConfirm={() => {
    void confirmDelete().catch((e) => {
      setError(e.message);
    });
  }}
  onCancel={() => setDeleteTargetId(null)}
/>
```

#### ❌ 誤ったパターン

async 関数を直接渡す:

```tsx
// NG: async関数を直接渡している
<ConfirmDialog
  onConfirm={confirmDelete}  // confirmDelete は async 関数
/>
```

### 理由

`useProcessingGuard` は連続クリック防止のためのフックで、以下の動作をする:

1. ハンドラを同期的に実行
2. 実行中は `isProcessing = true` でボタンを無効化
3. **Promise の完了は待機しない**（同期ハンドラ前提の設計）

詳細: [useProcessingGuard](../../react-hooks/useProcessingGuard.md)

## キーボード操作

| キー | 動作 |
|-----|------|
| `Escape` | ダイアログを閉じる（onCancel呼び出し） |
| `Tab` | フォーカスがダイアログ内でループ |
| `Shift+Tab` | 逆方向にフォーカスがループ |

## アクセシビリティ

- `role="dialog"` と `aria-modal="true"` を設定
- `aria-labelledby` でタイトルを参照
- `aria-describedby` でメッセージを参照
- 初期フォーカスはキャンセルボタン（破壊的アクションのため安全な選択肢）

詳細: [ADR-007: ダイアログのアクセシビリティ要件](../../../../../../adr/007-dialog-accessibility-requirements.md)

## 関連ドキュメント

- [useProcessingGuard](../../react-hooks/useProcessingGuard.md) - 連続クリック防止フック
- [ADR-007: ダイアログのアクセシビリティ要件](../../../../../../adr/007-dialog-accessibility-requirements.md)
- [ConfirmDialog テスト戦略](../../../../../../design/src/frameworks-and-drivers/ui/components/organisms/ConfirmDialog/render.md)
