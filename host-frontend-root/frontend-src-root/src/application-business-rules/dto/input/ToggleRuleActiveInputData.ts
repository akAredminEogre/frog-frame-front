/**
 * ルールの有効/無効切り替えの入力データ
 * Interactorが現在の状態をRepositoryから取得して反転する
 */
export class ToggleRuleActiveInputData {
  constructor(
    public readonly ruleId: number
  ) {}
}
