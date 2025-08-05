# ISSUE-010 PULL REQUEST

## タイトル
E2Eテストの追加: ポップアップでのURL自動入力機能のテスト実装

## 概要と理由
ポップアップを開いた際に、現在表示中のページのURLのオリジン（ドメイン部分）が「URLパターン (前方一致):」フォームに自動入力される機能について、品質保証のためのE2Eテストを追加しました。

具体的には、`https://agilemanifesto.org/iso/ja/manifesto.html` にアクセスした状態でポップアップを開き、フォームに `https://agilemanifesto.org` が自動入力されることを確認するテストを実装しています。

## 主な変更点
- `e2e/get-origin.spec.ts` に新しいE2Eテストケースを実装
  - 特定URLでのポップアップ開放とフォーム自動入力の確認テスト
  - WXT公式ドキュメントのサンプルコードを参考に実装
- `e2e/fixtures.ts` の修正
  - テスト実行に必要な `page` を開くためのロジックを追加
  - `popupPage` フィクスチャを適切に利用できるよう調整

## テスト方法

```bash
docker compose exec frontend npm run e2e
```

すべてのE2Eテストが正常にパスすることを確認済みです。

## 補足
- 拡張機能のE2Eテストでは、Chrome APIs（`chrome.tabs`、`chrome.windows`）の非同期処理に起因するタイミング問題が発生しましたが、`popupPage.reload()` を適切に配置することで安定したテスト実行を実現しています
- PlaywrightのCSP制約により、`waitForFunction` や `expect.poll` が使用できない環境のため、`toHaveValue` の `timeout` オプションを活用したアサーション手法を採用しています
- レビュー過程でfixtures.tsとpopup.spec.tsについて手動修正が行われ、最終的な実装が完成しています
