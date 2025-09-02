# ISSUE-038 PULL REQUEST

## タイトル
全ルール適用機能を新しいUseCaseクラスに分離するリファクタリング

## 概要と理由
`content.ts` 内に直接実装されていた全ルール適用のロジックを独立した `ApplySavedRulesOnPageLoadUseCase` クラスに分離しました。これにより、関心事の分離を促進し、Clean Architectureの原則に従った構造に改善しました。

## 主な変更点
- `ApplySavedRulesOnPageLoadUseCase` クラスを新規作成
  - ストレージから全ルールを取得して適用する責務を担当
  - HtmlReplacerを注入し、RewriteRuleを利用してルール適用を実行
  - Promiseベースの非同期処理でエラーハンドリングを改善
- `content.ts` のリファクタリング
  - 46行の `applyAllRules` 関数を削除
  - 新しいUseCaseクラスのインスタンスを利用する形に変更
  - メッセージハンドラでの非同期処理を適切に処理

## テスト方法
1. Chrome拡張機能をリロード
2. 任意のWebページでルールを作成・保存
3. `applyAllRules` メッセージが正常に動作することを確認
4. ページロード時の全ルール適用が従来通り機能することを確認
5. `npm run unused:safe` を実行、テスト通過とunused警告なしを確認

## 補足
このリファクタリングにより、コードの可読性と保守性が向上し、単体テストの実装が容易になりました。機能的な変更は一切なく、内部構造の改善のみを行っています。
