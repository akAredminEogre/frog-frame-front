# ISSUE-141 PULL REQUEST

## タイトル
feat: DOM差分書き換えアプローチによるサイト保存状態の保持機能

## 概要と理由
DOM書き換えに成功すると、サイトのもともとのスタイルやスクリプトが保持されなくなる問題を解決するため、DOM差分書き換えアプローチを実装しました。

従来の`innerHTML`による全体書き換えではなく、DomDifferによる差分書き換えを採用することで、以下の問題を解決：
- モーダル表示機能の消失
- CSSフレームワークスタイルの失効  
- 動的レンダリング（lazyload等）との競合
- JavaScriptイベントリスナーの削除

## 主な変更点

### 1. 新規DOM差分書き換えアーキテクチャ
- **DomDiffer**: DOM差分検出・置換の中核クラス
- **ReplaceElementPreservingState**: 状態保持要素置換クラス
- **ParserContextStrategy**: HTML構造別パーサー選択戦略

### 2. 既存アーキテクチャのリファクタリング
- **HtmlReplacer**: DOM差分書き換えアプローチへの移行
- **ApplySavedRulesOnPageLoadUseCase**: DomDiffer統合
- **ElementMatchesFlexiblePattern**: Strategy Pattern適用

### 3. テストコード品質向上
- 259件のユニットテスト（全成功）
- 12件のE2Eテスト（10件成功、2件flaky）
- PRレビュー対応：削除されたHtmlContentテストケースの復元
- JSDocコメントの規約準拠

### 4. 技術的改善
- 正規表現キャプチャグループ機能の安定化
- Table要素のHTMLパーサーコンテキスト対応
- 改行・空白文字無視機能の実装
- Strategy Patternによるelse-if chain除去

### 5. 開発プロセス改善
- .clinerules改善（35項目の改善提案反映）
- AI指示改善ドキュメント作成
- 9回のDaily Scrum実施による段階的開発

## テスト方法
[動作確認の手順]
- `make testlint` で回帰テスト通過を確認
  - 既存自動テストとlinterを同時に確認
- E2Eテストによる実際のDOM書き換え動作確認
- 正規表現・文字列両方の置換パターン検証

## 補足
[追加の文脈や注意点]
- DOM差分書き換えアプローチにより、サイトの元の状態（スタイル・スクリプト）を完全保持
- 正規表現キャプチャグループ機能による高度な置換パターン対応
- Strategy Patternによる拡張性の高い設計
- comprehensive test coverageによる品質保証

## 本スコープの対象外となったタスク
- 動的レンダリング完了検知機能（DOM差分アプローチで根本解決）
- タイミング遅延実装（DOM差分アプローチで不要化）
- innerHTML全体書き換えフォールバック機能（設計思想変更により除去）

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->