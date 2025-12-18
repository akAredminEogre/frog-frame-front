import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

/**
 * RewriteRuleのメッセージング操作を抽象化するポート
 */
export interface IRewriteRuleMessagingPort {
  /**
   * IDでルールを取得する
   * @param id ルールID
   * @returns RewriteRuleエンティティ、または見つからない場合はnull
   */
  getById(id: number): Promise<RewriteRule | null>;

  /**
   * ルールの有効状態を更新する
   * @param id ルールID
   * @param active 新しい有効状態
   */
  updateActive(id: number, active: boolean): Promise<void>;
}
