# 進捗

このファイルは作業の記録を残すためのものです。追記のみ行い、内容の修正や削除は行わないでください。

kk=04
実装が完了したらPROGRESS-04.mdを追記してコードレビューを依頼してください

## スクラム-04(01回目) の進捗
<!-- ここに進捗を記載 -->

Chrome Web Storeへの登録に必要なプライバシーポリシーを作成しました。

### 作成内容

- **ファイル**: frog-frame-front/PRIVACY_POLICY.md
- **言語**: 日本語・英語の両方に対応
- **内容**:
  - 情報の収集について（個人情報は収集しない）
  - データの使用目的（ローカルストレージのみ使用）
  - データの共有（第三者とは共有しない）
  - データのセキュリティ
  - ユーザーの権利
  - プライバシーポリシーの変更について
  - お問い合わせ先（GitHubリポジトリのIssues）

### 実装の特徴

本拡張機能の実際の動作に基づき、以下の点を明確にしました：

- **データ収集なし**: いかなる個人情報も収集しない
- **ローカルストレージのみ**: 書き換えルール設定はブラウザ内にのみ保存
- **外部送信なし**: 外部サーバーへのデータ送信は一切行わない

### テスト・Lint結果

```
npm run test-and-lint
✓ 9 passed (39.1s)
✂️  Excellent, Knip found no issues.
```

すべてのテストが通過し、未使用コードも検出されませんでした。

### 修正したファイル

- frog-frame-front/PRIVACY_POLICY.md（新規作成）

### 次回以降のスクラムに先送りする課題
<!-- 本issueで解決するが、本スクラムでは取り扱わない課題 -->

なし

### 本issueの対象外とする課題

なし

### スクラム-04(01回目) のレビューコメント

<!-- ここはユーザが書くので空欄にしておいてください。 -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow:see-and-commit-review-comment-then-code-again.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow:daily-scrum-pass-review.md -->

---
