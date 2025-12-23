/**
 * ルールの有効/無効切り替えエラーの出力データ
 */
export class ToggleRuleActiveErrorData {
  public readonly message: string;

  constructor(
    public readonly ruleId: number,
    error: unknown
  ) {
    this.message = error instanceof Error ? error.message : String(error);
  }
}
