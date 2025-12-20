import { defineProxyService } from '@webext-core/proxy-service';

import { GetByIdRequestDTO } from 'src/frameworks-and-drivers/messaging/dto/request-dto/GetByIdRequestDTO';
import { UpdateRuleActiveRequestDTO } from 'src/frameworks-and-drivers/messaging/dto/request-dto/UpdateRuleActiveRequestDTO';
import { RewriteRuleDTO } from 'src/frameworks-and-drivers/messaging/dto/RewriteRuleDTO';
import { IRewriteRuleMessagingPort } from 'src/interface-adapters/ports/IRewriteRuleMessagingPort';

/**
 * @webext-core/proxy-serviceを使用したRewriteRuleメッセージングサービス（スケルトン実装）
 * Background Scriptで実行され、他のコンテキスト（Rules Page等）からのDB操作を仲介
 * ADR-002, ADR-003に従い、DTOを使用してメッセージング通信を行う
 *
 * 注意: 現在はスケルトン実装のみ。実際のビジネスロジック（DB操作等）は別タスクで実装予定。
 */
export class RewriteRuleMessagingService implements IRewriteRuleMessagingPort {
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
}

/**
 * proxy-service を使用してサービスを定義
 * Background Scriptで registerRewriteRuleMessagingService() を呼び出して登録
 * 他のコンテキストでは getRewriteRuleMessagingService() でプロキシを取得
 */
export const [registerRewriteRuleMessagingService, getRewriteRuleMessagingService] = defineProxyService(
  'RewriteRuleMessagingService',
  () => new RewriteRuleMessagingService()
);
