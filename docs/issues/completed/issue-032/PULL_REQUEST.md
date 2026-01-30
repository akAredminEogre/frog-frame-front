# ISSUE-032 PULL REQUEST

## タイトル
issue-032: RewriteRuleクラスのfromPlainObjectメソッドの廃止とRewriteRulePlainObject型定義の削除

## 概要と理由
RewriteRuleクラスのfromPlainObjectメソッドの廃止とRewriteRulePlainObject型定義の削除作業を行いました。
これにより、factory methodパターンからより直接的なコンストラクタパターンへのリファクタリングが完了し、コードがより明確になりました。

## 主な変更点
- `frog-frame-front/host-frontend-root/frontend-src-root/src/domain/entities/RewriteRule.ts`
  - fromPlainObjectメソッドの削除
  - RewriteRulePlainObject型定義の削除
- `frog-frame-front/host-frontend-root/frontend-src-root/entrypoints/content.ts`
  - fromPlainObjectメソッド使用箇所を個別const設定に変更
  - RewriteRulePlainObjectの import を削除
- `frog-frame-front/host-frontend-root/frontend-src-root/entrypoints/popup/App.tsx`
  - RewriteRulePlainObjectの import を削除
  - useState型定義を直接的なオブジェクト型定義に変更

## テスト方法
すべてのユニットテスト（108テスト）およびE2Eテスト（4テスト）が正常に通過し、機能的な退行がないことを確認済みです。

## 補足
特になし。