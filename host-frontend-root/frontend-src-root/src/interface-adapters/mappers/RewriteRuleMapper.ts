import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { RewriteRuleDTO } from 'src/frameworks-and-drivers/messaging/dto/RewriteRuleDTO';
import { IRewriteRuleMessagingPort } from 'src/interface-adapters/ports/IRewriteRuleMessagingPort';

/**
 * RewriteRuleエンティティとDTO間の変換を行うMapper
 * ADR-002, ADR-003に準拠し、IRewriteRuleMessagingPort経由で通信する
 */
export class RewriteRuleMapper {
  private readonly messagingPort: IRewriteRuleMessagingPort;

  constructor(messagingPort: IRewriteRuleMessagingPort) {
    this.messagingPort = messagingPort;
  }

  /**
   * すべてのルールを取得する
   * IRewriteRuleMessagingPort経由でDTOを取得し、エンティティに変換
   * @returns RewriteRule配列
   */
  async getAllRules(): Promise<RewriteRule[]> {
    const dtos = await this.messagingPort.getAll();
    return dtos.map((dto) => this.toEntity(dto));
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
   * エンティティからDTOに変換する（静的メソッド）
   * @param entity RewriteRuleエンティティ
   * @returns RewriteRuleDTO
   */
  static toDto(entity: RewriteRule): RewriteRuleDTO {
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
