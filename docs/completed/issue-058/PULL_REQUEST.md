# ISSUE-058 PULL REQUEST

## タイトル
Refactor ChromeStorageRewriteRuleRepository to use dependency injection

## 概要と理由
ChromeStorageRewriteRuleRepositoryのdirect instantiation（直接インスタンス化）をDI（依存性注入）方式に変更し、dependency injectionの原則に従った実装に修正しました。これにより、コードの保守性とテスタビリティが向上します。

## 主な変更点
1. **DIコンテナへの登録追加** (`src/infrastructure/di/container.ts`)
   - ChromeStorageRewriteRuleRepositoryの具体クラス登録を追加
   - IRewriteRuleRepositoryインターフェースとChromeStorageRewriteRuleRepositoryの対応登録を追加

2. **App.tsxの修正** (`entrypoints/popup/App.tsx`)
   - handleSave関数内の`new ChromeStorageRewriteRuleRepository()`を`container.resolve<IRewriteRuleRepository>('IRewriteRuleRepository')`に変更

3. **DIコンテナテストファイルの期待値更新**
   - `tests/unit/infrastructure/di/container/concrete-class-registration-completeness.test.ts`: ChromeStorageRewriteRuleRepositoryを期待値に追加
   - `tests/unit/infrastructure/di/container/interface-registration-completeness.test.ts`: IRewriteRuleRepository - ChromeStorageRewriteRuleRepositoryの対応を期待値に追加

## テスト方法
[動作確認の手順]
- `docker compose exec frontend npm run test-and-lint` で回帰テスト通過・未使用コードがないことを確認
  - 既存自動テストとlinterを同時に確認
  - 全ユニットテスト（198件）およびe2eテスト（6件）が成功することを確認済み

## 補足
- 依存性注入の原則に従い、具体的な実装クラスへの依存を排除
- tsyringeライブラリを使用したDIコンテナ管理
- インターフェースベースでの依存性解決により、テストの際のモック化が容易
- コーディング標準とプロジェクト固有規則に準拠した実装

## 本スコープの対象外となったタスク
今回のスコープで予定されていた作業は全て完了しました。対象外となったタスクはありません。

<!-- ユーザーが使うコマンド workflow:submit-pull-request -->
