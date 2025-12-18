# dtoのコード規約

## input DTO
- input DTOは、Interactorのメソッドの引数として使用
- 命名規則は「[機能名]InputData」とする
  - 例: `ToggleRuleActiveInputData`
- constructor
  - 引数はプリミティブ型 / 値オブジェクト型 とする

## output DTO
- output DTOは、Interactorのメソッドの戻り値として使用
- 命名規則は「[機能名]OutputData」とする
  - 例: `ToggleRuleActiveOutputData`
- constructor
  - エンティティ型を推奨とする
