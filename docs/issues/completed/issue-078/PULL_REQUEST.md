# ISSUE-078 PULL REQUEST

## タイトル
feat: RewriteRuleFormにキャンセルボタンを追加

## 概要と理由
RewriteRuleFormに「キャンセル」ボタンを追加し、フォーム編集を中断できるようにしました。これにより、ユーザーが編集を中断したい場合の操作性が向上します。また、フォームの型定義を共通型`RewriteRuleParams`に統一し、エラー表示やローディング状態の処理も追加しました。

## 主な変更点
1. **CancelButtonコンポーネントの追加**
   - 新規コンポーネント `CancelButton.tsx` を作成
   - `Button` コンポーネントをラップし、variant="secondary"を使用
   - Storybookストーリー `CancelButton.stories.tsx` を追加

2. **RewriteRuleFormの改善**
   - `CancelButton` コンポーネントを統合
   - `onCancel` プロパティを追加（オプショナル）
   - `isLoadingData` プロパティを追加してデータ読み込み中の表示に対応
   - `error` プロパティを追加してエラー表示に対応
   - インラインの `RewriteRule` インターフェースを削除し、共通型 `RewriteRuleParams` を使用
   - Storybookストーリー `RewriteRuleForm.stories.tsx` を追加

3. **型定義の統一**
   - `RewriteRule` インターフェースを `RewriteRuleParams` 型に統一
   - 型の一貫性を向上

## テスト方法
[動作確認の手順]
- `docker compose exec frontend npm run test-and-lint` で回帰テスト通過・未使用コードがないことを確認
  - 既存自動テストとlinterを同時に確認
- Storybookでキャンセルボタンとフォームの表示を確認

## 補足
- キャンセルボタンは `onCancel` プロパティが指定された場合のみ表示されます
- ローディング中はキャンセルボタンが無効化されます
- エラー発生時やデータ読み込み中は適切なメッセージが表示されます

## 本スコープの対象外となったタスク
特になし

<!-- ユーザーが使うコマンド workflow:submit-pull-request -->
