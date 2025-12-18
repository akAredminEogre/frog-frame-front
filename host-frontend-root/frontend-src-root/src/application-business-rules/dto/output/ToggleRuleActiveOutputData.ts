/**
 * ルールの有効/無効切り替えの出力データ
 */
export class ToggleRuleActiveOutputData {
  constructor(
    public readonly ruleId: number,
    public readonly active: boolean
  ) {}
}
