import { defineProxyService } from '@webext-core/proxy-service';

import { RewriteRuleDTO } from 'src/frameworks-and-drivers/messaging/dto/RewriteRuleDTO';
import { GetByIdRequestDTO } from 'src/frameworks-and-drivers/messaging/dto/request-dto/GetByIdRequestDTO';
import { UpdateRuleActiveRequestDTO } from 'src/frameworks-and-drivers/messaging/dto/request-dto/UpdateRuleActiveRequestDTO';
import { DexieRewriteRuleRepository } from 'src/infrastructure/persistence/indexeddb/DexieRewriteRuleRepository';
import { IRewriteRuleMessagingPort } from 'src/interface-adapters/ports/IRewriteRuleMessagingPort';

/**
 * @webext-core/proxy-serviceを使用したRewriteRuleプロキシサービス
 * Background Scriptで実行され、他のコンテキスト（Content Script等）からのDB操作を仲介
 * ADR-002, ADR-003に従い、DTOを使用してメッセージング通信を行う
 *
 * ProxyServiceはDTOをそのまま受け渡す
 * Entity ↔ DTO 変換は RewriteRuleMapper の責務
 */
class RewriteRuleProxyServiceImpl implements IRewriteRuleMessagingPort {
  private readonly repository: DexieRewriteRuleRepository;

  constructor() {
    this.repository = new DexieRewriteRuleRepository();
  }

  /**
   * すべてのルールを取得する
   * @returns RewriteRuleDTO配列
   */
  async getAll(): Promise<RewriteRuleDTO[]> {
    const rules = await this.repository.getAll();
    return rules.toArray().map((rule) => ({
      id: rule.id,
      oldString: rule.oldString,
      newString: rule.newString,
      urlPattern: rule.urlPattern,
      isRegex: rule.isRegex,
      isActive: rule.isActive,
    }));
  }

  /**
   * IDでルールを取得する
   * @param request 取得リクエストDTO
   * @returns RewriteRuleDTO
   */
  async getById(request: GetByIdRequestDTO): Promise<RewriteRuleDTO> {
    const rule = await this.repository.getById(request.id);
    return {
      id: rule.id,
      oldString: rule.oldString,
      newString: rule.newString,
      urlPattern: rule.urlPattern,
      isRegex: rule.isRegex,
      isActive: rule.isActive,
    };
  }

  /**
   * ルールの有効状態を更新する
   * @param request 更新リクエストDTO
   */
  async updateActive(request: UpdateRuleActiveRequestDTO): Promise<void> {
    const rule = await this.repository.getById(request.id);
    const updatedRule = rule.withActive(request.isActive);
    await this.repository.update(updatedRule);
  }
}

export const [registerRewriteRuleProxyService, getRewriteRuleProxyService] =
  defineProxyService('RewriteRuleProxyService', () => new RewriteRuleProxyServiceImpl());
