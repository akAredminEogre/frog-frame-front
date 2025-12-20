import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { GetByIdRequestDTO } from 'src/frameworks-and-drivers/messaging/dto/request-dto/GetByIdRequestDTO';
import { UpdateRuleActiveRequestDTO } from 'src/frameworks-and-drivers/messaging/dto/request-dto/UpdateRuleActiveRequestDTO';
import { RewriteRuleDTO } from 'src/frameworks-and-drivers/messaging/dto/RewriteRuleDTO';
import { DexieRewriteRuleRepository } from 'src/infrastructure/persistence/indexeddb/DexieRewriteRuleRepository';
import { IRewriteRuleMessagingPort } from 'src/interface-adapters/ports/IRewriteRuleMessagingPort';

/**
 * @webext-core/proxy-serviceを使用したRewriteRuleメッセージングサービス
 * Background Scriptで実行され、他のコンテキスト（Rules Page等）からのDB操作を仲介
 * ADR-002, ADR-003に従い、DTOを使用してメッセージング通信を行う
 *
 * 注意: 現在はスケルトン実装のみ。proxy-serviceとの統合は3d-3bタスクで実装予定。
 */
export class RewriteRuleMessagingService implements IRewriteRuleMessagingPort {
  private readonly repository: IRewriteRuleRepository;

  /**
   * コンストラクタ
   * @param repository リポジトリ（省略時はDexieRewriteRuleRepositoryを使用）
   */
  constructor(repository?: IRewriteRuleRepository) {
    this.repository = repository ?? new DexieRewriteRuleRepository();
  }

  /**
   * IDでルールを取得する
   * @param dto 取得リクエストDTO
   * @returns RewriteRuleDTO
   */
  async getById(dto: GetByIdRequestDTO): Promise<RewriteRuleDTO> {
    const rule = await this.repository.getById(dto.id);
    return this.convertEntityToDTO(rule);
  }

  /**
   * ルールの有効状態を更新する
   * @param dto 更新リクエストDTO
   */
  async updateActive(dto: UpdateRuleActiveRequestDTO): Promise<void> {
    const rule = await this.repository.getById(dto.id);
    const updatedRule = rule.withActive(dto.isActive);
    await this.repository.update(updatedRule);
  }

  /**
   * RewriteRuleエンティティをDTOに変換する
   * @param rule 変換元のRewriteRule
   * @returns RewriteRuleDTO
   */
  private convertEntityToDTO(rule: RewriteRule): RewriteRuleDTO {
    return {
      id: rule.id,
      oldString: rule.oldString,
      newString: rule.newString,
      urlPattern: rule.urlPattern,
      isRegex: rule.isRegex,
      isActive: rule.isActive
    };
  }
}
