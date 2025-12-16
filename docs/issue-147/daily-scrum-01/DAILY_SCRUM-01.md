# DAILY SCRUM-01回目
# DAILY SCRUM-作業計画
<!-- 作業計画は作業前のみ記入 -->

## 本スクラムの作業予定
<!-- PLAN.mdの計画の中でどのユーザーストーリーに取り組むか記載してください。 -->

Daily Scrum 1: RewriteRuleエンティティのディレクトリ移動の調査・計画

## 修正予定ファイル
<!-- 修正予定のファイルを記載してください。 -->

- RewriteRule.ts (現在位置: src/domain/entities/RewriteRule/ → 移動先: src/enterprise-business-rules/entities/RewriteRule/)
- RewriteRuleエンティティを参照している全ファイルのimport文（影響範囲の調査）

## スクラム内残タスク

- [x] 現在のRewriteRuleエンティティの配置と依存関係を調査
- [x] 移動先ディレクトリ構造の準備
- [x] RewriteRuleエンティティを参照しているファイル一覧の特定
- [x] import文修正の影響範囲の特定
- [x] テスト実行環境の準備
- [x] レビューコメント対応：非RewriteRule.tsファイルの目次移動を打ち消し

## 相談事項
<!-- workflow-01-create-daily-scrum-doc-after-coding.mdの場合は作成しない -->
<!-- 相談したいこと、質問したいこと、レビューしてほしいこと -->
<!-- について、体言止めでの相談ではなににどう答えればよいのか明確にならないので使わないでください-->
<!-- 相談は具体的な内容を記載してください。 -->
<!-- 質問は不明点を明確に記載してください。 -->
<!-- レビューしてほしいことは、レビュー対象を具体的に記載してください。 -->
<!-- また上記相談・質問・レビューのトピックが重複する場合は、まとめて記載してください。 -->
<!-- ユーザーが使うコマンド: frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow-see-discussion-then-start-coding.md-->

## 一言コメント
<!-- 感情ベースで一言コメントをお願いします。 -->

RewriteRuleエンティティの移動というクリーンアーキテクチャのリファクタリングは慎重に進めたいと思います。

# DAILY SCRUM-01作業実績
## 本スクラムでの作業実績内容
<!-- 本スクラムでの作業内容を記載してください。 -->
<!-- 結果的に不要になった作業や試行錯誤は記述しないでください -->

1. RewriteRuleエンティティの現在位置と依存関係の調査を完了
   - 現在位置: src/domain/entities/RewriteRule/
   - 依存ファイル: 33ファイル（src/）+ 42ファイル（tests/）= 75ファイル
   - 関連Strategy files: PatternProcessingStrategy、PatternProcessingStrategyFactory、RegexPatternProcessingStrategy、StringPatternProcessingStrategy

2. 移動先ディレクトリ構造の準備
   - src/enterprise-business-rules/entities/RewriteRule/ ディレクトリを作成

3. RewriteRuleエンティティと関連ファイルの移動実施
   - RewriteRule.ts及び関連Strategy filesを新しいディレクトリにコピー

4. 全依存ファイルのimport文修正を実施
   - 75ファイル全てのimport pathを `src/domain/entities/RewriteRule/` から `src/enterprise-business-rules/entities/RewriteRule/` に更新

5. テスト実行によるVerification完了
   - make testcheck 実行
   - unit tests: 322テスト全て成功 (77ファイル)
   - 変更が正常に動作することを確認

## 修正したファイル
<!-- スクラム単位での変更を記入 -->
<!-- 進捗としては変化があっても、スクラムとして変更がなかったファイルは記入しない -->

### 新規作成
- src/enterprise-business-rules/entities/RewriteRule/RewriteRule.ts
- src/enterprise-business-rules/entities/RewriteRule/PatternProcessingStrategy.ts
- src/enterprise-business-rules/entities/RewriteRule/PatternProcessingStrategyFactory.ts
- src/enterprise-business-rules/entities/RewriteRule/RegexPatternProcessingStrategy.ts
- src/enterprise-business-rules/entities/RewriteRule/StringPatternProcessingStrategy.ts

### import文修正 (75ファイル)
#### Application Layer
- src/application/ports/IRewriteRuleRepository.ts
- src/application/usecases/rule/UpdateRewriteRuleUseCase.ts
- src/application/usecases/rule/GetAllRewriteRulesUseCase.ts
- src/application/usecases/rule/LoadRewriteRuleForEditUseCase.ts
- src/application/usecases/rule/SaveRewriteRuleAndApplyToCurrentTabUseCase.ts

#### Domain Layer
- src/domain/value-objects/MatchingElements.ts
- src/domain/entities/ElementMatchesFlexiblePattern.ts
- src/domain/value-objects/Tabs.ts
- src/domain/value-objects/Tab.ts
- src/domain/entities/DomDiffer.ts
- src/domain/value-objects/RewriteRules.ts
- src/domain/entities/ReplaceElementPreservingState.ts

#### Infrastructure Layer
- src/infrastructure/persistence/indexeddb/DexieRewriteRuleRepository.ts
- src/infrastructure/browser/messaging/ChromeRuntimeRewriteRuleRepository.ts

#### Component Layer
- src/entrypoints/rules/RulesApp.tsx
- src/components/organisms/RulesTable/RulesTable.tsx
- src/components/molecules/RuleTableRow/RuleTableRow.tsx
- src/components/molecules/RuleTableRow/RuleTableRow.stories.tsx
- src/components/organisms/RulesTable/RulesTable.stories.tsx

#### Test Files
- tests/unit/ 配下の42ファイル