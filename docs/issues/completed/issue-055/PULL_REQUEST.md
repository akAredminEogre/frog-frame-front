# ISSUE-055 PULL REQUEST

## タイトル
refactor: StorageChanged関連の不要なコードを廃止

## 概要と理由
ストレージ変更に関連する不要なコードの削除を行いました。`registerStorageOnChanged`および`HandleStorageChangedUseCase`が実際には使用されていないか、他の方法で代替されているため、コードベースのシンプル化とメンテナンス性向上を目的として削除しました。

## 主な変更点
- `registerStorageOnChanged`の廃止
- `HandleStorageChangedUseCase`の廃止
- 関連するDIコンテナからの登録削除
- 使用していないテストコードの整理

変更されたファイル：
- `host-frontend-root/frontend-src-root/entrypoints/background.ts`
- `host-frontend-root/frontend-src-root/src/application/usecases/rule/HandleStorageChangedUseCase.ts`
- `host-frontend-root/frontend-src-root/src/infrastructure/browser/listeners/storage.onChanged.ts`
- `host-frontend-root/frontend-src-root/src/infrastructure/di/container.ts`
- `host-frontend-root/frontend-src-root/tests/unit/infrastructure/di/container/concrete-class-registration-completeness.test.ts`

## テスト方法
[動作確認の手順]
- `docker compose exec frontend npm run test-and-lint` で回帰テスト通過・未使用コードがないことを確認
  - 既存自動テストとlinterを同時に確認

## 補足
このリファクタリングにより、コードベースから不要な依存関係が除去され、メンテナンス性が向上しました。複数ファイルにまたがる変更でしたが、依存関係を適切に処理して安全に削除を実行しました。

## 本スコープの対象外となったタスク
特になし

<!-- ユーザーが使うコマンド workflow:submit-pull-request -->
