# ISSUE-120 PULL REQUEST

## タイトル
refactor: package.jsonからno-sortコマンドを削除

## 概要と理由
全ファイルの一括importソート完了により、no-sortコマンド（importソートを無効化するコマンド）が不要になったため削除しました。

これにより、全てのnpmコマンドでimportソートルールが有効化され、コードの一貫性が保たれるようになります。

## 主な変更点
### package.jsonの変更:
1. **lint:no-sortコマンドを削除**
   - `"lint:no-sort": "eslint . --ext .ts,.tsx,.js,.jsx --rule 'simple-import-sort/imports: off'"` を削除

2. **lint:fix:no-sortコマンドを削除**
   - `"lint:fix:no-sort": "eslint . --ext .ts,.tsx,.js,.jsx --fix --rule 'simple-import-sort/imports: off'"` を削除

3. **unused:fixコマンドを更新**
   - 変更前: `npm run knip:fix; npm run tsr:write; npm run lint:fix:no-sort`
   - 変更後: `npm run knip:fix; npm run tsr:write; npm run lint:fix`

4. **test:checkコマンドを更新**
   - 変更前: `(npm run lint:no-sort || true)`
   - 変更後: `(npm run lint || true)`

## テスト方法
- `make testlint` で回帰テスト通過を確認
  - ✅ 267 unit tests passed
  - ✅ 12 E2E tests passed
  - ✅ Knip: no unused code remains
  - ✅ Linting: passed with import sorting enabled

## 補足
このリファクタリングは、issue-117やissue-119で実施された全ファイルのimportソート完了を前提としています。今後は、全てのlintコマンドでimportソートルールが強制され、コードの一貫性が維持されます。

## 本スコープの対象外となったタスク
なし

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->
