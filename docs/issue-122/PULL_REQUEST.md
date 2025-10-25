# ISSUE-122 PULL REQUEST

## タイトル
fix: e2eテスト実行時のserve警告を解消

## 概要と理由
e2eテスト実行時に発生していた以下の警告を解消しました：
```
[WebServer] npm warn exec The following package was not found and will be installed: serve@14.2.5
```

この警告は、playwright.config.tsのwebServerで`npx serve`コマンドを使用しているにもかかわらず、`serve`パッケージがpackage.jsonのdevDependenciesに含まれていなかったために発生していました。

テスト実行のたびにnpxが自動的にserveパッケージをダウンロード・インストールしていたため、実行時間の増加と不要な警告メッセージが表示されていました。

## 主な変更点

### package.jsonの変更:
- `serve@^14.2.5`をdevDependenciesに追加
  - alphabetical orderで"knip"と"storybook"の間に配置
  - playwright.config.tsで使用されているバージョンと一致

### 修正箇所:
- `host-frontend-root/frontend-src-root/package.json`

## テスト方法
- `make testlint` で回帰テスト通過を確認
  - ✅ 267 unit tests passed
  - ✅ 12 E2E tests passed
  - ✅ Knip: no unused code detected
  - ✅ Linting: passed
  - ✅ E2Eテスト実行時の警告が解消されたことを確認

## 補足
この修正により、E2Eテスト実行時のnpm警告が解消され、開発体験が向上します。

`serve`パッケージはPlaywright E2EテストのwebServerで使用されており、テストページ（`tests/e2e/test-pages`）を配信するために必要です。

## 本スコープの対象外となったタスク
なし

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->
