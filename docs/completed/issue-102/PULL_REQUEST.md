# ISSUE-102 PULL REQUEST

## タイトル
feat: RewriteRule.idの型をstringからnumberに変更

## 概要と理由
`RewriteRule.id`の型定義を`string`から`number`に変更し、コードベース全体で一貫性のある型使用を実現しました。この変更により、IDの数値演算や比較が型安全に行えるようになり、将来的な拡張性が向上します。

## 主な変更点

### 型定義の変更
- `RewriteRule`エンティティのid型を`string`から`number`に変更
- リポジトリインターフェースの`getById`メソッドのパラメータ型を更新

### ドメイン層の修正
- `RewriteRule.ts`: ID型定義とバリデーションロジックの更新
- `RewriteRuleNotFoundError.ts`: エラー処理でのID型の更新
- `RewriteRules.ts`: コレクション操作でのID型の更新

### アプリケーション層の修正  
- `IRewriteRuleRepository.ts`: インターフェースのgetByIdメソッドをnumber型に限定
- 各ユースケース: ID処理ロジックの型変換を削除し、number型で統一
  - `UpdateRewriteRuleUseCase.ts`
  - `LoadRewriteRuleForEditUseCase.ts`
  - `SaveRewriteRuleAndApplyToCurrentTabUseCase.ts`

### インフラストラクチャ層の修正
- `ChromeStorageRewriteRuleRepository.ts`: ストレージ実装のID処理を更新
- `DexieRewriteRuleRepository.ts`: IndexedDB実装のID処理を更新

### コンポーネント層の修正
- `EditRulePage.tsx`: URLパラメータからのID取得時の型変換を追加

### テストの更新
- 全ての関連するユニットテストでID値をnumber型に更新
- エラーケーステストでの型検証ロジックを更新

## テスト方法
[動作確認の手順]
- `make test-and-check` で回帰テスト通過を確認
  - 既存自動テストとlinterを同時に確認
- 全てのテストが正常に通過することを確認済み

## 補足
- Clean Architectureの原則に従い、各レイヤーで適切に型変更を実施
- ChromeStorageとDexieの両実装で一貫性のある変更を確保
- 既存のバリデーションロジックを維持しつつ、型の整合性を改善

## 本スコープの対象外となったタスク
なし（計画したすべてのタスクが完了）

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->