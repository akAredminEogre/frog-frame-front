# ISSUE-059 PULL REQUEST

## タイトル
ストレージの書き換えルール保存方法のリファクタリング

## 概要と理由
現在の個別ルール保存方式 `await chrome.storage.local.set({ [rule.id]: rule });` から、RewriteRulesファーストコレクションオブジェクトを使用した構造化された保存方式への変更を実施しました。

この変更により以下の問題が解決されます：
- ルールがchrome.storage.localの直下に散らばって保存される問題
- オブジェクト指向設計原則（ファーストコレクションパターン）への準拠不足
- ルール管理の複雑性とメンテナンス性の低さ

## 主な変更点

### 1. RewriteRulesファーストコレクションの実装
- `src/domain/value-objects/RewriteRules.ts` の新規作成
- RewriteRuleの集合を管理するファーストコレクションオブジェクト
- ルールの追加、削除、検索機能を提供
- 包括的なユニットテスト実装（メソッド別分割）

### 2. IRewriteRuleRepositoryインターフェースの拡張
- `src/application/ports/IRewriteRuleRepository.ts` に `getAll(): Promise<RewriteRules>` メソッドを追加

### 3. ChromeStorageRewriteRuleRepositoryの大幅修正
- `src/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository.ts` の実装変更
- `save` メソッド：RewriteRulesオブジェクト全体を保存する方式に変更
- `getAll` メソッド：RewriteRulesオブジェクトを取得する機能を実装
- ストレージ形式を `{ RewriteRules: { [rule.id]: rule } }` に変更

### 4. RewriteRuleエンティティのバリデーション強化
- `src/domain/entities/RewriteRule/RewriteRule.ts` の `fromPlainObject` メソッドにバリデーション機能を追加
- 不正な入力に対してエラーを投げる仕様に変更
- 14個のテストケースで正常系・異常系・バリデーションエラーを完全にカバー

### 5. 依存性注入の適切な実装
- `src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase.ts` のアーキテクチャ違反を修正
- `entrypoints/content.ts` での依存性注入を適切に実装
- tsyringeコンテナを使用した依存関係の解決

### 6. 包括的なテスト実装
- ChromeStorageRewriteRuleRepository関連テストの完全実装
- テストコーディング規約に準拠したメソッド別ディレクトリ構造
- infrastructure層テストの適切な分割とArrange-Act-Assertパターンの適用

## テスト方法
[動作確認の手順]
- `docker compose exec frontend npm run test-and-lint` で回帰テスト通過・未使用コードがないことを確認
  - 既存自動テストとlinterを同時に確認
- **テスト結果**: 全54ファイル、227テストが成功
- **E2Eテスト**: 6つのE2Eテストが全て通過
- **Linter**: ESLintエラーなし、未使用コード警告なし

## 補足
[追加の文脈や注意点]
- オブジェクト指向ルール（ThoughtWorksアンソロジー）のファーストコレクションパターンを適用
- クリーンアーキテクチャの維持とレイヤー分離の徹底
- Chrome Storage APIの制限への適切な配慮
- 既存機能への影響を最小限に抑制

実装過程で2回のデイリースクラムを通じて段階的改善を実施し、レビューコメントに基づく継続的な品質向上を図りました。

## 本スコープの対象外となったタスク

以下のタスクは当初検討されましたが、レビューコメントによりスコープから除外されました：
- **マイグレーション機能**: 既存データ形式からRewriteRulesオブジェクト形式への自動移行処理
  - 理由：「やりすぎ」との指摘により、シンプルな実装を優先
- **複雑なデータ変換ロジック**: 旧形式データの検出・変換処理
  - 理由：必要最小限の機能に集中するため

<!-- ユーザーが使うコマンド workflow:submit-pull-request -->
