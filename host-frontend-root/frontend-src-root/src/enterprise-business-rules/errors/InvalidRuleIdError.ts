/**
 * RuleId バリデーションエラー
 * `createRuleId` が `unknown` 入力を拒否したことを表す専用エラー。
 * `ImportRulesJsonErrorOutputData.fromError` の strategies Map でこの型をキーに
 * `errorType: 'validation'` へ分類するため、素の `Error` ではなく本クラスを用いる。
 * エラーメッセージ文字列は既存 `createRuleId` 仕様（`Invalid RuleId: <raw>`）を保持する。
 */
export class InvalidRuleIdError extends Error {
  constructor(raw: unknown) {
    super(`Invalid RuleId: ${String(raw)}`);
    this.name = 'InvalidRuleIdError';
  }
}
