# DeleteRuleUI コンポーネント テスト戦略

## 目的

ルール削除に関するUI（ConfirmDialogとToastNotification）をRulesAppから切り出したコンポーネント。
削除確認ダイアログとエラーToast通知の表示を統合する。

## テスト分類

### 1. ConfirmDialog表示

deleteTargetIdに応じた確認ダイアログの表示/非表示を検証。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| 表示 | deleteTargetIdがnullでない場合ConfirmDialogが表示される | 削除確認フロー |
| 非表示 | deleteTargetIdがnullの場合ConfirmDialogが非表示 | 初期状態・キャンセル後 |

**対応テスト**: `confirm-dialog.test.tsx`

### 2. ToastNotification表示

deleteErrorに応じたエラーToastの表示/非表示を検証。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| 表示 | deleteErrorがnullでない場合ToastNotificationが表示される | エラー通知 |
| 非表示 | deleteErrorがnullの場合ToastNotificationが非表示 | 正常時 |
| メッセージ | エラーメッセージにruleIdとmessageが含まれる | ユーザーへの情報提供 |

**対応テスト**: `toast-notification.test.tsx`

### 3. コールバック伝達

親から受け取ったコールバックがConfirmDialog/ToastNotificationに正しく伝達されることを検証。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| 削除確認 | ConfirmDialogの確認ボタンでonConfirmDeleteが呼ばれる | 削除実行 |
| キャンセル | ConfirmDialogのキャンセルボタンでonCancelDeleteが呼ばれる | 削除キャンセル |
| Toast閉じる | ToastNotificationの閉じるボタンでonDismissErrorが呼ばれる | エラー消去 |

**対応テスト**: `callback-propagation.test.tsx`

## 網羅性チェック

- [x] ConfirmDialogの表示/非表示
- [x] ToastNotificationの表示/非表示
- [x] エラーメッセージのフォーマット
- [x] コールバック伝達（確認・キャンセル・閉じる）
- [ ] ConfirmDialogの内部動作 → 対象外（ConfirmDialog自体のテストで検証済み）
- [ ] ToastNotificationの内部動作 → 対象外（ToastNotification自体のテストで検証済み）

## テストファイル構成

```
tests/unit/frameworks-and-drivers/ui/components/organisms/DeleteRuleUI/
├── test-helpers.tsx
├── confirm-dialog.test.tsx
├── toast-notification.test.tsx
└── callback-propagation.test.tsx
```

## モック戦略

> **重要**: モック作成は [basic-rule.md](../../../../../../../coding-standards/tests/unit/common-rule/basic-rule.md) の「モック作成の分離ルール」に従うこと。

### 既存モック確認チェック（必須）

- [x] 外部コンポーネント（ConfirmDialog, ToastNotification）はモック不要 → 実際のコンポーネントをレンダリング

### モック対象

| 依存関係 | モック理由 | 既存モック |
|---------|-----------|-----------|
| CSSモジュール | Vitest設定で自動処理 | 不要 |
| コールバック関数 | vi.fn()で呼び出し検証 | 不要 |

### テストヘルパー

共通のセットアップ・クリーンアップロジックを集約したテストヘルパー:

**参照**: `tests/unit/frameworks-and-drivers/ui/components/organisms/DeleteRuleUI/test-helpers.tsx`
