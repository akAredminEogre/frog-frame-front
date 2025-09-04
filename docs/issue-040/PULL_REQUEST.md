# ISSUE-040 PULL REQUEST

## タイトル
Clean Architecture準拠のためのリファクタリング：getElementSelectionロジックの移管とドメイン層の依存関係解消

## 概要と理由
本プルリクエストは、コードベースをClean Architectureの原則にさらに準拠させるためのリファクタリングを実施します。
主な目的は以下の2点です。

1.  `content.ts`内に直接実装されていた`getElementSelection`ロジックを、責務分離の観点からApplication層の`GetElementSelectionUseCase`に移管します。
2.  Domain層の`ElementSelector`がInfrastructure層の`SelectionService`に直接依存している問題を解消し、層間の依存関係を正します。

これらの変更により、コードの保守性、テスト容易性、および全体的なアーキテクチャの健全性が向上します。

## 主な変更点
- `GetElementSelectionUseCase`クラスを新規作成し、要素選択ロジックを移管
- `content.ts`から`getElementSelectionInfo`関数を削除し、`GetElementSelectionUseCase`を利用するように修正
- `ElementSelector`から`SelectionService`への依存を削除
- `ElementSelector.getElementFromSelection`メソッドのAPIを変更し、`range`と`selectedText`を引数で受け取るように修正
- `GetElementSelectionUseCase`がInfrastructure層（`SelectionService`）の呼び出しを担当するように修正
- 上記変更に伴い、`ElementSelector.test.ts`の全テストケース（14件）を修正

## テスト方法
1.  `npm run build`を実行し、ビルドが正常に完了することを確認します。
2.  ブラウザで拡張機能を読み込み、テキスト選択時にキーワードリンクが正しく機能するか、実際の動作を確認します。

## 補足
特になし。
