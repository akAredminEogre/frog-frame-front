# ISSUE-147 PULL REQUEST

## タイトル
refactor: RewriteRuleエンティティをenterprise-business-rulesへ移行

## 概要と理由
user-story-001の開発戦略に基づき、RewriteRuleエンティティをClean Architectureの enterprise-business-rules層に移行します。この変更により、ドメイン層の複雑性を軽減し、エンタープライズビジネスルールとして適切に分離されます。

## 主な変更点

### アーキテクチャの変更
- RewriteRule.tsを`src/domain/entities/RewriteRule/`から`src/enterprise-business-rules/entities/RewriteRule/`に移動
- Clean Architectureに基づく適切な層分離の実現

### ファイル移動・作成
**新規作成されたファイル:**
- `src/enterprise-business-rules/entities/RewriteRule/RewriteRule.ts`

**import文修正対象:**
- 75ファイルのimport pathを修正（src: 33ファイル + tests: 42ファイル）

### レビューコメント対応
- 当初移動していた非RewriteRule.tsファイル（9ファイル）をdomainに復元
- RewriteRule.ts **のみ** をenterprise-business-rules層に配置する方針に調整

## テスト方法
[動作確認の手順]
- `make testcheck` で回帰テスト通過を確認
  - 既存自動テストとlinterを同時に確認
- unit tests: 322テスト全て成功
- TypeScript compilation正常

## 補足
[追加の文脈や注意点]
- issue-146の機能との互換性を保持
- 既存のテストケースを破壊せず、全てパス
- WXT frameworkとの統合を維持
- 段階的リファクタリングの第1段階として実施

## 本スコープの対象外となったタスク応）


<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->