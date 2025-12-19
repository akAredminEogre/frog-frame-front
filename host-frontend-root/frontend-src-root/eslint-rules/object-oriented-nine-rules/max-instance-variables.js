// Rule 7: 1つのクラスにつきインスタンス変数は2つまでにすること
// Note: ESLintの標準ルールでは完全な検出が困難なため、コードレビューでも確認が必要
// See: docs/coding-standards/src/object-oriented-nine-rules.md

export default {
  files: ['**/frameworks-and-drivers/browser/**/*.ts'],
  rules: {
    // TypeScriptのmax-classes-per-fileは別の目的
    // インスタンス変数の数を直接制限するESLintルールは存在しないため、
    // このルールはコードレビューで補完する必要がある
    // 以下は警告として設定（完全な検出は困難）
  },
};
