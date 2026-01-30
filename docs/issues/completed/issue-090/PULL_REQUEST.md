# ISSUE-090 PULL REQUEST

## タイトル
feat: Claude Codeプロジェクトガイド（CLAUDE.md）の作成

## 概要と理由
Claude Codeが.clinerulesを参照しながらコーディングを進められるようにするため、プロジェクト固有のルールとガイドラインを一元管理するCLAUDE.mdファイルを作成しました。

Claude Codeのコンテキストウィンドウを有効活用し、プロジェクトの規約やワークフローを理解した上で開発を進められる環境を整備することが目的です。

## 主な変更点

### 1. CLAUDE.mdの作成
プロジェクト固有のルールとガイドラインを記載した包括的なドキュメント：
- プロジェクト概要（技術スタック、アーキテクチャ）
- 開発コマンド（初期セットアップ、開発サーバー起動、テスト実行）
- アーキテクチャ概要（クリーンアーキテクチャ + DDD、各層の責務）
- インポートパスルール（絶対パス使用の強制）
- オブジェクト指向設計ルール（ThoughtWorksアンソロジーの9原則）
- テスト要件（構造、粒度、実装原則）
- WXTフレームワーク固有の情報
- Gitワークフロー（ブランチ戦略、コミット規約、PR作成手順）
- トラブルシューティング
- **.clinerulesへの参照方法を明記**（詳細ルールへのアクセス方法）

### 2. Makefileの更新
開発効率向上のため、よく使うコマンドをMakeターゲットとして追加：
- `make test-and-check` - テストを実行（警告あり、E2E失敗時即座終了）
- `make test-and-lint` - 包括的なテストとリント（PR前必須）
- `make down` - Dockerコンテナを停止
- `make ps` - 実行中のコンテナを一覧表示

### 3. README.mdの更新
- 利用可能なコマンド一覧に新しいmakeコマンドを追加
- test-and-lintの実行方法を`make test-and-lint`に統一

### 4. .clinerulesの更新
以下のファイルでdockerコマンドをmakeコマンドに統一：
- `.clinerules/05-project-specific-rules.md`
- `.clinerules/02-workflow-automation/02-daily-scrum-starts/test-and-check-before-complete.md`
- `.clinerules/02-workflow-automation/01-issue-launches/workflow:see-discussion-then-start-daily-issue.md`
- `.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow:daily-scrum-pass-review.md`

### 5. package.jsonの更新
`test-and-check`スクリプトの動作変更：
- 単体テストまたはE2Eテストが失敗した時点でexit 1で即座終了
- knip、tsr、lintは警告として表示するが失敗しても継続

### 6. その他
- `.gitignore`に`.claude/settings.local.json`を追加
- `.claude/settings.local.json`を作成（個人用の設定ファイル、編集自動承認設定）
- `docs/issue-000/PULL_REQUEST.md`テンプレートを`make test-and-lint`に更新

## テスト方法
- `make test-and-check` で回帰テスト通過を確認
  - 既存自動テストを実行し、すべて正常に完了
- CLAUDE.mdを参照してClaude Codeがタスクを実行できることを動作確認
  - makeコマンドの追加、.clinerulesの更新、package.jsonの修正等を指示し、正常に実行できることを確認

## 補足
- CLAUDE.mdは今後のプロジェクト進行で必要に応じて調整・拡張する予定
- .clinerulesとの役割分担：
  - CLAUDE.md：プロジェクト全体の概要とよく使う情報
  - .clinerules：詳細なワークフロー、コーディング規約、テスト規約
- Claude Codeに日本語で指示でき、日本語で回答を得られることを確認

## 本スコープの対象外となったタスク
なし（PLAN.mdのすべてのタスクを完了）

<!-- ユーザーが使うコマンド workflow:submit-pull-request -->
