/**
 * ルールの有効/無効切り替えの入力データ
 */
export class ToggleRuleActiveInputData {
  constructor(
    public readonly ruleId: number,
    public readonly active: boolean
  ) {}
}
