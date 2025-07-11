# DAILY SCRUM-01回目

## 1. 本日の目標
`HtmlReplacer`のキャラクターテストを作成し、リファクタリングの安全な土台を築く。

## 2. タスク
- [ ] `HtmlReplacer.spec.ts`を作成する。
- [ ] `HtmlReplacer`の正常系テストケースを記述する。
  - `div`タグの置換
  - `p`タグの置換
- [ ] `HtmlReplacer`のテーブル関連要素のテストケースを記述する。
  - `tr`タグの置換
  - `td`タグの置換
- [ ] `HtmlReplacer`の異常系テストケースを記述する。
  - 置換対象が見つからない場合
  - `oldString`が不正なHTMLの場合

## 3. 懸念事項
- `jsdom`環境で、`DOMParser`や`TreeWalker`が意図通りに動作するか確認が必要。

## 4. 昨日からの変更点
- (なし)
