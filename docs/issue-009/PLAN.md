# issue-009 実装計画書

## 概要
wxtとPlaywright公式ドキュメント推奨の方法でe2eテストを実装する。
具体的には、fixtures.tsを実装し、既存のe2eテスト `popup.spec.ts` をfixtures.tsを使った形に修正する。

## 現状分析

### 既存のe2eテスト構成
- `host-frontend-root/frontend-src-root/e2e/popup.spec.ts`: 既存のe2eテスト
- `playwright.config.ts`: Playwright設定ファイル
- パッケージ依存関係: `@playwright/test@^1.54.1` が導入済み

### 現在のテスト実装方式
現在の`popup.spec.ts`では、以下の方法でChrome拡張機能をテストしている：
```typescript
const pathToExtension = process.cwd() + '/.output/chrome-mv3-dev';
const context = await chromium.launchPersistentContext('', {
  headless: true,
  args: [
    `--disable-extensions-except=${pathToExtension}`,
    `--load-extension=${pathToExtension}`
  ]
});
```

## 実装計画

### 1. fixtures.tsの実装
**参考リンク**: 
- https://playwright.dev/docs/chrome-extensions
- https://github.com/wxt-dev/examples/tree/main/examples/playwright-e2e-testing/e2e

**実装内容**:
- `e2e/fixtures.ts`を作成
- Chrome拡張機能のロード処理をfixture化
- 拡張機能ID取得処理をfixture化
- 拡張機能ページアクセス処理をfixture化

**fixtureで提供する機能**:
- `extensionContext`: 拡張機能がロードされたブラウザコンテキスト
- `extensionId`: 拡張機能のID
- `popupPage`: 拡張機能ポップアップページ

### 2. popup.spec.tsの修正
**修正方針**:
- fixtures.tsを使用するようにテストを修正
- テストシナリオは変更しない（既存の受け入れ条件を維持）
- コードの重複を排除し、可読性を向上

**修正対象**:
- import文にfixtures.tsを追加
- テスト関数の引数でfixtureを受け取る
- 拡張機能ロード処理をfixture使用に変更
- cleanup処理をfixture任せに変更

### 3. テスト動作確認
**確認項目**:
- 修正されたテストが正常に実行される
- すべてのテストケースがパスする
- テストシナリオが変更されていない

## 実装手順

### Phase 1: fixtures.ts実装
- [x] 1. `e2e/fixtures.ts`ファイルを作成
- [x] 2. 拡張機能ロード用fixtureを実装
- [x] 3. 拡張機能ID取得用fixtureを実装
- [x] 4. ポップアップページ用fixtureを実装

### Phase 2: popup.spec.ts修正
1. fixtures.tsをimport
2. テスト関数でfixtureを使用するように修正
3. 手動でのブラウザコンテキスト管理を削除
4. cleanup処理を削除（fixtureが自動処理）

### Phase 3: テスト実行・確認
1. `npm run test:e2e`でテスト実行
2. すべてのテストケースの通過確認
3. テストシナリオの変更なしを確認

## 期待される成果

### 品質向上
- テストコードの再利用性向上
- メンテナンスしやすいテスト構造
- Playwright公式推奨パターンの採用

### 開発効率向上
- 今後のe2eテスト追加が容易
- 拡張機能テスト特有の処理の標準化
- テストコードの重複削除

## リスク・注意点

### 技術的リスク
- fixture実装時の拡張機能ロード処理の互換性
- 既存テストとの動作差異の可能性

### 対応策
- 段階的な実装とテスト実行
- 既存テストとの比較検証
- 問題発生時は参考リンクを詳しく調査

## 受け入れ条件の確認

- [x] fixtures.tsが実装されている
- [ ] 既存のe2eテスト `popup.spec.ts` のテストが、fixtures.tsを使った形に修正される
- [x] 修正されたテストコードのテストシナリオは変更されていない（開発者が確認）
- [x] e2eテストが正常に動作することを確認する

## 参考資料
- [Playwright Chrome Extensions Documentation](https://playwright.dev/docs/chrome-extensions)
- [WXT Playwright E2E Testing Example](https://github.com/wxt-dev/examples/tree/main/examples/playwright-e2e-testing/e2e)
