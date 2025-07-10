# Issueの計画

<!-- Issueの計画を立てます。ユーザーストーリーに分解し、一つ一つにタスクを洗い出します。-->

## Story-1: 開発者として、保守性の高いコードベースを維持するために、`replaceInNode`のロジックをドメイン層に分離する（過渡期対応）

`replaceInNode`関数は、ビジネスロジックとDOM操作が混在しており、テスト容易性や保守性に課題があります。`CODING_STYLE.md`で推奨されるアーキテクチャへの移行の第一歩として、`domain`層を導入し、関心の分離を図ります。

ユーザーの要望に基づき、既存のディレクトリ構造への影響を最小限に抑えるため、`frontend-src-root`ディレクトリ内に新しい`src`ディレクトリを作成し、そこに`domain`層を配置します。`wxt.config.ts`を調整することで、`entrypoints`は既存の場所のまま、新しい`domain`層を`src`から読み込むように設定します。

### タスク

- [x] `host-frontend-root/frontend-src-root`配下に`src`ディレクトリを新規作成する
- [x] `wxt.config.ts`を更新し、`srcDir: 'src'`と`entrypointsDir: 'entrypoints'`を設定する
- [x] `src`配下に`domain/entities`と`domain/entities/__tests__`ディレクトリを作成する
- [x] 書き換えルールを扱う`RewriteRule`エンティティを`src/domain/entities/RewriteRule.ts`に作成する
- [x] テキスト置換ロジックを扱う`NodeTextReplacer`ドメインサービスを`src/domain/entities/NodeTextReplacer.ts`に作成する
- [x] `NodeTextReplacer`のユニットテストを`src/domain/entities/__tests__/NodeTextReplacer.test.ts`に作成し、全テストが通ることを確認する
- [x] `entrypoints/content.ts`で新しい`NodeTextReplacer`サービスを利用するように修正する
- [x] 不要になった`utils/domUtils.ts`およびそのテストファイルを削除する
- [x] 単体テストの失敗問題を修正し、全てのテストが通るようにする
- [x] e2eテストの失敗問題を修正し、全てのテストが通るようにする
