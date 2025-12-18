import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

/**
 * RewriteRuleエンティティとDTO間の変換を行うMapper（スケルトン実装）
 */
export class RewriteRuleMapper {
  /**
   * DTOからエンティティに変換する
   * @param dto DTOオブジェクト
   * @returns RewriteRuleエンティティ
   */
  toEntity(dto: unknown): RewriteRule {
    throw new Error(`Not implemented: toEntity with dto=${JSON.stringify(dto)}`);
  }

  /**
   * エンティティからDTOに変換する
   * @param entity RewriteRuleエンティティ
   * @returns DTOオブジェクト
   */
  toDto(entity: RewriteRule): unknown {
    throw new Error(`Not implemented: toDto with entity id=${entity.id}`);
  }
}
