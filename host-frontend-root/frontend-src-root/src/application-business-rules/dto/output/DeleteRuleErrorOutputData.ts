/**
 * ルール削除エラーの出力データ
 */
export class DeleteRuleErrorOutputData {
  public readonly message: string;

  constructor(
    public readonly ruleId: number,
    error: unknown
  ) {
    this.message = error instanceof Error ? error.message : String(error);
  }
}
