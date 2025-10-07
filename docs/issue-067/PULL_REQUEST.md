# ISSUE-067 UIコンポーネントの整理（Atomic Design導入）

## タイトル
UIコンポーネントをAtomic Designに基づいて整理し、App.tsx関連の必要なファイルのみを保持

## 概要と理由
App.tsxとその依存関係にあるプロダクションファイルのみを残し、不要なファイルを削除することで、コードベースを整理しました。同時に、Atomic Designの原則に基づいたコンポーネント構成を導入し、保守性と再利用性を向上させました。

主な目的:
- App.tsxから再帰的にインポートされているファイルのみを保持
- Atomic Design（atoms, molecules, organisms）に基づいたコンポーネント構成の導入
- 不要なedit関連機能とテストファイルの削除
- コードベースの簡素化と整理

## 主な変更点

### 削除されたファイル
- `src/components/Button.css`
- `src/components/Button.stories.tsx`
- `src/components/Button.tsx`

### 新規追加されたファイル

#### Atoms（基本コンポーネント）
- `src/components/atoms/Button.module.css` / `Button.tsx`
- `src/components/atoms/Checkbox.module.css` / `Checkbox.tsx`
- `src/components/atoms/Description.module.css` / `Description.tsx`
- `src/components/atoms/Input.module.css` / `Input.tsx`
- `src/components/atoms/TextArea.module.css` / `TextArea.tsx`
- `src/components/atoms/Title.module.css` / `Title.tsx`

#### Molecules（組み合わせコンポーネント）
- `src/components/molecules/InputSection.module.css`
- `src/components/molecules/LabeledInput.tsx`
- `src/components/molecules/LabeledTextArea.tsx`
- `src/components/molecules/SaveButton.tsx`

#### Organisms（複合コンポーネント）
- `src/components/organisms/NewStringTextArea.tsx`
- `src/components/organisms/OldStringTextArea.tsx`
- `src/components/organisms/RewriteRuleForm.module.css` / `RewriteRuleForm.tsx`
- `src/components/organisms/URLPatternInput.tsx`

#### その他
- `src/components/tokens.module.css` - デザイントークン
- `tsconfig.tsr.json` - TypeScript設定

### 変更されたファイル
- `src/entrypoints/popup/App.tsx` - RewriteRuleFormを使用した新しい実装
- `src/entrypoints/popup/style.css` - ポップアップのスタイル調整

## テスト方法
[動作確認の手順]
- `docker compose exec frontend npm run test-and-lint` で回帰テスト通過・未使用コードがないことを確認
  - 既存自動テストとlinterを同時に確認

## 補足
- Atomic Designの階層構造により、コンポーネントの責務が明確になり、再利用性が向上しました
- CSS Modulesとデザイントークンによりスタイルのカプセル化と一貫性を実現しています
- edit関連の機能は本ブランチのスコープ外として削除しました

## 本スコープの対象外となったタスク
- edit entrypoint関連の機能実装
- 既存テストファイルのAtomic Design対応
- RewriteRule.tsのmatchesUrlメソッド（削除）


<!-- ユーザーが使うコマンド workflow:submit-pull-request -->
