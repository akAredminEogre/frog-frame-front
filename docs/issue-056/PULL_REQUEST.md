# ISSUE-056 PULL REQUEST

## タイトル
RewriteRuleエンティティの移動とリファクタリング - Strategy パターンの適用

## 概要と理由
RewriteRuleエンティティの保守性向上とコード整理を目的として、以下のリファクタリング作業を実施しました：

- RewriteRuleエンティティを専用ディレクトリ (`src/domain/entities/RewriteRule/`) に移動
- パターン処理ロジックをStrategy パターンで分離し、コードの責務を明確化
- 関連するアプリケーション層、インフラ層、テスト層のファイルを新しい構造に対応

このリファクタリングにより、コードの可読性と拡張性が向上し、今後のメンテナンスが容易になります。

## 主な変更点

### 修正したファイル
- `.clinerules/02-workflow-automation/03-daily-scrum-finishes/record-progress-after-coding.md`
- `host-frontend-root/frontend-src-root/src/application/ports/IRewriteRuleRepository.ts`
- `host-frontend-root/frontend-src-root/src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase.ts`
- `host-frontend-root/frontend-src-root/src/application/usecases/rule/SaveRewriteRuleAndApplyToCurrentTabUseCase.ts`
- `host-frontend-root/frontend-src-root/src/domain/entities/HtmlContent.ts`
- `host-frontend-root/frontend-src-root/src/domain/entities/HtmlReplacer.ts`
- `host-frontend-root/frontend-src-root/src/domain/entities/RewriteRule/RewriteRule.ts`
- `host-frontend-root/frontend-src-root/src/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository.ts`
- `host-frontend-root/frontend-src-root/tests/unit/domain/entities/HtmlContent.test.ts`
- `host-frontend-root/frontend-src-root/tests/unit/domain/entities/HtmlReplacer.test.ts`

## テスト方法
[動作確認の手順]
- `docker compose exec frontend npm run test-and-lint` で回帰テスト通過・未使用コードがないことを確認
  - 既存自動テストとlinterを同時に確認

## 補足
- ファイル移動に伴うimport文の更新を全関連ファイルで実施

## 本スコープの対象外となったタスク

特になし


<!-- ユーザーが使うコマンド workflow:submit-pull-request -->
