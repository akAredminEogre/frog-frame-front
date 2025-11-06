# ISSUE-070 PULL REQUEST

## タイトル

feat: RewriteRuleにmatchesUrlメソッドを追加

## 概要と理由

RewriteRuleクラスに、指定されたURLがルールのURLパターンに前方一致するかを判定する`matchesUrl`メソッドを追加しました。

このメソッドは、URLベースでリライトルールを適用する際の判定ロジックを提供します。

## 主な変更点

### 1. RewriteRule.tsにmatchesUrlメソッドを追加

- URLパターンが空文字列の場合は`false`を返す
- それ以外の場合は、URLが`urlPattern`で前方一致するかを判定
- 適切なJSDocコメントを追加

**変更ファイル:**
- `host-frontend-root/frontend-src-root/src/domain/entities/RewriteRule/RewriteRule.ts`

### 2. matchesUrlメソッド用のテストコードを追加

**新規ファイル:**
- `host-frontend-root/frontend-src-root/tests/unit/domain/entities/RewriteRule/matchesUrl/normal-cases-true.test.ts` - 前方一致する（trueを返す）ケースのテスト
- `host-frontend-root/frontend-src-root/tests/unit/domain/entities/RewriteRule/matchesUrl/normal-cases-false.test.ts` - 前方一致しない（falseを返す）ケースのテスト

## テスト方法

- `docker compose exec frontend npm run test-and-lint` で回帰テスト通過・未使用コードがないことを確認
  - 既存自動テストとlinterを同時に確認

## 補足

- ブランチ作成前に多数の変更ファイルが混在していたため、必要な変更のみを慎重に特定し、不要な変更を確実に破棄・削除しました
- 今回の変更は、RewriteRuleクラスにURL判定機能を追加する基本実装です

## 本スコープの対象外となったタスク

なし

<!-- ユーザーが使うコマンド workflow:submit-pull-request -->
