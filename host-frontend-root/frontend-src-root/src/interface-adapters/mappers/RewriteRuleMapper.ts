import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { RewriteRuleDTO } from 'src/frameworks-and-drivers/messaging/dto/RewriteRuleDTO';

/**
 * RewriteRuleエンティティとDTO間の変換を行うMapper
 */
export class RewriteRuleMapper {
  /**
   * DTOからエンティティに変換する
   * @param dto RewriteRuleDTO
   * @returns RewriteRuleエンティティ
   */
  toEntity(dto: RewriteRuleDTO): RewriteRule {
    return new RewriteRule(
      dto.id,
      dto.oldString,
      dto.newString,
      dto.urlPattern,
      dto.isRegex,
      dto.isActive
    );
  }

  /**
   * エンティティからDTOに変換する
   * @param entity RewriteRuleエンティティ
   * @returns RewriteRuleDTO
   */
  toDto(entity: RewriteRule): RewriteRuleDTO {
    return {
      id: entity.id,
      oldString: entity.oldString,
      newString: entity.newString,
      urlPattern: entity.urlPattern,
      isRegex: entity.isRegex,
      isActive: entity.isActive,
    };
  }
}
