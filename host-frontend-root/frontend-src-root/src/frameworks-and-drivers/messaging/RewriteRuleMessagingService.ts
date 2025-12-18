import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { IRewriteRuleMessagingPort } from 'src/interface-adapters/ports/IRewriteRuleMessagingPort';

/**
 * Chrome Runtime APIを使用したRewriteRuleメッセージングサービス（スケルトン実装）
 */
export class RewriteRuleMessagingService implements IRewriteRuleMessagingPort {
  /**
   * IDでルールを取得する
   * @param id ルールID
   * @returns RewriteRuleエンティティ、または見つからない場合はnull
   */
  async getById(id: number): Promise<RewriteRule | null> {
    throw new Error(`Not implemented: getById with id=${id}`);
  }

  /**
   * ルールの有効状態を更新する
   * @param id ルールID
   * @param active 新しい有効状態
   */
  async updateActive(id: number, active: boolean): Promise<void> {
    throw new Error(`Not implemented: updateActive with id=${id}, active=${active}`);
  }
}
