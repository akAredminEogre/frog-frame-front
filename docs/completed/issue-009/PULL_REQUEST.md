# ISSUE-009 PULL REQUEST

## タイトル
feat(e2e): Playwrightのfixturesを導入しテストコードをリファクタリング

## 概要と理由
PlaywrightおよびWXTの公式ドキュメントで推奨されている`fixtures`を用いて、既存のE2Eテストコードをリファクタリングしました。
これにより、Chrome拡張機能のテストで必要となる定型的な処理（ブラウザコンテキストの起動、拡張機能のロードなど）を共通化し、テストコードの可読性、再利用性、メンテナンス性を向上させることを目的としています。

## 主な変更点
- **`e2e/fixtures.ts`の新規作成**:
  - 拡張機能がロードされたブラウザコンテキスト (`extensionContext`)
  - 拡張機能ID (`extensionId`)
  - ポップアップページ (`popupPage`)
  - 上記を提供するfixtureを実装しました。
- **`e2e/popup.spec.ts`のリファクタリング**:
  - 新規に作成した`fixtures.ts`を利用するようにテストコードを全面的に修正しました。
  - これにより、テストごとの手動でのブラウザコンテキスト起動・破棄処理が不要になりました。

## テスト方法
1. 以下のコマンドを実行してE2Eテストを実施します。
   ```bash
   cd ~/akAredminEogre-project/favorite-keyword-link-frog && docker compose exec frontend npm run test:e2e
   ```
2. すべてのテストケースが正常にパスすることを確認します。

## 補足
- コンテナ環境でのテスト実行にあたり、`headless: true`モードで動作させる必要がありました。
- 実装の詳細は以下の公式ドキュメントを参考にしています。
  - [Playwright Chrome Extensions Documentation](https://playwright.dev/docs/chrome-extensions)
  - [WXT Playwright E2E Testing Example](https://github.com/wxt-dev/examples/tree/main/examples/playwright-e2e-testing/e2e)
