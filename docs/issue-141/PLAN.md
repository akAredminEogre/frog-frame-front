# Issueの計画

# DAILY-SCRUM単位のタスク
- ISSUE.mdを元に、開発タスクをデイリースクラム単位に分解する
- [x] 現在のHtmlReplacerの実装を調査し、DOM書き換えの問題点を特定する
- [x] DOM差分書き換えアプローチの調査と設計（理想案）
- [x] DOM差分書き換えアプローチのリファクタリングとテストコード実装
  - [x] `applyAllRules` において、`EnhancedHtmlReplacer` はコンストラクタではなく、`this.replacer.replace(targetElement, rule);` の段階でエンティティ化する。
  - [x] `addHtmlWhitespaceIgnoringPattern` における変更妥当性の確認
  - [x] `EnhancedHtmlReplacer` において、`DomDiffer` のインスタンスをコンストラクタで生成するのではなく、`this.domDiffer.applyRule(rootElement, rule);` の段階でエンティティ化する。
  - [x] `DomDiffer` のリファクタリング、変更妥当性確認
  - [x] `frog-frame-front/host-frontend-root/frontend-src-root/tests/unit/domain/entities/RewriteRule/addHtmlWhitespaceIgnoringPattern/reflection-tests.test.ts` の変更の妥当性確認
- [x] ApplySavedRulesOnPageLoadUseCaseでのEnhancedHtmlReplacer統合
- [ ] 動的レンダリング完了検知の調査と実装（代替案1）
- [ ] タイミング遅延アプローチの調査と実装（代替案2）
- [ ] 選定したアプローチでHtmlReplacerを改修
- [ ] 問題のあったサイトでの動作確認とテスト
- [ ] リグレッションテストの実行
- [ ] パフォーマンス最適化（スコープ制限、キャッシング）
- [ ] ドキュメント更新、AI指示改善
- [ ] ネットワーク接続に依存するE2Eテストの安定化（外部サイトアクセス関連）
- [ ] 正規表現置換のE2Eテスト失敗（4テスト）
- [ ] 正規表現キャプチャグループの統合動作確認
- [ ] E2Eテストで失敗している正規表現置換機能の詳細調査と修正（一部のテストでタイムアウトが発生）

# ISSUEを通した相談事
<!-- 相談したいこと、質問したいこと、レビューしてほしいこと -->
<!-- について、体言止めでの相談ではなににどう答えればよいのか明確にならないので使わないでください-->
<!-- 相談は具体的な内容を記載してください。 -->
<!-- 質問は不明点を明確に記載してください。 -->
<!-- レビューしてほしいことは、レビュー対象を具体的に記載してください。 -->
<!-- また上記相談・質問・レビューのトピックが重複する場合は、まとめて記載してください。 -->

# 残タスク
<!-- issueの進捗に応じて記入 -->

# 本issueの対象外とする課題
<!-- issueの進捗に応じて記入 -->
- 外部サイト（agilemanifesto.org, Chrome Web Store）への接続エラーの修正（インフラ・ネットワーク問題）