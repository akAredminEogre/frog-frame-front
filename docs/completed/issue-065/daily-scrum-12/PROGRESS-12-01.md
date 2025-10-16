# 進捗

このファイルは作業の記録を残すためのものです。追記のみ行い、内容の修正や削除は行わないでください。

kk=12
実装が完了したらPROGRESS-12-01.mdを追記してコードレビューを依頼してください

## スクラム-12(01回目) の進捗

### 実装内容
- 全てのAtomsコンポーネントのStorybookストーリーファイルを作成
- 各コンポーネントの主要なバリエーション（props、状態）のストーリーを実装
- Storybookのドキュメント機能(autodocs)を活用したprops説明を追加

### 作成したストーリーファイル
- Button.stories.tsx: Primary、Secondary、Disabled、SubmitButton、ResetButtonのストーリー
- Checkbox.stories.tsx: Unchecked、Checked、Disabled、CheckedDisabled、WithoutLabelのストーリー
- Description.stories.tsx: SmallMuted、SmallDefault、MediumMuted、MediumDefault、LongTextのストーリー
- TextArea.stories.tsx: Default、WithValue、LargeRows、Disabled、WithPlaceholderのストーリー
- Title.stories.tsx: Level1-6、LongTitleのストーリー

### 品質確認
- test-and-lintを実行し、すべてのテストが成功
- knipによる未使用コードチェックも問題なし

### 修正したファイル
- frog-frame-front/host-frontend-root/frontend-src-root/src/components/atoms/Button.stories.tsx (新規作成)
- frog-frame-front/host-frontend-root/frontend-src-root/src/components/atoms/Checkbox.stories.tsx (新規作成)
- frog-frame-front/host-frontend-root/frontend-src-root/src/components/atoms/Description.stories.tsx (新規作成)
- frog-frame-front/host-frontend-root/frontend-src-root/src/components/atoms/TextArea.stories.tsx (新規作成)
- frog-frame-front/host-frontend-root/frontend-src-root/src/components/atoms/Title.stories.tsx (新規作成)

### 次回以降のスクラムに先送りする課題
特になし

### 本issueの対象外とする課題
特になし

### スクラム-12(01回目) のレビューコメント

<!-- ここはユーザが書くので空欄にしておいてください。 -->
<!-- ユーザーが使うコマンド .clinerules/02-workflow-automation/02-daily-scrum-starts/workflow:see-and-commit-review-comment-then-code-again.md -->
<!-- ユーザーが使うコマンド workflow:daily-scrum-pass-review-scrum -->

下記のエラーに対応してください
```
cd ~/absolute-path/to/frog-frame-front/ && docker compose exec frontend npm run storybook

> frog-frame-front@0.0.0 storybook
> storybook dev -p 6006 --host 0.0.0.0

storybook v9.1.8

info => Starting manager..
info => Starting preview..
'host' is set to '0.0.0.0' but 'allowedHosts' is not defined.
Defaulting 'allowedHosts' to true, which permits all hostnames.
To restrict allowed hostnames, add the following to your 'viteFinal' config:
Example: { server: { allowedHosts: ['mydomain.com'] } }
See:
- https://vite.dev/config/server-options.html#server-allowedhosts
- https://storybook.js.org/docs/api/main-config/main-config-vite-final
info Using tsconfig paths for react-docgen
╭──────────────────────────────────────────────────────────────────────────────────────────╮
│                                                                                          │
│   Storybook 9.1.8 for react-vite started                                                 │
│   744 ms for manager and 1.85 s for preview                                              │
│                                                                                          │
│    Local:            http://localhost:6006/                                              │
│    On your network:  http://0.0.0.0:6006/                                                │
│                                                                                          │
│   A new version (9.1.10) is available!                                                   │
│                                                                                          │
│   Upgrade now: npx storybook@latest upgrade                                              │
│                                                                                          │
│   Read full changelog: https://github.com/storybookjs/storybook/blob/main/CHANGELOG.md   │
│                                                                                          │
╰──────────────────────────────────────────────────────────────────────────────────────────╯
/opt/frontend-container-app-root/frontend-src-root/node_modules/storybook/bin/index.cjs:23
  throw error;
  ^

Error: spawn xdg-open ENOENT
    at ChildProcess._handle.onexit (node:internal/child_process:285:19)
    at onErrorNT (node:internal/child_process:483:16)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
Emitted 'error' event on ChildProcess instance at:
    at ChildProcess._handle.onexit (node:internal/child_process:291:12)
    at onErrorNT (node:internal/child_process:483:16)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21) {
  errno: -2,
  code: 'ENOENT',
  syscall: 'spawn xdg-open',
  path: 'xdg-open',
  spawnargs: [ 'http://0.0.0.0:6006/' ]
}

Node.js v20.19.5

```

---
