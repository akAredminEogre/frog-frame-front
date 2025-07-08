# Issueの計画

<!-- Issueの計画を立てます。ユーザーストーリーに分解し、一つ一つにタスクを洗い出します。-->

## Story-1: 開発者として、保守性の高いコードベースを維持するために、`replaceInNode`のロジックをドメイン層に分離する（過渡期対応）

`replaceInNode`関数は、ビジネスロジックとDOM操作が混在しており、テスト容易性や保守性に課題があります。`CODING_STYLE.md`で推奨されるアーキテクチャへの移行の第一歩として、`domain`層を導入し、関心の分離を図ります。

ユーザーの要望に基づき、既存のディレクトリ構造への影響を最小限に抑えるため、`frontend-src-root`ディレクトリ内に新しい`src`ディレクトリを作成し、そこに`domain`層を配置します。`wxt.config.ts`を調整することで、`entrypoints`は既存の場所のまま、新しい`domain`層を`src`から読み込むように設定します。

### タスク

- [ ] `host-frontend-root/frontend-src-root`配下に`src`ディレクトリを新規作成する
- [ ] `wxt.config.ts`を更新し、`srcDir: 'src'`と`entrypointsDir: 'entrypoints'`を設定する
- [ ] `src`配下に`domain/entities`と`domain/entities/__tests__`ディレクトリを作成する
- [ ] HTMLコンテンツの比較ロジックを扱う`HtmlContent`ドメインオブジェクトを`src/domain/entities/HtmlContent.ts`に作成する
- [ ] `HtmlContent`のユニットテストを`src/domain/entities/__tests__/HtmlContent.test.ts`に作成する
- [ ] テキストの置換ロジックを扱う`TextReplacer`ドメインオブジェクトを`src/domain/entities/TextReplacer.ts`に作成する
- [ ] `TextReplacer`のユニットテストを`src/domain/entities/__tests__/TextReplacer.test.ts`に作成する
- [ ] `frontend-src-root/utils/domUtils.ts`の`replaceInNode`関数をリファクタリングし、新しく作成したドメインオブジェクトを利用するように変更する
- [ ] `frontend-src-root/utils/__tests__/domUtils.test.ts`を更新し、リファクタリング後の`replaceInNode`が正しく動作することを確認する
