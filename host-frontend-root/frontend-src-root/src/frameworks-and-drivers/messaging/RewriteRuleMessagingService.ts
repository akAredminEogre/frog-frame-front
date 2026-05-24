import { DeleteRuleRequestDTO } from 'src/frameworks-and-drivers/messaging/dto/request-dto/DeleteRuleRequestDTO';
import { GetByIdRequestDTO } from 'src/frameworks-and-drivers/messaging/dto/request-dto/GetByIdRequestDTO';
import { UpdateRuleActiveRequestDTO } from 'src/frameworks-and-drivers/messaging/dto/request-dto/UpdateRuleActiveRequestDTO';
import { RewriteRuleDTO } from 'src/frameworks-and-drivers/messaging/dto/RewriteRuleDTO';
import { getRewriteRuleProxyService } from 'src/frameworks-and-drivers/messaging/RewriteRuleProxyService';
import { IRewriteRuleMessagingPort } from 'src/interface-adapters/ports/IRewriteRuleMessagingPort';

/**
 * @webext-core/proxy-serviceを使用したRewriteRuleメッセージングサービス
 * Content Scriptで実行され、Background ScriptからのDB操作を仲介
 * ADR-002, ADR-003に従い、DTOを使用してメッセージング通信を行う
 */
export class RewriteRuleMessagingService implements IRewriteRuleMessagingPort {
  /**
   * すべてのルールを取得する
   * @webext-core/proxy-service 経由でBackground ScriptからDTOを取得
   * @returns RewriteRuleDTO配列
   */
  async getAll(): Promise<RewriteRuleDTO[]> {
    const proxyService = getRewriteRuleProxyService();
    return proxyService.getAllRules();
  }

  /**
   * IDでルールを取得する（スケルトン）
   * @param dto 取得リクエストDTO
   * @returns RewriteRuleDTO
   */
  async getById(dto: GetByIdRequestDTO): Promise<RewriteRuleDTO> {
    throw new Error(`Not implemented: getById with id=${dto.id}`);
  }

  /**
   * ルールの有効状態を更新する（スケルトン）
   * @param dto 更新リクエストDTO
   */
  async updateActive(dto: UpdateRuleActiveRequestDTO): Promise<void> {
    throw new Error(`Not implemented: updateActive with id=${dto.id}, isActive=${dto.isActive}`);
  }

  /**
   * ルールを削除する
   * @webext-core/proxy-service 経由でBackground Scriptに削除を依頼
   * @param dto 削除リクエストDTO
   */
  async delete(dto: DeleteRuleRequestDTO): Promise<void> {
    const proxyService = getRewriteRuleProxyService();
    await proxyService.deleteRule(dto.id);
  }
}
