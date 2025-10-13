# ISSUE-075 PULL REQUEST

## タイトル
Storybookコンポーネントストーリーの追加とStorybookの設定改善

## 概要と理由
既存のUIコンポーネント（atoms、molecules、organisms）に対して、Storybookのストーリーファイルを作成しました。これにより、コンポーネントの視覚的なドキュメンテーションとインタラクティブな動作確認が可能になります。また、Storybook環境の設定を改善し、TypeScriptのパスエイリアスのサポートと自動ブラウザ起動の無効化を実装しました。

## 主な変更点

### 1. Storybookストーリーファイルの追加
以下のコンポーネントに対するストーリーファイルを作成：

**Atoms（原子コンポーネント）:**
- `Button.stories.tsx`
- `Checkbox.stories.tsx`
- `Description.stories.tsx`
- `Input.stories.tsx`
- `TextArea.stories.tsx`
- `Title.stories.tsx`

**Molecules（分子コンポーネント）:**
- `LabeledInput.stories.tsx`
- `LabeledTextArea.stories.tsx`
- `SaveButton.stories.tsx`

**Organisms（有機体コンポーネント）:**
- `NewStringTextArea.stories.tsx`
- `OldStringTextArea.stories.tsx`
- `URLPatternInput.stories.tsx`

### 2. Storybook設定の改善
**`.storybook/main.ts`:**
- `vite-tsconfig-paths`プラグインを追加し、TypeScriptのパスエイリアス（`@/`など）をStorybookで正しく解決できるように設定
- `viteFinal`設定を追加してVite設定をカスタマイズ

**`package.json`:**
- `storybook`コマンドに`--no-open`フラグを追加し、Docker環境での実行時に自動でブラウザが開かないように変更

## テスト方法
[動作確認の手順]
- `docker compose exec frontend npm run storybook`でStorybookを起動し、追加されたストーリーが正しく表示されることを確認
- 各コンポーネントのストーリーを開き、インタラクティブに動作を確認
- TypeScriptのパスエイリアスが正しく解決されることを確認
- `docker compose exec frontend npm run test-and-lint`で回帰テスト通過・未使用コードがないことを確認
  - 既存自動テストとlinterを同時に確認

## 補足
- Storybookは開発環境でのみ使用され、プロダクションビルドには影響しません
- すべてのストーリーファイルは、既存のコンポーネントの動作を変更せず、ドキュメンテーションと開発体験の向上のみを目的としています
- Docker環境での使用を考慮し、`--no-open`フラグを追加することで、ホスト環境のブラウザが自動起動しないようにしました

## 本スコープの対象外となったタスク
特になし

<!-- ユーザーが使うコマンド workflow:submit-pull-request -->
