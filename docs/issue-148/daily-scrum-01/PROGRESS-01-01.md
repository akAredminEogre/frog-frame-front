# 進捗

このファイルは作業の記録を残すためのものです。追記のみ行い、内容の修正や削除は行わないでください。

kk=01
実装が完了したらPROGRESS-01.mdを追記してコードレビューを依頼してください
## スクラム-01(01回目) の進捗
Clean Architectureの4層構造に基づくディレクトリ構造の整備と命名規則の定義を完了しました。

### 修正したファイル

1. **src/enterprise-business-rules/** （新規作成）
   - Clean Architecture最内層のディレクトリを作成

2. **src/application-business-rules/** （新規作成）
   - アプリケーション層のディレクトリを作成

3. **src/interface-adapters/** （新規作成）
   - インターフェースアダプター層のディレクトリを作成

4. **src/frameworks-and-drivers/** （新規作成）
   - フレームワーク＆ドライバ層のディレクトリを作成

5. **docs/design/naming-rule.md** （新規作成）
   - Clean Architecture4層における命名規則を定義
   - ディレクトリ名: ケバブケース
   - クラス名: パスカルケース
   - 変数・関数名: キャメルケース
   - 定数: アッパースネークケース

6. **host-frontend-root/frontend-src-root/eslint.config.js** （修正）
   - Clean Architecture各層の依存関係を強制するルールを追加
   - Enterprise Business Rules層は他層への依存を禁止
   - Application Business Rules層はEnterprise層のみに依存可
   - Interface Adapters層は内層のみに依存可
   - ディレクトリ名のケバブケース推奨ルールを追加

### 次回以降のスクラムに先送りする課題
なし

### 本issueの対象外とする課題
なし

### スクラム-01(01回目) のレビューコメント

<!-- ここはユーザが書くので空欄にしておいてください。 -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow-see-and-commit-review-comment-then-code-again.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow-daily-scrum-pass-review.md -->

---