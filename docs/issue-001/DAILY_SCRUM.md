# DAILY SCRUM

## 日付

2025/07/09 (1回目)

## 今日の作業予定
Story-1: 開発者として、保守性の高いコードベースを維持するために、`replaceInNode`のロジックをドメイン層に分離する（過渡期対応）

- `host-frontend-root/frontend-src-root`配下に`src`ディレクトリを新規作成する
- `wxt.config.ts`を更新し、`srcDir: 'src'`と`entrypointsDir: 'entrypoints'`を設定する
- `src`配下に`domain/entities`と`domain/entities/__tests__`ディレクトリを作成する

## 修正予定のファイル
- `favorite-keyword-link-frog/host-frontend-root/frontend-src-root/wxt.config.ts`

## 相談事項
- 特にありません。計画通りに進めます。

## 一言コメント
- まずはアーキテクチャの基盤となるディレクトリ構造の整備から始めます。着実に進めていきましょう！

## チェックリスト

以下の作業を実施したらチェックをつけてください。全てにチェックがついたらタスクを完了できます。

- [x] 作業を始める前に、ユーザとデイリースクラムを実施した
- [x] 作業完了後、PROGRESS.mdに進捗を記載し、レビューを依頼した
- [x] レビュー通過後、振り返りを実施し、RETROSPECTIVE.md, PLAN.md を更新した
