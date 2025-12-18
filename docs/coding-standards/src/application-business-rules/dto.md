# dtoのコード規約
## input DTO
- input DTOは、アプリケーションサービスのメソッドの引数として使用
- input DTOの命名規則は「[アプリケーションサービス名]InputDto」とする
- construtor
  - 引数はプリミティブ型 / 値オブジェクト型 とする

## output DTO
- output DTOは、アプリケーションサービスのメソッドの戻り値として使用
- output DTOの命名規則は「[アプリケーションサービス名]OutputDto」とする
- construtor
  - エンティティ型を推奨とする