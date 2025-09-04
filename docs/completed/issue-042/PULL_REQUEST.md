# ISSUE-042 PULL REQUEST

## タイトル
background.tsをクリーンアーキテクチャに準拠した構造にリファクタリング右クリック処理をクリーンアーキテクチャに準拠した構造にリファクタリング

## 概要と理由
background.tsに含まれていた複雑なコンテキストメニュー処理のビジネスロジックをapplication層に移管し、クリーンアーキテクチャに準拠した設計に改善しました。また、コールバック地獄を解消してasync/awaitパターンを採用することで、コードの可読性と保守性を向上させました。

## 主な変更点
- `HandleContextMenuReplaceDomElement` クラスを新規作成し、コンテキストメニューのビジネスロジックをapplication層に分離
- background.tsからコンテキストメニューの複雑なロジックを削除し、UseCaseクラスを呼び出すよう変更
- コールバックベースの非同期処理をasync/awaitパターンに変更してコードの可読性を改善
- Chrome拡張機能のAPIを適切にPromiseでラップしエラーハンドリングを改善

## テスト方法
1. docker compose exec frontend npm run unused:safe コマンドを実行、パスすることを確認
2. 手動テスト

## 補足
- UseCaseクラス名は `HandleContextMenuReplaceDomElement` としましたが、より適切な命名について議論の余地があります
- Chrome拡張機能のイベント処理とビジネスロジックの分離により、テスタビリティが向上しました
- エラー時のフォールバック処理も実装し、選択テキストでの代替処理を提供しています
