/**
 * ルールの有効状態を更新するリクエストDTO
 */
export interface UpdateRuleActiveRequestDTO {
  action: 'updateRuleActive';
  id: number;
  active: boolean;
}
