# HtmlReplacerのリファクタリング計画

## 1. 目的
`HtmlReplacer`クラスの可読性と保守性を向上させるため、`CODING_STYLE.md`のオブジェクト指向ルールに従ってリファクタリングを行う。

## 2. 現状の問題点
- `replace`メソッドに複数の責務が集中している（タグ名抽出、DOM変換、ノードクリーンアップ、ノード比較、置換処理）。
- ネストが深く、`if-else`による条件分岐が複雑で読みにくい。
- プリミティブ型（特に`string`）が多用されており、関連するロジックが分散している。

## 3. リファクタリング方針
- **関心の分離**: 各責務を小さなクラスに分割する。
- **値オブジェクトの導入**: プリミティブ型をラップし、関連する振る舞いをカプセル化する。
- **ポリモーフィズムの活用**: `if-else`や`switch`を、Strategyパターンなどを用いて排除する。
- **テスト駆動**: 既存の振る舞いを維持しつつ、安全にリファクタリングを進めるためにテストを整備する。

## 4. タスク一覧

### Step 1: 準備とキャラクターテストの作成
- [ ] `HtmlReplacer.ts`の既存の振る舞いをカバーする単体テスト（キャラクターテスト）を作成する。
    - `favorite-keyword-link-frog/host-frontend-root/frontend-src-root/src/domain/entities/__tests__/HtmlReplacer.spec.ts` を作成・編集する。

### Step 2: 値オブジェクトの導入
- [ ] `HtmlString.ts`: HTML文字列を扱う値オブジェクトを作成する。DOMノードへの変換ロジックも担当させる。
    - `src/domain/value-objects/HtmlString.ts`
- [ ] `TagName.ts`: タグ名を扱う値オブジェクトを作成する。
    - `src/domain/value-objects/TagName.ts`
- [ ] 上記値オブジェクトの単体テストを作成する。

### Step 3: 変換ロジックの分離 (Strategyパターン)
- [ ] HTML文字列からDOMノードへの変換ロジックを、ポリモーフィズムを用いて分離する。
    - [ ] `DomConverterStrategy.ts`: 変換戦略のインターフェースを定義する。
    - [ ] `DefaultDomConverter.ts`: 一般的な要素の変換戦略を実装する。
    - [ ] `TableDomConverter.ts`: テーブル関連要素の変換戦略を実装する。
    - [ ] `DomConverterFactory.ts`: タグ名に応じて適切な変換戦略を返すファクトリを作成する。
- [ ] 上記クラス群の単体テストを作成する。

### Step 4: HtmlReplacerのリファクタリング
- [ ] `HtmlReplacer.ts`を、新しく作成したクラスを利用するように書き換える。
    - `replace`メソッドのロジックを簡素化し、インデントを浅くする。
    - `cleanNode`のようなプライベートメソッドを、責務が適切なクラス（例：`HtmlString`や新しい`CleanedNode`クラス）に移動または削除する。
- [ ] `HtmlReplacer`の単体テストをリファクタリング後の実装に合わせて修正する。

### Step 5: 最終確認
- [ ] すべての単体テストがパスすることを確認する。
- [ ] 既存のE2Eテストを実行し、すべてパスすることを確認する。
- [ ] 不要になった古いファイルを削除する。

## 5. 成果物
- リファクタリングされたソースコード
- 追加・修正された単体テストコード
