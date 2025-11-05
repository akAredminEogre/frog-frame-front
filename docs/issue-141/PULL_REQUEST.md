# ISSUE-141 PULL REQUEST

## タイトル
feat: DOM書き換え時のスタイル・スクリプト保持機能の実装

## 概要と理由
DOM書き換え機能使用時に、サイト本来のスタイルやスクリプトが失われる問題を解決するため、DOM差分書き換えアプローチを実装しました。

**問題:**
- DOM書き換え後にスタイルやスクリプトが失われる（モーダル表示→通常リンク化、ボタンスタイル消失等）
- `innerHTML`による全体書き換えでDOMノード再作成が発生し、イベントリスナーや外部ライブラリ状態が喪失

**解決アプローチ:**
- DOM差分書き換えによる選択的更新の実装
- `EnhancedHtmlReplacer`と`DomDiffer`による責任分離設計
- 要素単位での置換によりDOM状態保持を実現

## 主な変更点

### 新規作成ファイル
- `src/domain/entities/EnhancedHtmlReplacer.ts` - DOM差分書き換えを制御するメインクラス
- `src/domain/entities/DomDiffer.ts` - DOM要素の選択的更新を実行
- `src/domain/value-objects/MatchingElements.ts` - マッチした要素群の管理
- `src/domain/entities/ElementMatchesFlexiblePattern.ts` - 要素の正規表現マッチング判定
- `src/domain/entities/ReplaceElementPreservingState.ts` - 要素置換処理の専用クラス

### 既存ファイル更新
- `src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase.ts` - `EnhancedHtmlReplacer`統合
- `src/domain/entities/RewriteRule/RewriteRule.ts` - `addHtmlWhitespaceIgnoringPattern`改善
- 各種テストファイル - 包括的なテストカバレッジ実装

### 実装の特徴
1. **DOM差分書き換え**: 全体置換ではなく、一致要素のみを選択的に更新
2. **状態保持**: イベントリスナー、フォーム状態、外部ライブラリ状態を維持
3. **正規表現対応**: 改行・スペース正規化による堅牢なパターンマッチング
4. **テスト駆動開発**: 237項目のユニットテストによる品質保証

### レビュー対応による品質改善
- **PROGRESS-04-15**: `tempContainer`変数名改善、`ReplaceElementPreservingState`クラス分離
- **PROGRESS-04-16**: 冗長処理削除、`createRedundantPattern`直接使用
- **PROGRESS-04-17**: 究極的簡素化、4行実装への最適化

## テスト方法
[動作確認の手順]
- `make testcheck` で回帰テスト通過を確認
  - 既存自動テストとlinterを同時に確認
- ユニットテスト: 237項目すべて通過
- E2Eテスト: 主要機能の動作確認済み（一部外部URL制限関連は除く）
- コンパイル・Lint・未使用コード検出をクリア

## 補足
[追加の文脈や注意点]


### パフォーマンス考慮
- DOM要素の選択的更新により処理効率化
- 正規化処理の最適化
- 不要な分岐・例外処理の削除

## 本スコープの対象外となったタスク

これらのタスクは、DOM差分書き換え基盤が確立された今回の実装をベースに、次期開発で順次対応予定です。


<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->