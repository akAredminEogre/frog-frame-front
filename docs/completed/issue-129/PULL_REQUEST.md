# ISSUE-129 PULL REQUEST

## タイトル
SelectionServiceのClean Architectureリファクタリング - 依存性逆転の実現

## 概要と理由
SelectionServiceをClean Architectureの依存性逆転原則に従ってリファクタリングしました。Infrastructure層のSelectionServiceがApplication層のインターフェースに依存するよう変更し、より保守性の高いアーキテクチャを実現しました。

**背景:**
- 既存のSelectionServiceがClean Architectureの原則に反していた
- Infrastructure層が具象クラスとして直接使用されており、テストが困難
- 依存関係の方向がClean Architectureの原則に反していた

## 主な変更点

### 新規作成ファイル
- `src/application/ports/IGetSelectionService.ts` - Application層のインターフェース定義
- `src/infrastructure/windows/getSelectionService.ts` - Infrastructure層の具象実装
- `docs/diagrams/GetElementSelectionUseCase-sequence.puml` - 完全なアーキテクチャシーケンス図

### 修正ファイル
- `src/application/usecases/selection/GetElementSelectionUseCase.ts` - DI利用への変更
- `src/infrastructure/di/container.ts` - 新インターフェースのDI設定
- `tests/unit/infrastructure/di/container/interface-registration-completeness.test.ts` - テスト更新

### 削除ファイル
- `src/infrastructure/selection/SelectionService.ts` - 旧実装削除
- `src/infrastructure/selection/` - 空ディレクトリ削除

### アーキテクチャ改善
- **依存性逆転**: Infrastructure → Application層インターフェース依存に変更
- **DIコンテナ活用**: tsyringeによる適切な依存注入設定
- **テスト容易性向上**: インターフェースベースの実装でモック化が容易に
- **Clean Architecture準拠**: 層間の依存関係が正しい方向に修正

### ドキュメント整備
- **シーケンス図作成**: GetElementSelectionUseCaseの完全なフロー可視化
- **技術制約説明**: Chrome拡張機能のDOM API制約とメッセージング必要性を明文化
- **命名規則ガイドライン**: Infrastructure層の適切な命名パターン策定

## テスト方法
[動作確認の手順]
- `make testcheck` で回帰テスト通過を確認
  - 既存自動テストとlinterを同時に確認
- 右クリックメニューからのテキスト選択機能の動作確認
- ポップアップでの選択テキスト表示機能の動作確認

## 補足
[追加の文脈や注意点]

### Chrome拡張機能の技術制約について
本リファクタリングでは、Chrome拡張機能特有の技術制約を詳細に調査・文書化しました：
- `window.getSelection()` DOM APIはcontent scriptコンテキストでのみ実行可能
- background scriptはWebページのDOMに直接アクセス不可
- そのためmessage passingによるcontent scriptへの処理委譲が必要

### Clean Architecture命名規則の策定
Infrastructure層のクラス命名について調査・ガイドライン化：
- **Service接尾辞**: 外部システム・APIとの相互作用 (ChromeTabsService等)
- **Repository接尾辞**: データ永続化・ストレージ操作 (SelectedPageTextRepository等)

### シーケンス図による可視化
GetElementSelectionUseCaseの完全なフローをPlantUMLで文書化し、アーキテクチャ理解を促進。

## 本スコープの対象外となったタスク
なし

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->