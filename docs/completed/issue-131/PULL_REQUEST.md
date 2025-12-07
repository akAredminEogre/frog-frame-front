# ISSUE-131 PULL REQUEST

## タイトル
feat: ブランチ名からの採番をシェル化

## 概要と理由
ブランチ名からissue番号を取得する処理を効率化・統一化するため、専用のシェルスクリプトを作成し、.clinerules内のワークフローで利用できるように整備しました。

従来は各ワークフローで個別に「カレントブランチ名からissue番号を取得」という指示を記述していましたが、これをシェルスクリプト実行に統一することで、採番処理の一貫性と保守性を向上させました。

## 主な変更点
1. **シェルスクリプトの作成**
   - `scripts/.clinerules/get-issue-number.sh`を新規作成
   - ブランチ名（例：`issue-131-feat-numbering-shell`）から番号部分（`131`）を抽出
   - エラーハンドリング機能付き

2. **.clinerulesワークフローの更新**
   - 19個のワークフローファイルで採番指示を統一
   - 変更前: `nnn=(カレントブランチ名からissue番号を取得)`
   - 変更後: `nnn=$(scripts/.clinerules/get-issue-number.sh)`

## テスト方法
[動作確認の手順]
- シェルスクリプトの動作確認
  ```bash
  scripts/.clinerules/get-issue-number.sh
  # 期待結果: 131
  ```
- `make testcheck` で回帰テスト通過を確認
  - 既存自動テストとlinterを同時に確認

## 補足
- スクリプトは実行権限付きで配置
- レビューコメントに基づき、適切な配置場所（`scripts/.clinerules/`）に移動済み
- 全てのワークフローファイルで新しい採番方式が適用されているため、今後の一貫性が保たれます

## 本スコープの対象外となったタスク
特になし（計画した全てのタスクが完了）

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->