# ISSUE-033 PULL REQUEST

## タイトル
ISSUE-033 リファクタリング: 不要なマッチカウントの削除

## 概要と理由
開発者として不要なmatchCountを削除することでコードをシンプルに保つため、HtmlReplacerクラスのreplace()メソッドが返すmatchCountが不要になっているため、戻り値をvoidに変更してコードを簡潔にしました。関連するクラスも含めて一貫してリファクタリングを行いました。

## 主な変更点
- HtmlReplacer.replace()メソッドの戻り値をvoidに変更
- TextReplacer.replace()メソッドの戻り値をvoidに変更し、カウント処理を削除
- NodeTextReplacer.replace()メソッドの戻り値をvoidに変更
- HtmlContent.tsのReplaceResult.matchCountを削除し、処理を簡素化
- 全テストファイルから戻り値関連のアサーションを削除
- JavaScriptのString.prototype.replace()の特性を活用し、HtmlContentのコードを大幅に簡素化
- エンティティクラス4つとテストファイル4つを体系的に修正し、一貫性を確保
- 不要なコードの削除により、保守性の向上を実現

## テスト方法
- 全てのテストが通過することを確認済みです。

## 補足
- 計画については `favorite-keyword-link-frog/docs/issue-033/PLAN.md` を参照してください。
- 振り返りについては `favorite-keyword-link-frog/docs/issue-033/RETROSPECTIVE.md` を参照してください。
- 日々のスクラム記録は `favorite-keyword-link-frog/docs/issue-033/daily-scrum-00/` および `favorite-keyword-link-frog/docs/issue-033/daily-scrum-01/` にあります。
