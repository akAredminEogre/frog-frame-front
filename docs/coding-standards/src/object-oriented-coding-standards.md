# オブジェクト指向コーディング規約

## メソッド設計

- **メソッドは必ずインスタンス変数を使うこと**
  - 除外パターン
    - infrastructure層（frameworks-and-drivers層）のコード
  - **ESLint除外**: このルールはESLintで自動チェックしない（カスタムルール実装の複雑さのため、コードレビューで確認）

## eslint-rule