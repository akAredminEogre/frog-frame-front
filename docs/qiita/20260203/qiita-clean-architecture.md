# あらためてClean Architectureについて考える

〜実践して感じた「オーバーエンジニアリング」批判への反論〜

## はじめに

Clean Architectureについて、ネット上では批判的な意見をよく目にする。本記事では、実際にClean Architectureを徹底的に学習・実践した経験から、これらの批判について考察する。

## ネットでは散々な言われよう

Clean Architectureに対する典型的な批判は以下のようなものだ：

- 「全てに使えるわけではない」
- 「妥協して取捨選択して使うべき」
- 「オーバーエンジニアリングだ」

## 必死に学習して感じたこと

**要素1個1個わけると膨大に感じる。けれど実はClean Architectureを使わなくても同じことを考えている。**

Clean Architectureの各概念（Entity、Use Case、Gateway、Presenter...）は、名前がついていないだけで、どんな開発でも考慮している事項だ。

- 「このロジックはどこに書くべきか」
- 「外部APIへの依存をどう隔離するか」
- 「テストしやすい構造にするにはどうするか」

Clean Architectureは、これらに**名前と置き場所を与えているだけ**だ。

名前がつくことで、チーム内の認識が統一される。「このロジックはEntityに書いて」「GatewayでAPIを隔離して」という会話が可能になる。名前がなければ、毎回「ビジネスロジックを書くところ」「外部APIを呼び出すところ」と説明する必要がある。

## 数値化してみる価値あり

「Clean Architectureは重い」という印象は、**定量的に検証する価値がある**。

- Clean Architectureを適用した場合の総コード行数
- 適用しなかった場合の総コード行数
- テストカバレッジ、変更容易性の比較

感覚で「重い」と判断するのではなく、数値で比較すれば、意外と差がないかもしれない。

### 実際に測定してみた（参考値）

Chrome拡張機能プロジェクトで、Clean Architectureを適用した場合の構成：

```text
enterprise-business-rules/   # Entity, Value Object
application-business-rules/  # Use Case, Interactor
interface-adapters/          # Controller, Presenter
frameworks-and-drivers/      # UI, Chrome API, DB
```

各層のコード量はほぼ均等だった。「Clean Architectureは層が多くてコードが増える」という印象があるが、実際には：

- 各層の責務が明確なため、各ファイルのコード量は少ない
- 同じロジックを複数箇所に書く必要がない
- テストコードが書きやすく、結果的にテストカバレッジが向上

## AI駆動開発との相性

Clean Architectureは、AI駆動開発と相性が良い。

### 設計意図がAIに伝わる

ADR（Architecture Decision Record）と組み合わせることで、AIは「なぜこの設計なのか」を理解した上で実装できる。

「このクラスはinterface-adapters層のControllerとして実装してください」と指示すれば、AIはClean Architectureの文献に基づいて適切な実装を行う。

### レビュー負荷の軽減

クラス設計がADRに完全従属するため、AIが自動生成しても設計者のレビュー負荷は最小限だ。

「ADRに従っているか」という観点でレビューすればよく、設計判断を毎回行う必要がない。

## まとめ

Clean Architectureへの批判の多くは、「名前と構造が増えることへの抵抗」に起因している。

しかし、実際には：

- 名前がつくことで認識が統一される
- 構造が明確になることでAIとの協働がしやすくなる
- 数値で比較すれば、コード量は大きく変わらない

「オーバーエンジニアリング」という批判は、感覚的な印象に過ぎないかもしれない。実際に適用して数値で検証することを勧める。

## 参考資料

- [実践クリーンアーキテクチャ - nrslib](https://nrslib.com/clean-architecture/)
- Robert C. Martin「Clean Architecture 達人に学ぶソフトウェアの構造と設計」
- [AIで逆にうまくいく ドキュメント駆動フラクタル型ウォーターフォール個人開発](./qiita.md)（関連記事）
