/**
 * ルール削除Controllerのインターフェース
 */
export interface IDeleteRuleController {
  deleteRule(ruleId: number): Promise<void>;
}
