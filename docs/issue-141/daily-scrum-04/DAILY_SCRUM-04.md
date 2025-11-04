# DAILY SCRUM-04回目
# DAILY SCRUM-作業計画
<!-- 作業計画は作業前のみ記入 -->

## 本スクラムの作業予定
<!-- PLAN.mdの計画の中でどのユーザーストーリーに取り組むか記載してください。 -->
DOM差分書き換えアプローチのリファクタリングとテストコード実装

具体的には：
- `applyAllRules` において、`EnhancedHtmlReplacer` はコンストラクタではなく、`this.replacer.replace(targetElement, rule);` の段階でエンティティ化する
- `addHtmlWhitespaceIgnoringPattern` における変更妥当性の確認
- `EnhancedHtmlReplacer` において、`DomDiffer` のインスタンスをコンストラクタで生成するのではなく、`this.domDiffer.applyRule(rootElement, rule);` の段階でエンティティ化する
- `DomDiffer` のリファクタリング、変更妥当性確認
- `frog-frame-front/host-frontend-root/frontend-src-root/tests/unit/domain/entities/RewriteRule/addHtmlWhitespaceIgnoringPattern/reflection-tests.test.ts` の変更の妥当性確認

## 修正予定ファイル
<!-- 修正予定のファイルを記載してください。 -->
- `src/application/usecases/ApplySavedRulesOnPageLoadUseCase.ts` - EnhancedHtmlReplacerの使用方法をリファクタリング
- `src/domain/entities/EnhancedHtmlReplacer.ts` - DomDifferインスタンス化タイミングを変更
- `src/domain/entities/DomDiffer.ts` - リファクタリングと変更妥当性確認
- `src/domain/entities/RewriteRule/RewriteRule.ts` - addHtmlWhitespaceIgnoringPatternの変更確認
- `tests/unit/domain/entities/RewriteRule/addHtmlWhitespaceIgnoringPattern/reflection-tests.test.ts` - テスト妥当性確認

## スクラム内残タスク
- [ ] `applyAllRules`でのEnhancedHtmlReplacerエンティティ化タイミング変更
- [ ] `addHtmlWhitespaceIgnoringPattern`の変更妥当性確認
- [ ] EnhancedHtmlReplacerでのDomDifferインスタンス化タイミング変更  
- [ ] DomDifferのリファクタリング実装
- [ ] reflection-testsの変更妥当性確認
- [ ] 変更後のテスト実行とリグレッション確認

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
正規表現置換の修正が完了したので、次はアーキテクチャ的なリファクタリングに集中できる状況になりました。

# DAILY SCRUM-04作業実績
## 本スクラムでの作業実績内容
<!-- 本スクラムでの作業内容を記載してください。 -->
<!-- 結果的に不要になった作業や試行錯誤は記述しないでください -->

## 修正したファイル
<!-- スクラム単位での変更を記入 -->
<!-- 進捗としては変化があっても、スクラムとして変更がなかったファイルは記入しない -->