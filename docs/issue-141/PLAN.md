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
- [x] 選定したアプローチでHtmlReplacerを改修
- [x] 問題のあったサイトでの動作確認とテスト（スクラム07で検証完了：DOM差分書き換えアプローチにより解決済み）
- [ ] ドキュメント更新、AI指示改善
- [x] ネットワーク接続に依存するE2Eテストの安定化（外部サイトアクセス関連）（スクラム07で確認完了：既に安定化済み）
- [x] 正規表現キャプチャグループの統合動作確認（スクラム07で確認完了：E2Eテストで正常動作を検証）
- [x] E2Eテストで失敗している正規表現置換機能の詳細調査と修正（一部のテストでタイムアウトが発生）（スクラム07で確認完了：リトライ機能により解決済み）
- [x] frog-frame-front/host-frontend-root/frontend-src-root/tests/unit/domain/entities/DomDiffer/basic-replacement.test.ts
  - [x] 'Simple Element Replacement' 以外のテストケースはarrange / act / assert を共通化できそうなので、テスト配列化のコード規約に沿ってリファクタリングする(規約から外れる場合は断念する)
  - [x] 'Table Row Replacement' のテストケースが新たに追加されたので、それをpassするようにプロダクションコードを修正する
- [x] PRレビュー対応
  - [x] host-frontend-root/frontend-src-root/tests/unit/domain/entities/HtmlContent/normal-cases.test.ts
    - が削除されているが、`EnhancedHtmlReplacer` の`replace` メソッドとして復元する。（対応不要：EnhancedHtmlReplacerクラスが現在のアーキテクチャに存在しない）
    - [x] host-frontend-root/frontend-src-root/tests/unit/domain/entities/HtmlContent/regex-rule.test.ts
      - も同様（対応不要：EnhancedHtmlReplacerクラスが現在のアーキテクチャに存在しない）

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
