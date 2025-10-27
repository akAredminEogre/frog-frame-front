# ISSUE-128 PULL REQUEST

## タイトル
右クリック選択メニューのロジック統合による重複排除

## 概要と理由
右クリック選択メニューのロジックが複数のインターフェースとクラスに散逸していたため、統合してコードの重複を排除しました。`ISelectedPageTextService`と`ISelectedPageTextRepository`が同様の機能を提供していたため、`ISelectedPageTextRepository`に統合し、不要なファイルを削除してアーキテクチャを簡素化しました。

## 主な変更点

### インターフェースとクラスの統合
- `ISelectedPageTextService`の機能を`ISelectedPageTextRepository`に統合
- `ISelectedPageTextRepository`に`setSelectedPageText(text: string): Promise<void>`メソッドを追加
- `SelectedPageTextService`の実装を`SelectedPageTextRepository`に統合

### ファイルの移動と削除
- `src/infrastructure/storage/SelectedPageTextRepository.ts`を`src/infrastructure/persistance/storage/SelectedPageTextRepository.ts`に移動
- `src/application/ports/ISelectedPageTextService.ts`を削除
- `src/infrastructure/persistance/storage/SelectedPageTextService.ts`を削除
- 空になった`src/infrastructure/storage/`ディレクトリを削除

### 依存関係の修正
- `HandleContextMenuSelectionUseCase`で`ISelectedPageTextService`から`ISelectedPageTextRepository`に変更
- DIコンテナから`ISelectedPageTextService`の登録を削除
- 関連するimport文を修正

### テストファイルの対応
- `ISelectedPageTextRepository`の新しいモックファイルを作成
- `HandleContextMenuReplaceDomElement`のテストをISelectedPageTextRepositoryに対応
- DIコンテナテストの期待インターフェース数を修正

## テスト方法
[動作確認の手順]
- `make testcheck` で回帰テスト通過を確認
  - 既存自動テストとlinterを同時に確認
- 全ユニットテスト（217テスト）が正常に通過することを確認済み
- TypeScriptコンパイルエラーがないことを確認済み
- 右クリック選択機能が正常に動作することを確認

## 補足
[追加の文脈や注意点]
- 初回作業でHandleContextMenuReplaceDomElementのテストを削除してしまったが、レビューコメントに応じて復旧し、新しいアーキテクチャに対応させました
- 段階的なアプローチにより、途中でテストが動作していることを確認しながら安全に統合作業を進めました
- DIコンテナの設定も適切に修正し、インターフェース数の整合性を保ちました

## 本スコープの対象外となったタスク
なし

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->