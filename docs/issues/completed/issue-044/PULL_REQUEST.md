# ISSUE-044 ストレージ変更処理のApplication層移管

## タイトル
background.tsのストレージ変更処理ロジックをApplication層に移管

## 概要と理由
background.tsに直接記述されていたストレージ変更時のルール再適用処理を、クリーンアーキテクチャの原則に従ってApplication層に移管しました。これにより、presentation層（background.ts）とbusiness logic層の責務分離を明確にし、コードの可読性と保守性を向上させました。

## 主な変更点
- `HandleStorageChangedUseCase`クラスを新規作成（`src/application/usecases/rule/HandleStorageChangedUseCase.ts`）
- background.tsのインライン処理を削除し、新しいUseCaseを使用するよう変更
- ストレージ変更時のルール再適用ロジックをApplication層に適切に配置

## テスト方法
1. Chrome拡張機能をビルドして読み込む
2. 拡張機能の設定でルールを変更または保存する
3. アクティブなタブで変更が即座に反映されることを確認
4. 既存の機能が正常に動作することを確認
5. `docker compose exec frontend npm run unused:safe` が成功すること
  - 既存自動テストとlinterを同時に確認

## 補足
- 既存の機能を損なうことなくリファクタリングを実施
- 他のUseCaseクラスと同様の構造で実装し、一貫性を保持
- 今後同様のリファクタリングを他のファイルにも展開可能な基盤を構築
