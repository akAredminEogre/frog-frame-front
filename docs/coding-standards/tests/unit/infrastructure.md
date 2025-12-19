# infrastructure層固有の規約

## 1. Infrastructure層特有のパターン
- Infrastructure層は、下記のクラスのみテストコードを作成する。
  - di
  - persistance
上記のクラスは、クラスの作成、変更時にテストコードを作成、変更する。またエラー系のテストコードは必須としない
それ以外のクラスは、必須とせず、必要に応じて作成する。