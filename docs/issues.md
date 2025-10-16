
# 0.1.1
- [x] アプリ名、リポジトリ名変更
- [ ] デモ画像の追加
- [x] 開発者アカウントの登録
- [x] ソース内機密情報の取捨選択
- [ ] Chrome Web Storeへの実際の登録作業
- [ ] アイコン画像の準備（各サイズ: 16x16, 48x48, 128x128）
- [ ] Chrome Web Store用のスクリーンショット・プロモーション画像の準備
- [ ] ビルド・パッケージング手順の確認

# 0.1.2
- [ ] tsr,knipの設定で、使われていない変数、メソッドは表示だけで削除にしない
- [x] 開発環境のセットアップ方法
- [ ] storageの入出力をRewriteRuleParams経由に変更するか検討
- [ ] 編集後のタブリロード
- [ ] RewriteRuleオブジェクトを全部setしない

# 0.1.3
- [ ] makeコマンド
- [ ] コーディング規約ドキュメントまとめ

# 0.2.0
- [ ] 書き換えルールの削除機能

# 1.0.0
- [ ] ルールの有効/無効切り替え機能
- [ ] await chrome.storage.local.remove('selectedPageText'); をインフラ層に移動

## phase02
- [ ] ドキュメント中のアプリルートに、アプリ名を含まない
- [ ] e2eテストのローカル化
- [ ] edit/app.tsxのloadingをatomsに移動
- [ ] edit/app.tsxのuseEffectの整理
- [ ] e2eテストのエラー修正を部品化
- [ ] RewriteRuleのfromParamsファクトリメソッドの導入
- [ ] モックの切り出し
- [ ] フロントエンドコンポーネントのフロントエンドテスト
- [ ] urlPatternの空文字、null、undefinedのバリデーション
- [ ] urlPatternの値オブジェクト化
- [ ] 編集ページはポップアップとしても使えるようにする
- [ ] `container.ts`への`SaveRewriteRuleAndApplyToCurrentTabUseCase`登録
- [ ] UseCaseレベルでのテスト作成
- [ ] HandleContextMenuReplaceDomElemenのテストコード
- [ ] registerTabsOnUpdatedの'complete'ハードコード解消
- [ ] 不正な正規表現入力のエラーハンドリング
- [ ] rewriteRules.toArray().forEachの書き方をファーストクラスコレクションに移管
- [ ] HtmlReplacerのメンバ変数化
- [ ] application層からinfrastructureの実装をしているのを解消
- [ ] importをアルファベット順にソートするnpm
- [ ] createMessageRouterの堅牢化
- [ ] '@'記法をsrcに変更、設定廃止
- [ ] issue-012: 右クリック入力のe2eテスト
- [ ] ElementSelectorの返り値をValueObjectに変更
- [ ] no-consoleも無視しない
- [ ] SelectionServiceのテストケース追加
  - [ ] hasValidSelectionのテストと、ElementSelector.test.tsの重複削除
- [ ] mockSelectionServiceが変更可能なのは大丈夫か確認
- [ ] バリデーション
- [ ] 選択されたテキストが複数のHTML要素にまたがる場合の処理方針について
- [ ] 右クリック入力のロジック分離
- [ ] ElementSelectorの詳細テスト追加
- [ ] --project tsconfig.tsr.json の統一
- [ ] ElementSelector.test.tsのテストケース分割
- [ ] isInvalidAncestor、getStartElementの切り出し
- [ ] isMultiElementSelection、findOptimalElementのif文整理