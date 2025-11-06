# 実装計画

## 1. はじめに
このドキュメントは、issue-010「e2eテストの追加」の実装計画を定めるものです。
主な目的は、ポップアップを開いた際に、表示中ページのURLのオリジンが自動的にフォームに入力されることを確認するE2Eテストを追加することです。

## 2. 実装タスク
`ISSUE.md`に基づき、以下のタスクを順番に実行します。

### 2.1. E2Eテストの実装 (`get-origin.spec.ts`)
- [x] `frog-frame-front/host-frontend-root/frontend-src-root/e2e/get-origin.spec.ts` を開きます。
- [x] `test('ポップアップを開くと、URLパターンのフォームにブラウザに表示されているページのURLのドメインが自動入力されている')` のテストケース内に、`ISSUE.md`で示されたユースケースをテストするコードを実装します。
- [x] 具体的な手順は以下の通りです。
  1. `https://agilemanifesto.org/iso/ja/manifesto.html` にアクセスします。
  2. 拡張機能のポップアップを開きます。
  3. `URLパターン (前方一致):` というラベルを持つフォームの値が `https://agilemanifesto.org` であることをアサーションで確認します。
- [x] 実装にあたっては、同ファイル内にコメントアウトされているサンプルコードと、`fixtures.ts` を参考にします。

### 2.2. `fixtures.ts` の修正
- [x] `get-origin.spec.ts` の実装に伴い、`frog-frame-front/host-frontend-root/frontend-src-root/e2e/fixtures.ts` に修正が必要な場合は、適切な変更を加えます。
- [x] 現状では、ポップアップページを取得するためのフィクスチャが定義されています。新しいテストで追加のフィクスチャが必要になるかを確認し、必要であれば追加します。

### 2.3. テストの実行と確認
- [x] 新しく作成したE2Eテストを実行し、正常にパスすることを確認します。
  ```bash
  cd frog-frame-front && docker compose exec frontend npm run e2e -- get-origin.spec.ts
  ```
- [x] 既存のすべてのE2Eテストを実行し、影響（デグレード）がないことを確認します。
  ```bash
  cd frog-frame-front && docker compose exec frontend npm run e2e
  ```

## 3. テスト計画
本タスクでは、以下のテストを実施します。

- **新規E2Eテスト**:
  - `get-origin.spec.ts` に追加したテストケースが、想定通りに動作することを確認します。
- **リグレッションテスト**:
  - 既存のすべてのE2Eテストを実行し、今回の変更によって既存機能に悪影響が出ていないことを確認します。

## 4. その他
- 特になし。
