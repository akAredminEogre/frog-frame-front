/**
 * ルールの有効/無効切り替えControllerのインターフェース
 */
export interface IToggleRuleActiveController {
  toggleActive(ruleId: number): Promise<void>;
}
