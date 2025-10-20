# ISSUE-107 PULL REQUEST テンプレート

## タイトル
refactor: テストコードのIRewriteRuleRepositoryモック作成を統一化

## 概要と理由
テストコードで `let mockRepository: IRewriteRuleRepository;` を直接オブジェクトリテラルで作成している箇所を、専用のモック作成関数を使用する形に統一しました。これにより、テストコードの保守性と一貫性が向上し、既存の `createMockTabsService` と同様のパターンに統一されました。

## 主な変更点
- **新規作成**: `tests/unit/application/ports/IRewriteRuleRepository/createMockRewriteRuleRepository.ts`
  - `createMockRewriteRuleRepository()` 関数を作成
  - 既存の `createMockTabsService` と同じパターンで実装
- **リファクタリング**: 直接モック作成していた2つのテストファイルを修正
  - `tests/unit/application/usecases/rule/UpdateRewriteRuleUseCase/execute/normal-cases.test.ts`
  - `tests/unit/application/usecases/rule/LoadRewriteRuleForEditUseCase/execute/normal-cases.test.ts`
- 直接オブジェクトリテラル作成から関数呼び出しに変更

## テスト方法
[動作確認の手順]
- `make test-and-check` で回帰テスト通過を確認
  - 既存自動テストとlinterを同時に確認
- 修正したテストファイル個別実行での動作確認済み
  - UpdateRewriteRuleUseCase テスト: ✓ 通過
  - LoadRewriteRuleForEditUseCase テスト: ✓ 通過

## 補足
[追加の文脈や注意点]
- 既存のテスト動作に影響なし（同等のモックオブジェクトを生成）
- プロジェクトのテストパターン統一に貢献
- 今後のIRewriteRuleRepositoryのモック作成は統一された関数を使用可能

## 本スコープの対象外となったタスク
なし（計画したすべてのタスクを完了）

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->