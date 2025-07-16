# DAILY SCRUM-01回目

## 1. 本日の目標
`HtmlReplacer.test.ts`で失敗しているテストを修正し、キャラクターテストを安定させる。

## 2. タスク
- [x] `HtmlReplacer.test.ts`のテストケースを拡充した。
- [x] `HtmlReplacer`の正常系テストケースを記述する。
  - `div`タグの置換
  - `p`タグの置換
- [x] `HtmlReplacer`のテーブル関連要素のテストケースを記述する。
  - `tr`タグの置換
  - `td`タグの置換
- [x] `HtmlReplacer`の異常系テストケースを記述する。
  - 置換対象が見つからない場合
  - `oldString`が不正なHTMLの場合
- [x] `HtmlReplacer > table elements > should replace a td element` で失敗しているテストを修正する。
  - `HtmlReplacer.ts`のテーブル要素の処理ロジックをデバッグ・修正する。
- [x] 全てのキャラクターテストがパスすることを確認する。
- [x] 既存のtestCases配列形式に新しいテストケースを統合する。
- [x] 重複するテストケースを統廃合し、17個から12個に最適化する。

## 3. 懸念事項
- `DOMParser`で生成したDOMと、`jsdom`上のDOMの構造の差異により、`isEqualNode`や`outerHTML`での比較が失敗している可能性がある。`cleanNode`関数の見直しが必要かもしれない。

## 4. 昨日からの変更点
- `PLAN.md`のタスク内容を、既存テストの拡充であることが明確になるように修正した。
- `HtmlReplacer.test.ts`を拡充し、テストを実行したが、1件失敗している。
