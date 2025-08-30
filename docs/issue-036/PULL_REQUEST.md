# ISSUE-036 PULL REQUEST

## タイトル
NodeTextReplacerクラスのリファクタリング - 不要な条件分岐と素通しクラスの除去

## 概要と理由
NodeTextReplacerクラス内の`replacementValue.isHtml()`による条件分岐が不要であることが判明したため、この分岐を削除し、常に`HtmlReplacer`を使用するようにリファクタリングを実施しました。さらに、NodeTextReplacerクラス自体がHtmlReplacerクラスの単純なラッパー（素通しクラス）になったため、不要な中間レイヤーを除去し、content.tsでHtmlReplacerクラスを直接使用するように変更しました。

このリファクタリングにより、コードの複雑性を減らし、保守性と可読性を向上させることができました。

## 主な変更点
- NodeTextReplacerクラス内の条件分岐ロジックを削除し、HtmlReplacerに統一
- 不要になったReplacementValueクラスとTextReplacerクラスを削除
- NodeTextReplacerクラス（素通しクラス）を削除し、HtmlReplacerを直接使用
- 削除したクラスに対応するテストファイルも合わせて削除
- content.tsでのNodeTextReplacerからHtmlReplacerへの変更

## テスト方法
リファクタリング後にユニットテストとe2eテストを実行し、既存機能に影響がないことを確認済み：
- ユニットテスト: 12テストファイル、99テスト全て成功
- e2eテスト: 5テスト全て成功

## 補足
このリファクタリングにより以下のファイルが削除されました：
- `ReplacementValue.ts`
- `TextReplacer.ts` 
- `NodeTextReplacer.ts`
- `ReplacementValue.test.ts`
- `TextReplacer.test.ts`
- `NodeTextReplacer.test.ts`

品質保証のため、リファクタリング前後でテストを実行し、全ての機能が正常に動作することを確認しています。
