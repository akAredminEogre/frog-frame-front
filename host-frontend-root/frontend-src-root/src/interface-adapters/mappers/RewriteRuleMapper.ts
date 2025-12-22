import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { RewriteRuleDTO } from 'src/frameworks-and-drivers/messaging/dto/RewriteRuleDTO';
import { IRewriteRuleMessagingPort } from 'src/interface-adapters/ports/IRewriteRuleMessagingPort';

/**
 * RewriteRuleエンティティとDTO間の変換を行うMapper
 * ADR-002に従い、IRewriteRuleMessagingPort経由でメッセージング通信を行う
 */
export class RewriteRuleMapper {
  private readonly messagingPort: IRewriteRuleMessagingPort;

  constructor(messagingPort: IRewriteRuleMessagingPort) {
    this.messagingPort = messagingPort;
  }

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

  /**
   * すべてのルールを取得する
   * IRewriteRuleMessagingPort経由でBackgroundからDTOを取得し、Entityに変換
   * @returns RewriteRulesオブジェクト
   */
  async getAllRules(): Promise<RewriteRules> {
    const dtos = await this.messagingPort.getAll();
    const rulesObject: Record<string, RewriteRule> = {};

    dtos.forEach((dto) => {
      const rule = this.toEntity(dto);
      rulesObject[rule.id] = rule;
    });

    return new RewriteRules(rulesObject);
  }
}
