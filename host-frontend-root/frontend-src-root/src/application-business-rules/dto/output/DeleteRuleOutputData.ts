/**
 * ルール削除成功時の出力データ
 * 削除されたルールIDを保持
 */
export class DeleteRuleOutputData {
  constructor(public readonly deletedRuleId: number) {}
}
