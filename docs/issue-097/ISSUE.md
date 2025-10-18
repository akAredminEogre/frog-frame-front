# 概要
<!-- このチケットで解決したい課題 -->
現在chrome.storage.localを使用しているが、IndexedDBに移行する。ラッパーにはDexie.jsを使用する。

**背景**:
- 現在の実装: `ChromeStorageRewriteRuleRepository`と`SelectedPageTextService`がchrome.storage.localを使用
- 課題: chrome.storage.localは容量制限があり、将来的なスケーラビリティに課題がある
- 解決策: IndexedDBに移行することで、より大きなデータ容量と高速なクエリ機能を活用できる

## 関連リンク
- [Dexie.js公式ドキュメント](https://dexie.org/)
- [Chrome Extensions: Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)

# 受け入れ条件
<!-- チケットをクローズできる条件を状態として表現する -->
- [ ] Dexie.jsライブラリがプロジェクトにインストールされている
- [ ] IndexedDBスキーマが定義されている（RewriteRulesテーブル、SelectedPageTextテーブル）
- [ ] `DexieRewriteRuleRepository`が実装され、`IRewriteRuleRepository`インターフェースを実装している
- [ ] `DexieSelectedPageTextService`が実装され、`ISelectedPageTextService`インターフェースを実装している
- [ ] 既存のchrome.storage.localデータをIndexedDBに移行するマイグレーション機能が実装されている
- [ ] DIコンテナの登録が新しい実装に更新されている
- [ ] 既存のすべてのテストが新しい実装でパスする
- [ ] 新しいDexie実装のユニットテストが追加されている
- [ ] E2Eテストがパスする
- [ ] `make test-and-lint`がパスする

# 心配事
<!-- チケットを進めるうえでハードルとなりそうな懸念点を列挙します -->
- Dexie.jsとTypeScriptの型定義の互換性
- 既存データのマイグレーション戦略（既存ユーザーのデータを失わない）
- IndexedDBの非同期操作がChrome拡張機能のライフサイクルと適合するか
- テストでのIndexedDBのモック方法
- Chrome拡張機能のコンテキスト（background, content script, popup）でのIndexedDBアクセス

# 制限事項
<!-- チケットを進めるうえでの制限事項を列挙します -->
- Clean Architectureの原則を維持する（domain層への依存を避ける）
- すべてのインポートは絶対パス（`src/`から開始）を使用する
- ThoughtWorks Anthology 9つのルールを遵守する
- Infrastructure層のみがIndexedDB/Dexie.jsに依存できる
- 既存のインターフェース（`IRewriteRuleRepository`, `ISelectedPageTextService`）を変更しない
- WXTフレームワークの制約に従う
- すべてのテストは`tests/`ディレクトリ以下で`src/`の構造を反映する

# タスク
<!-- チケットの見積もりを行うために、必要なタスクを列挙します -->
1. Dexie.jsライブラリのインストールと型定義の追加
2. IndexedDBデータベーススキーマの設計と実装
3. `DexieRewriteRuleRepository`の実装
4. `DexieSelectedPageTextService`の実装
5. データマイグレーション機能の実装（chrome.storage → IndexedDB）
6. DIコンテナの更新
7. ユニットテストの作成（Dexie実装用）
8. 既存テストの更新・確認
9. E2Eテストの実行・確認
10. 最終検証（`make test-and-lint`）