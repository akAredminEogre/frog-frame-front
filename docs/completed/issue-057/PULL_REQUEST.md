# ISSUE-057 PULL REQUEST

## タイトル
RewriteRuleクラスのStrategy パターンリファクタリング

## 概要と理由
RewriteRuleクラスにおいてStrategy パターンを適用し、パターン処理ロジックを分離することで、コードの保守性と拡張性を大幅に向上させました。従来の単一クラスによる複雑な条件分岐から、責任が明確に分離された設計に変更しています。

## 主な変更点

### アーキテクチャの改善
- **PatternProcessingStrategy インターフェース**の導入により、パターン処理ロジックを抽象化
- **StringPatternProcessingStrategy**と**RegexPatternProcessingStrategy**で処理方法を明確に分離
- **PatternProcessingStrategyFactory**による適切なStrategy選択の自動化

### コード品質の向上
- **RegexConstants**の新設により正規表現パターンの一元管理を実現
- **RewriteRuleクラス**の責任を明確化し、複雑な条件分岐を削除
- **HtmlContentクラス**の更新と機能拡充

### 変更ファイル一覧

**メインファイル (7ファイル):**
- `src/domain/entities/RewriteRule/RewriteRule.ts`
- `src/domain/entities/RewriteRule/PatternProcessingStrategy.ts` (新規)
- `src/domain/entities/RewriteRule/PatternProcessingStrategyFactory.ts` (新規)
- `src/domain/entities/RewriteRule/RegexPatternProcessingStrategy.ts` (新規)
- `src/domain/entities/RewriteRule/StringPatternProcessingStrategy.ts` (新規)
- `src/domain/constants/RegexConstants.ts` (新規)
- `src/domain/entities/HtmlContent.ts`

**テストファイル (10ファイル):**
- `tests/unit/HtmlContent/regex-pattern-replacement.test.ts`
- `tests/unit/HtmlContent/string-pattern-replacement.test.ts`
- `tests/unit/domain/entities/RewriteRule/addHtmlWhitespaceIgnoringPattern/reflection-tests.test.ts`
- `tests/unit/domain/entities/RewriteRule/constructor/normal-cases.test.ts`
- `tests/unit/domain/entities/RewriteRule/createRedundantPattern/regex-pattern.test.ts`
- `tests/unit/domain/entities/RewriteRule/createRedundantPattern/string-pattern.test.ts`
- `tests/unit/domain/factories/PatternProcessingStrategyFactory.test.ts`
- `tests/unit/domain/strategies/RegexPatternProcessingStrategy/processPattern/normal-cases.test.ts`
- `tests/unit/domain/strategies/StringPatternProcessingStrategy/processPattern/normal-cases.test.ts`
- `tests/e2e/replace-inside-dom-with-regex.spec.ts`

## テスト方法
[動作確認の手順]
- `docker compose exec frontend npm run test-and-lint` で回帰テスト通過・未使用コードがないことを確認
  - 既存自動テストとlinterを同時に確認

## 補足
[追加の文脈や注意点]
- Strategy パターンの導入により、将来的な新しいパターン処理方式の追加が容易になりました
- 包括的なテストカバレッジにより、リファクタリングの安全性を確保しています
- RegexConstants により正規表現の管理が一元化され、メンテナンス性が向上しました

## 本スコープの対象外となったタスク

現時点で対象外となったタスクはありません。

<!-- ユーザーが使うコマンド workflow:submit-pull-request -->
