# ISSUE-037 TSR設定でテストファイル無視設定の追加

## タイトル
feat: TSR設定でテストファイルからのみ参照されるクラスを削除対象にする

## 概要と理由
TSRでテストファイルからのみ参照されるクラスを削除対象にするため、tsconfig.tsr.jsonの設定を修正しました。
以前の設定では、entrypoints配下のファイル（background.ts、content.ts、popup/main.tsx、popup/App.tsx）が除外対象に含まれており、これらのファイルからのみ参照されるクラスは削除されていませんでした。
この設定を削除することで、プロダクションコードで使われていないが、テストコードのみから参照されているクラスをTSRの削除対象とします。

## 主な変更点

### tsconfig.tsr.json
- excludeセクションから以下の除外設定を削除：
  - `entrypoints/background.ts`
  - `entrypoints/content.ts`
  - `entrypoints/popup/main.tsx`
  - `entrypoints/popup/App.tsx`
- インデントを統一（スペース2個）

### knip.json
- `ignoreExportsUsedInFile` を `true` から `false` に変更
- `workspaces` 構造から `entry` と `project` の直接指定に変更
- ファイルパターンに `!` 記号を追加（強制対象指定）
- 設定構造の簡素化

### package.json
- `test` スクリプトを `vitest` から `vitest --run` に変更（ワンショット実行）
- 新しいスクリプトの追加：
  - `test:all`: ユニットテストとE2Eテストを順次実行
  - `knip:all`: knipの全チェック項目を実行
  - `knip:fix`: knipで自動修正を実行
  - `unused:remove-broken-tests`: 壊れたテストファイルを自動削除
  - `unused:complete`: 完全な未使用コード削除フロー
  - `unused:safe`: テスト込みの安全な未使用コード削除フロー
- `tsr:check`, `tsr:write` の対象を `src/` から `entrypoints/` に変更
- `unused:fix` でセミコロン区切りによる連続実行に変更

## テスト方法
1. 下記コマンドを実行して、テストファイルからのみ参照されるクラスが削除されること、既存テストが問題なくパスすることを確認
```bash
cd host-frontend-root/frontend-src-root
npm run unused:safe
```


## 補足
- TypeScript Remove Unused（TSR）ツールの設定変更のため、既存のプロダクションコードには影響しません
- テストファイル（*.test.ts, *.spec.ts等）は引き続き除外対象として設定されています
